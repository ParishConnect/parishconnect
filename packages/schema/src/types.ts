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
export type Freq = "YEARLY" | "MONTHLY" | "WEEKLY" | "DAILY" | "HOURLY" | "MINUTELY" | "SECONDLY"

export type RRULEByDay = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU"

export type SupportedSchemaDaysOfWeek = Exclude<
	Extract<DayOfWeek, string>,
	"https://schema.org/PublicHolidays" | "PublicHolidays"
>
