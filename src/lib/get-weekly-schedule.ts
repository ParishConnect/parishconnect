import { Temporal } from "@js-temporal/polyfill"
import { unfurlEventsFromLdJson } from "./ld+json-to-rrule.ts"
import type { CatholicChurchOrganization, WeeklySchedule } from "./types.ts"
import { betweenNowAndNextWeek } from "./utils.ts"

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

export function weeklyScheduleToLocale(weeklySchedule: WeeklySchedule): { [dayOfWeek: string]: string[] } {
	const localeSchedule: { [dayOfWeek: string]: string[] } = {}

	for (const [dayOfWeek, events] of Object.entries(weeklySchedule)) {
		localeSchedule[dayOfWeek] = events.map((event) => {
			const options: Intl.DateTimeFormatOptions = {
				hour: "numeric",
				minute: "2-digit",
				timeZoneName: event.dateTime.timeZoneId !== Temporal.Now.timeZoneId() ? "shortGeneric" : undefined,
			}
			return event.dateTime.toLocaleString(undefined, options)
		})
	}

	return localeSchedule
}
