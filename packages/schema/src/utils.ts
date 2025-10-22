import type { Duration, Event, Integer, Role, TextObject } from "schema-dts"
import { Primitive, SchemaValue, type CatholicChurchOrganization, type IdReference, type Indexable } from "./types.ts"

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
