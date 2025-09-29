import { Temporal } from '@js-temporal/polyfill'
import { RRuleTemporal } from 'rrule-temporal'
import { mapByDayToRRule, safelyParseJSON } from './utils'
import type { Freq } from './types'

export function ldJsonToRRule(ldJson: string): string {
  const obj = safelyParseJSON(ldJson)
  if (!obj) return ''

  if (obj['@type'] !== 'Event' || !obj.eventSchedule) {
    console.error('Invalid schema.org Event with Schedule')
    return ''
  }

  const schedule = obj.eventSchedule
  if (schedule['@type'] !== 'Schedule') {
    console.error('Invalid schema.org Schedule')
    return ''
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

  ;(
    ['startDate', 'repeatFrequency', 'startTime', 'scheduleTimezone'] as const
  ).forEach((field) => {
    if (!schedule[field]) {
      console.error(`Missing required field: ${field}`)
      return ''
    }
  })

  // Map repeatFrequency to RRule freq and interval
  let frequency: Freq | '' = ''
  let interval = 1

  const duration = Temporal.Duration.from(repeatFrequency)

  if (!duration.toString()) {
    console.error('Invalid repeatFrequency format')
    return ''
  }

  if (duration.weeks > 0) {
    frequency = 'WEEKLY'
    interval = duration.weeks
  } else if (duration.days > 0) {
    frequency = 'DAILY'
    interval = duration.days
  } else if (duration.months > 0) {
    frequency = 'MONTHLY'
    interval = duration.months
  } else if (duration.years > 0) {
    frequency = 'YEARLY'
    interval = duration.years
  } else {
    console.error('Unsupported repeatFrequency')
    return ''
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
          : Temporal.PlainTime.from(startTime).add(
              Temporal.Duration.from(schedule.duration || 'PT1H')
            ),
      })
    : undefined

  const rule = new RRuleTemporal({
    dtstart,
    until: dtend,
    freq: frequency,
    interval,
    byDay: byDay ? [byDay] : undefined,
    byMonth: byMonth ? [byMonth] : undefined,
    byMonthDay: byMonthDay ? [byMonthDay] : undefined,
    bySetPos: byMonthWeek ? [byMonthWeek] : undefined,
    count: repeatCount ? repeatCount : undefined,
    tzid: scheduleTimezone || Temporal.Now.timeZoneId(),
  })

  return rule.toString()
}
