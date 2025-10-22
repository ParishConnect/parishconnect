import { Temporal } from "@js-temporal/polyfill"
import { RRuleTemporal } from "rrule-temporal"
import type { Event, Schedule } from "schema-dts"
import type { RruleWithData as RRuleWithData, ScheduleData } from "./types.ts"
import {
	extractSchemaNumber,
	extractSchemaText,
	isEvent,
	isIdReference,
	type CatholicChurchOrganization,
	type Freq,
} from "@parishconnect/schema"
import { mapByDayToRRule } from "./utils.ts"

export function ldJsonToRRule(event: Event): RRuleTemporal[] {
	const results: RRuleTemporal[] = []
	let schedules = event.eventSchedule

	if (!event || typeof event !== "object" || event["@type"] !== "Event") {
		console.error("Invalid schema.org Event")
		return []
	}

	if (!schedules || !Array.isArray(schedules)) {
		console.error("Event does not have eventSchedule")
		return []
	}

	schedules = schedules as Schedule[]

	for (const schedule of schedules) {
		if (isIdReference(schedule)) {
			console.warn("Skipping schedule reference:", schedule["@id"])
			continue
		}

		if (schedule["@type"] !== "Schedule") {
			console.error("Invalid schema.org Event with Schedule")
			return []
		}

		// Extract relevant fields
		const startDate = extractSchemaText(schedule.startDate)
		const endDate = extractSchemaText(schedule.endDate)

		const repeatFrequency = extractSchemaText(schedule.repeatFrequency.toString())
		const repeatCount = extractSchemaNumber(schedule.repeatCount)
		const byDay = mapByDayToRRule(schedule.byDay)
		const byMonth = extractSchemaNumber(schedule.byMonth)
		const byMonthDay = extractSchemaNumber(schedule.byMonthDay)
		const byMonthWeek = extractSchemaNumber(schedule.byMonthWeek)

		const startTime = extractSchemaText(schedule.startTime)
		const endTime = extractSchemaText(schedule.endTime)

		const scheduleDuration = extractSchemaText(schedule.duration)
		const scheduleTimezone = extractSchemaText(schedule.scheduleTimezone.toString())

		if (!startDate || !repeatFrequency || !startTime || !scheduleTimezone) {
			console.error("Missing required schedule fields")
			return []
		}

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
						: Temporal.PlainTime.from(startTime).add(Temporal.Duration.from(scheduleDuration || "PT1H")),
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
export function unfurlEventsFromLdJson(church: CatholicChurchOrganization): RRuleWithData[] {
	if (!church || typeof church !== "object") return []
	let event = church?.event

	// TODO: handle arrays of events properly
	if (Array.isArray(event)) event = event.at(0) as Event | undefined

	let results: RRuleWithData[] = []

	if (isIdReference(event) || !isEvent(event)) return []

	if (Array.isArray(event)) {
		for (const item of event) {
			results = results.concat(unfurlEventsFromLdJson(item))
		}
	} else {
		if (event.eventSchedule) {
			const rrule = ldJsonToRRule(event).map((rrule) => ({
				rrule,
				data: {
					name: extractSchemaText(event.name.toString()) ?? undefined,
					description: extractSchemaText(event.description.toString()) ?? undefined,
					url: extractSchemaText(event.url) ?? undefined,
					duration: extractSchemaText(event.duration) ?? undefined,
				} satisfies ScheduleData,
			}))

			if (rrule) {
				results.push(...rrule)
			}
		}

		for (const key in event) {
			if (event.hasOwnProperty(key)) {
				results = results.concat(unfurlEventsFromLdJson((event as any)[key]))
			}
		}
	}

	return results
}
