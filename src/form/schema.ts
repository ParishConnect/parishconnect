import z from "zod"
import { shortUUID } from "../lib/utils"

export const ServiceTypes = ["mass", "confession", "adoration"] as const
export const WeekDaysLD = [
	"https://schema.org/Monday",
	"https://schema.org/Tuesday",
	"https://schema.org/Wednesday",
	"https://schema.org/Thursday",
	"https://schema.org/Friday",
	"https://schema.org/Saturday",
	"https://schema.org/Sunday",
] as const

export const CatholicChurchOrganizationSchema = z
	.object({
		"@context": z.literal("https://schema.org").default("https://schema.org"),
		"@type": z.literal("CatholicChurch").default("CatholicChurch"),
		"@id": z.string().includes("#church"),
		name: z.string().min(3, "Name is required"),
		url: z.string(),
		telephone: z.string().optional(),
		openingHours: z.string().optional(),
		isAccessibleForFree: z.literal(true).default(true),
		publicAccess: z.literal(true).default(true),

		availableLanguage: z.array(z.string()).optional(),

		keywords: z.string().optional(),

		potentialAction: z
			.object({
				"@type": z.literal("DonateAction").default("DonateAction"),
				recipient: z.object({ "@id": z.string() }),
				target: z.string(),
				priceCurrency: z.string().optional(),
				name: z.string(),
			})
			.optional(),

		address: z
			.object({
				"@id": z.string().includes("#address"),
				"@type": z.literal("PostalAddress").default("PostalAddress"),
				addressCountry: z.string(),
				addressLocality: z.string(),
				addressRegion: z.string(),
				postalCode: z.string(),
				streetAddress: z.string(),
				availableLanguage: z.array(z.string()).optional(),
			})
			.optional(),

		event: z
			.array(
				z
					.object({
						"@type": z.literal("Event").default("Event"),
						type: z.enum(ServiceTypes).default("mass"),
						id: z.string(),
						url: z.string().optional(),
						name: z.string(),
						duration: z.string().optional(),
						location: z
							.object({
								"@type": z.literal("Place").default("Place"),
								name: z.string(),
								address: z.object({ "@id": z.string().includes("#address") }),
							})
							.optional(),
						organizer: z.object({ "@id": z.string().includes("#church") }).optional(),
						description: z.string().optional(),
						eventStatus: z.string(),
						startDate: z.string(),
						eventSchedule: z.array(
							z.object({
								"@type": z.literal("Schedule").default("Schedule"),
								startDate: z.string(),
								startTime: z.string(),
								repeatFrequency: z.string(),
								description: z.string().optional(),
								isVigil: z.boolean().optional(),
								byDay: z.array(z.enum(WeekDaysLD)),
								scheduleTimezone: z.string(),
							})
						),
					})
					.default({
						"@type": "Event",
						type: "mass",
						id: shortUUID(),
						name: "Holy Mass",
						eventStatus: "https://schema.org/EventScheduled",
						startDate: new Date().toISOString().split("T")[0],
						eventSchedule: [],
					})
			)
			.default([]),
	})
	.transform((schema) => {
		// set @ids
		if (schema.potentialAction) {
			schema.potentialAction.recipient["@id"] = schema["@id"]
		}

		if (schema.event && schema.event.length > 0) {
			schema.event[0].organizer = { "@id": schema["@id"] }
			if (schema.address) {
				if (!schema.event[0].location) {
					schema.event[0].location = {
						"@type": "Place",
						name: schema.name,
						address: { "@id": schema.address["@id"] },
					}
				} else {
					schema.event[0].location.address = { "@id": schema.address["@id"] }
				}
			}
		}

		if (schema.event) {
			schema.event.forEach((event) => {
				if (!event.location) {
					// @ts-expect-error -- just need to stub this out
					event.location = {}
				}

				event.location!["@type"] = "Place"
				event.location!.name = schema.name
				if (schema.address) {
					event.location!.address = { "@id": schema.address ? schema.address["@id"] : `${schema["@id"]}#address` }
				}
			})
		}
		return schema
	})
	.refine(
		(schema) => {
			const idsMatch =
				(schema.potentialAction?.recipient ? schema.potentialAction?.recipient["@id"] === schema["@id"] : true) &&
				(schema.event?.[0]?.organizer ? schema.event?.[0]?.organizer?.["@id"] === schema["@id"] : true) &&
				(schema.event?.[0]?.location?.address
					? schema.event?.[0]?.location?.address["@id"] === schema.address?.["@id"]
					: true)
			return idsMatch
		},
		{
			message: "All @id references must match the main @id",
		}
	)

export type CatholicChurchOrganization = z.infer<typeof CatholicChurchOrganizationSchema>
