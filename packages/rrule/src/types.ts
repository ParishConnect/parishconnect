import type { Temporal } from "@js-temporal/polyfill"
import type { RRuleTemporal } from "rrule-temporal"

export type ScheduleData = {
	name?: string
	description?: string
	url?: string
	duration?: string
}

export type WeeklySchedule = {
	[dayOfWeek: number]: (ScheduleData & {
		dateTime: Temporal.ZonedDateTime
	})[]
}

export type RruleWithData = {
	rrule: RRuleTemporal
	data: ScheduleData
}
