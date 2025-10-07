import { Temporal } from "@js-temporal/polyfill"
import type { DayOfWeek, Duration, Event, Integer, Role, Schedule, Text, TextObject } from "schema-dts"
import type {
	CatholicChurchOrganization,
	IdReference,
	Indexable,
	Primitive,
	RRULEByDay,
	SchemaValue,
	SupportedSchemaDaysOfWeek,
} from "./types.ts"

export const betweenNowAndNextWeek = [
	Temporal.Now.zonedDateTimeISO().startOfDay(),
	Temporal.Now.zonedDateTimeISO().add({ days: 7 }).startOfDay().subtract({ milliseconds: 1 }),
] as const

export function getDayInSameWeek(date: Temporal.ZonedDateTime, destDayOfWeek: number): Temporal.ZonedDateTime {
	return date.add({ days: destDayOfWeek - date.dayOfWeek })
}

export function safelyParseJSON(jsonString: string): any | null {
	try {
		return JSON.parse(jsonString)
	} catch (e) {
		console.error("Failed to parse JSON:", e)
		return null
	}
}

export function unleaf(obj: SchemaValue<any, any>): Primitive {
	if (Array.isArray(obj)) {
		return obj.map(unleaf)
	} else if (obj && typeof obj === "object") {
		if (obj && typeof obj === "object" && "@value" in obj) {
			return (obj as Role<any, any>)["@value"]
		}
		return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, unleaf(value)]))
	}

	return obj
}

export function isIndexable(value: any): value is Indexable {
	return typeof value === "string" || typeof value === "number" || typeof value === "symbol"
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

export function isEvent(obj: any): obj is Event {
	return obj && typeof obj === "object" && obj["@type"] === "Event"
}

export function isIdReference(obj: any): obj is IdReference {
	return obj && typeof obj === "object" && typeof obj["@id"] === "string" && Object.keys(obj).length === 1
}

export function isArrayOfEvents(obj: any): obj is Event[] {
	return Array.isArray(obj) && obj.every(isEvent)
}

export function isCatholicChurchOrganization(obj: any): obj is CatholicChurchOrganization {
	return obj && typeof obj === "object" && obj["@type"] === "CatholicChurch"
}

export function extractSchemaText<P extends string>(
	text: SchemaValue<Text | TextObject | Duration | IdReference, P> | Text | undefined
): string | null {
	if (typeof text === "string") {
		return text
	} else if (Array.isArray(text)) {
		return text.map(extractSchemaText).join(" ")
	} else if (text && typeof text === "object") {
		if ("@value" in text) {
			return String((text as Role<any, any>)["@value"])
		} else if ("textValue" in text) {
			return String(text.textValue)
		}
	}
	return null
}

export function extractSchemaNumber<P extends string>(
	num: SchemaValue<Integer | IdReference, P> | number | undefined
): number | null {
	if (typeof num === "number") {
		return num
	} else if (Array.isArray(num)) {
		return num.map(extractSchemaNumber).find(Boolean) || null
	} else if (num && typeof num === "object") {
		if ("@value" in num) {
			return Number((num as Role<any, any>)["@value"])
		} else if ("textValue" in num) {
			return Number(num.textValue)
		}
	}
	return null
}
