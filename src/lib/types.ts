import type { Temporal } from "@js-temporal/polyfill"
import type { RRuleTemporal } from "rrule-temporal"
import type { CatholicChurch, DayOfWeek, Role } from "schema-dts"

export type SchemaValue<T, TProperty extends string> = T | Role<T, TProperty> | readonly (T | Role<T, TProperty>)[]
/**
 * Unwrap to a primitive type from a schema-dts schema object.
 */
export type UnwrapSchemaValue<T> = Extract<T, string | number | boolean>
export type ExtractSchemaValue<T> = T extends SchemaValue<infer U, any> ? U : never

export type IdReference = {
	/** IRI identifying the canonical address of this object. */
	"@id": string
}

export type Indexable = string | number | symbol
export type Primitive = string | number | boolean | null | undefined | Array<Primitive> | { [key: string]: Primitive }

export type CatholicChurchOrganization = Exclude<CatholicChurch, string>
export type Freq = ReturnType<(typeof RRuleTemporal)["prototype"]["options"]>["freq"]

export type RRULEByDay = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU"

export type SupportedSchemaDaysOfWeek = Exclude<
	Extract<DayOfWeek, string>,
	"https://schema.org/PublicHolidays" | "PublicHolidays"
>

export type ScheduleData = {
	name?: string | SchemaValue<string, "name">
	description?: string | SchemaValue<string, "description">
	url?: string | SchemaValue<string, "url">
	duration?: string | SchemaValue<string, "duration">
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
