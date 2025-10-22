import { Temporal } from "@js-temporal/polyfill"
import { isIndexable, type RRULEByDay, type SupportedSchemaDaysOfWeek } from "@parishconnect/schema"
import type { DayOfWeek, Schedule } from "schema-dts"

export const betweenNowAndNextWeek = [
	Temporal.Now.zonedDateTimeISO().startOfDay(),
	Temporal.Now.zonedDateTimeISO().add({ days: 7 }).startOfDay().subtract({ milliseconds: 1 }),
] as const

export function getDayInSameWeek(date: Temporal.ZonedDateTime, destDayOfWeek: number): Temporal.ZonedDateTime {
	return date.add({ days: destDayOfWeek - date.dayOfWeek })
}

export function mapByDayToRRule(byDay: Schedule["byDay"] | undefined): RRULEByDay[] {
	if (!byDay) return []

	const dayMap: Record<SupportedSchemaDaysOfWeek, RRULEByDay> = {
		Monday: "MO",
		Tuesday: "TU",
		Wednesday: "WE",
		Thursday: "TH",
		Friday: "FR",
		Saturday: "SA",
		Sunday: "SU",
		"https://schema.org/Monday": "MO",
		"https://schema.org/Tuesday": "TU",
		"https://schema.org/Wednesday": "WE",
		"https://schema.org/Thursday": "TH",
		"https://schema.org/Friday": "FR",
		"https://schema.org/Saturday": "SA",
		"https://schema.org/Sunday": "SU",
	}

	if (Array.isArray(byDay)) {
		return (
			byDay
				.filter(isIndexable)
				.map((day) => dayMap[day as SupportedSchemaDaysOfWeek])
				.filter(Boolean) || null
		)
	}

	return [dayMap[byDay as SupportedSchemaDaysOfWeek]].filter(Boolean)
}

export function mapRRuleToByDay(byDay: RRULEByDay): DayOfWeek | undefined {
	const dayMap: Record<RRULEByDay, DayOfWeek> = {
		MO: "https://schema.org/Monday",
		TU: "https://schema.org/Tuesday",
		WE: "https://schema.org/Wednesday",
		TH: "https://schema.org/Thursday",
		FR: "https://schema.org/Friday",
		SA: "https://schema.org/Saturday",
		SU: "https://schema.org/Sunday",
	}
	return dayMap[byDay] || undefined
}
