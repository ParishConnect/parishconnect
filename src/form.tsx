import { createFormHook, createFormHookContexts, useForm, type AnyFieldApi } from "@tanstack/react-form"
import i18next from "i18next"
import { useState } from "preact/hooks"
import z from "zod"
import css from "./form.css?inline"

const CatholicChurchOrganizationSchema = z
	.object({
		"@context": z.literal("https://schema.org").default("https://schema.org"),
		"@type": z.literal("CatholicChurch").default("CatholicChurch"),
		"@id": z.string().includes("#church"),
		name: z.string().min(3, "Name is required"),
		url: z.string(),
		telephone: z.string().optional(),
		openingHours: z.string().optional(),
		isAccessibleForFree: z.boolean().optional(),
		publicAccess: z.boolean().optional(),

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

		event: z.array(
			z.object({
				"@type": z.literal("Event").default("Event"),
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
						byDay: z.array(z.string()),
						scheduleTimezone: z.string(),
					})
				),
			})
		),
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

type CatholicChurchOrganization = z.infer<typeof CatholicChurchOrganizationSchema>

function CheckboxField({ field }: { field: AnyFieldApi }) {
	return (
		<div className="form-field checkbox-field">
			<label htmlFor={field.name}>
				<input
					type="checkbox"
					id={field.name}
					name={field.name}
					checked={field.state.value}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.currentTarget.checked)}
				/>
				{i18next.t(`labels.${field.name}`)}
			</label>
			<FieldInfo field={field} />
		</div>
	)
}

function TextField({ field }: { field: AnyFieldApi }) {
	return (
		<div className="form-field text-field">
			<label htmlFor={field.name}>{i18next.t(`labels.${field.name}`)}</label>
			<input
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.currentTarget.value)}
			/>
			<FieldInfo field={field} />
		</div>
	)
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
	return (
		<>
			{field.state.meta.isTouched && !field.state.meta.isValid ? <em>{field.state.meta.errors.join(", ")}</em> : null}
			{field.state.meta.isValidating ? "Validating..." : null}
		</>
	)
}

const { fieldContext, formContext } = createFormHookContexts()
const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		CheckboxField,
	},
	formComponents: {},
	fieldContext,
	formContext,
})

export default function ParishConnectForm() {
	const [outputLD, setOutputLD] = useState<string>()
	const hostUrl = window.location.host

	const form = useAppForm({
		defaultValues: {
			name: window.document.title,
			url: hostUrl,
			"@id": `https://${hostUrl}#church`,
			event: [],
		} as Partial<CatholicChurchOrganization>,
		validators: { onChange: CatholicChurchOrganizationSchema },
		listeners: {
			onChange(props) {
				setOutputLD(JSON.stringify(CatholicChurchOrganizationSchema.parse(props.formApi.state.values), null, 2))
			},
		},
		canSubmitWhenInvalid: true,
		onSubmit: async ({ value }) => {
			const result = CatholicChurchOrganizationSchema.parse(value)

			console.log(result)
		},
	})

	return (
		<div className="form-container">
			<style>{css}</style>
			<output style={{ whiteSpace: "pre-wrap" }}>{outputLD}</output>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}
			>
				<form.AppField name="name" children={(field) => <field.TextField field={field} />} />
				<form.AppField name="url" children={(field) => <field.TextField field={field} />} />
				<form.AppField name="telephone" children={(field) => <field.TextField field={field} />} />
				<form.AppField name="keywords" children={(field) => <field.TextField field={field} />} />
				<form.AppField name="openingHours" children={(field) => <field.TextField field={field} />} />
				<form.AppField name="isAccessibleForFree" children={(field) => <field.CheckboxField field={field} />} />
				<form.AppField name="publicAccess" children={(field) => <field.CheckboxField field={field} />} />

				<button type="submit" disabled={form.state.isSubmitting}>
					{i18next.t("submit")}
				</button>
			</form>
		</div>
	)
}
