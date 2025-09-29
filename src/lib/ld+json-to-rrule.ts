import { Temporal } from "@js-temporal/polyfill"
import { RRuleTemporal } from "rrule-temporal"
import type { Freq, LdJsonSchedule } from "./types"
import { mapByDayToRRule } from "./utils"

export function ldJsonToRRule(schedules: LdJsonSchedule[]): RRuleTemporal[] {
  const results: RRuleTemporal[] = []

  for (const schedule of schedules) {
    if (schedule["@type"] !== "Schedule") {
      console.error("Invalid schema.org Event with Schedule")
      return []
    }
    console.log(schedule)

    if (schedule["@type"] !== "Schedule") {
      console.error("Invalid schema.org Schedule")
      return []
    }

    // Extract relevant fields
    const startDate = schedule.startDate
    const endDate = schedule.endDate

    const repeatFrequency = schedule.repeatFrequency
    const repeatCount = schedule.repeatCount
    const byDay = mapByDayToRRule(schedule.byDay)
    const byMonth = schedule.byMonth
    const byMonthDay = schedule.byMonthDay
    const byMonthWeek = schedule.byMonthWeek

    const startTime = schedule.startTime
    const endTime = schedule.endTime

    const scheduleTimezone = schedule.scheduleTimezone

    ;(["startDate", "repeatFrequency", "startTime", "scheduleTimezone"] as const).forEach((field) => {
      if (!schedule[field]) {
        console.error(`Missing required field: ${field}`)
        return ""
      }
    })

    // Map repeatFrequency to RRule freq and interval
    let frequency: Freq | "" = ""
    let interval = 1

    const duration = Temporal.Duration.from(repeatFrequency)

    if (!duration.toString()) {
      console.error("Invalid repeatFrequency format")
      return []
    }

    if (duration.weeks > 0) {
      frequency = "WEEKLY"
      interval = duration.weeks
    } else if (duration.days > 0) {
      frequency = "DAILY"
      interval = duration.days
    } else if (duration.months > 0) {
      frequency = "MONTHLY"
      interval = duration.months
    } else if (duration.years > 0) {
      frequency = "YEARLY"
      interval = duration.years
    } else {
      console.error("Unsupported repeatFrequency")
      return []
    }

    const dtstart = Temporal.PlainDate.from(startDate).toZonedDateTime({
      timeZone: scheduleTimezone,
      plainTime: Temporal.PlainTime.from(startTime),
    })

    const dtend = endDate
      ? Temporal.PlainDate.from(endDate).toZonedDateTime({
          timeZone: scheduleTimezone,
          plainTime: endTime
            ? Temporal.PlainTime.from(endTime)
            : Temporal.PlainTime.from(startTime).add(Temporal.Duration.from(schedule.duration || "PT1H")),
        })
      : undefined

    const rule = new RRuleTemporal({
      dtstart,
      until: dtend,
      freq: frequency,
      interval,
      byDay: byDay ? byDay : undefined,
      byMonth: byMonth ? [byMonth] : undefined,
      byMonthDay: byMonthDay ? [byMonthDay] : undefined,
      bySetPos: byMonthWeek ? [byMonthWeek] : undefined,
      count: repeatCount ? repeatCount : undefined,
      tzid: scheduleTimezone || Temporal.Now.timeZoneId(),
    })
    results.push(rule)
  }

  return results
}

// traverse an object recursively to find all Event objects with eventSchedule
// event objects can be nested arbitrarily deep within the input object but they have a @type of "Event"
export function unfurlEventsFromLdJson(obj: any): RRuleTemporal[] {
  if (!obj || typeof obj !== "object") return []

  let results: RRuleTemporal[] = []

  if (Array.isArray(obj)) {
    for (const item of obj) {
      results = results.concat(unfurlEventsFromLdJson(item))
    }
  } else {
    if (obj["@type"] === "Event" && obj.eventSchedule) {
      console.log("Found Event with Schedule:", obj || "Unnamed Event")

      const eventSchedules = Array.isArray(obj.eventSchedule) ? obj.eventSchedule : [obj.eventSchedule]
      const rrule = ldJsonToRRule(eventSchedules)

      if (rrule) {
        results.push(...rrule)
      }
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        results = results.concat(unfurlEventsFromLdJson((obj as any)[key]))
      }
    }
  }

  return results
}
