import type { RRuleTemporal } from "rrule-temporal"

export type Freq = ReturnType<(typeof RRuleTemporal)["prototype"]["options"]>["freq"]

export type LdJsonByDay = `https://schema.org/${
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"}`

export type LdJsonSchedule = {
  "@context": "https://schema.org"
  "@type": "Schedule"

  startDate: string // ISO 8601 date string
  endDate?: string // ISO 8601 date string

  duration?: string // ISO 8601 duration string, e.g., "PT1H" for one hour

  repeatFrequency: string // e.g., "P1W" for weekly
  repeatCount?: number // e.g., 10 for ten occurrences

  byDay?: LdJsonByDay | LdJsonByDay[] // e.g., schema.org days like "MO", "TU"'
  byMonth?: number // e.g., 5 for May
  byMonthDay?: number // e.g., 15 for the 15th of the month
  byMonthWeek?: number // e.g., 2 for the second week of the month

  startTime: string // e.g., "14:00"
  endTime?: string // e.g., "15:00"

  scheduleTimezone: string // e.g., "America/New_York"
}

export type LdJsonEventSchedule = {
  eventSchedule: LdJsonSchedule | LdJsonSchedule[]
}
