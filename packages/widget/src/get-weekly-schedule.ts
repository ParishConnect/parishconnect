import { Temporal } from "@js-temporal/polyfill"
import { unfurlEventsFromLdJson, betweenNowAndNextWeek, extractSchemaText } from "@parishconnect/rrule-converter"
import type { CatholicChurchOrganization, ScheduleData, WeeklySchedule } from "@parishconnect/schema"

export function getWeeklySchedule(church: CatholicChurchOrganization): WeeklySchedule {
	const rules = unfurlEventsFromLdJson(church)
	const weeklySchedule: WeeklySchedule = {}

	for (const { rrule, data } of rules) {
		const occurrences = rrule.between(betweenNowAndNextWeek[0], betweenNowAndNextWeek[1], true)

		for (const dateTime of occurrences) {
			const dayOfWeek = dateTime.dayOfWeek

			if (!weeklySchedule[dayOfWeek]) {
				weeklySchedule[dayOfWeek] = []
			}

			weeklySchedule[dayOfWeek].push({
				name: data.name,
				description: data.description,
				url: data.url,
				duration: data.duration ?? "PT1H",
				dateTime,
			})
		}
	}

	return weeklySchedule
}

export function weeklyScheduleToLocale(weeklySchedule: WeeklySchedule): {
	[dayOfWeek: string]: ({ time: string } & ScheduleData)[]
} {
	const localeSchedule: {
		[dayOfWeek: string]: ({ time: string } & ScheduleData)[]
	} = {}

	for (const [dayOfWeek, events] of Object.entries(weeklySchedule)) {
		localeSchedule[dayOfWeek] = events.map(({ dateTime, description, duration, name, url }) => {
			const options: Intl.DateTimeFormatOptions = {
				hour: "numeric",
				minute: "2-digit",
				timeZoneName: dateTime.timeZoneId !== Temporal.Now.timeZoneId() ? "shortGeneric" : undefined,
			}
			return {
				time: dateTime.toLocaleString(undefined, options),
				name: extractSchemaText(name),
				description: extractSchemaText(description),
				duration: extractSchemaText(duration),
				url: extractSchemaText(url),
			} as { time: string } & ScheduleData
		})
	}

	return localeSchedule
}
