import type { WithContext } from "schema-dts"
import type { CatholicChurchOrganization } from "../lib/types.ts"

export const exampleJsonLd = {
	"@context": "https://schema.org",
	"@type": "CatholicChurch",
	"@id": "https://www.bskchurch.ca#church",
	name: "Holy Trinity Parish",
	url: "https://www.bskchurch.ca",
	telephone: "+1-519-742-5061",
	openingHours: "Tu,We,Th 09:00-16:00",
	isAccessibleForFree: true,
	publicAccess: true,
	smokingAllowed: false,

	keywords: "Catholic, Church, Parish, Kitchener, Mass, Sacraments",

	potentialAction: {
		"@type": "DonateAction",
		recipient: { "@id": "https://www.bskchurch.ca#church" },
		target: "https://www.bskchurch.ca/giving-options",
		priceCurrency: "CAD",
		name: "Donate to Holy Trinity Parish",
	},

	address: {
		"@id": "https://www.bskchurch.ca#address",
		"@type": "PostalAddress",
		addressCountry: "CA",
		addressLocality: "Kitchener",
		addressRegion: "ON",
		postalCode: "N2E 2N6",
		streetAddress: "305 Laurentian Drive",
		availableLanguage: ["en"],
	},

	event: [
		{
			"@type": "Event",
			url: "https://www.bskchurch.ca",
			name: "Holy Mass",
			duration: "PT1H",
			location: {
				"@type": "Place",
				name: "Holy Trinity Parish",
				address: { "@id": "https://www.bskchurch.ca#address" },
			},
			organizer: { "@id": "https://www.bskchurch.ca#church" },
			description: "Join us for Holy Mass at Holy Trinity Parish.",
			eventStatus: "https://schema.org/EventScheduled",
			startDate: "2023-01-01",
			eventSchedule: [
				{
					"@type": "Schedule",
					startDate: "2023-01-01",
					startTime: "09:00",
					repeatFrequency: "P1W",
					description: "Daily Mass",
					byDay: [
						"https://schema.org/Monday",
						"https://schema.org/Tuesday",
						"https://schema.org/Wednesday",
						"https://schema.org/Thursday",
						"https://schema.org/Friday",
					],
					scheduleTimezone: "America/Toronto",
				},
				{
					"@type": "Schedule",
					startDate: "2023-01-01",
					startTime: "17:00",
					repeatFrequency: "P1W",
					byDay: ["https://schema.org/Saturday"],
					scheduleTimezone: "America/Toronto",
				},
				{
					"@type": "Schedule",
					startDate: "2023-01-01",
					startTime: "09:00",
					repeatFrequency: "P1W",
					byDay: ["https://schema.org/Sunday"],
					scheduleTimezone: "America/Toronto",
				},
				{
					"@type": "Schedule",
					startDate: "2023-01-01",
					startTime: "11:00",
					repeatFrequency: "P1W",
					byDay: ["https://schema.org/Sunday"],
					scheduleTimezone: "America/Toronto",
				},
			],
		},
	],
} satisfies WithContext<CatholicChurchOrganization>
