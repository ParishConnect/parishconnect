import i18next from "i18next"
import { useState } from "react"
import { shortUUID } from "../lib/utils.ts"
import { useAppForm } from "./fields.tsx"
// import "./form.css"
import {
	CatholicChurchOrganizationSchema,
	ServiceTypes,
	WeekDaysLD,
	type CatholicChurchOrganization,
} from "./schema.ts"

export default function ParishConnectForm() {
	const [outputLD, setOutputLD] = useState<string>()
	const hostUrl = window.location.host

	const form = useAppForm({
		defaultValues: {
			name: window.document.title,
			url: hostUrl,
			"@id": `https://${hostUrl}#church`,
			event: [
				{
					"@type": "Event",
					id: shortUUID(),
					type: "mass",
					name: "Holy Mass",
					eventStatus: "https://schema.org/EventScheduled",
					eventSchedule: [],
					startDate: new Date().toISOString().split("T")[0],
				},
			],
		} as Partial<CatholicChurchOrganization>,
		validators: { onChange: CatholicChurchOrganizationSchema },
		listeners: {
			onMount(props) {
				setOutputLD(JSON.stringify(CatholicChurchOrganizationSchema.parse(props.formApi.state.values), null, 2))
			},
			onChange(props) {
				setOutputLD(JSON.stringify(CatholicChurchOrganizationSchema.parse(props.formApi.state.values), null, 2))
			},
		},

		onSubmit: async ({ value }) => {
			const result = CatholicChurchOrganizationSchema.parse(value)

			console.log(result)
		},
	})

	return (
		<div className="parishconnect-form-container">
			<output
				style={{
					position: "absolute",
					top: 20,
					right: 20,
					backgroundColor: "hsl(from var(--background-color) h s calc(l + 15) / 0.8)",
					backdropFilter: "blur(10px)",
					borderRadius: 5,
					fontSize: 12,
					padding: 10,
					maxWidth: 300,
					whiteSpace: "pre-wrap",
				}}
			>
				{outputLD}
			</output>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}
			>
				<form.AppField name="name" children={(field) => <field.TextField isRequired />} />
				<form.AppField name="url" children={(field) => <field.TextField isRequired type="url" />} />
				<form.AppField name="telephone" children={(field) => <field.TextField type="tel" />} />
				{/* TODO */}
				{/* <form.AppField name="openingHours" children={(field) => <field.TextField field={field} />} /> */}
				{/* TODO */}
				{/* <form.AppField name="availableLanguage" children={(field) => <field.TextField field={field} />} /> */}
				{/* TODO */}
				{/* <form.AppField name="keywords" children={(field) => <field.TextField field={field} />} /> */}

				<form.Subscribe selector={(state) => state.values.potentialAction}>
					{(potentialAction) =>
						potentialAction ? (
							<fieldset className="donation-options-fieldset">
								<legend>{i18next.t("labels.potentialAction.label")}</legend>
								<form.AppField name="potentialAction.name" children={(field) => <field.TextField />} />
								<form.AppField name="potentialAction.target" children={(field) => <field.TextField type="url" />} />
								<form.AppField name="potentialAction.priceCurrency" children={(field) => <field.TextField />} />
							</fieldset>
						) : (
							<button
								type="button"
								onClick={() => {
									form.setFieldValue("potentialAction", {
										"@type": "DonateAction",
										name: `Donate to ${form.getFieldValue("name")}`,
										recipient: { "@id": form.getFieldValue("@id")! },
										target: "",
									})
								}}
							>
								{i18next.t("labels.potentialAction.add")}
							</button>
						)
					}
				</form.Subscribe>

				<form.Subscribe selector={(state) => state.values.address}>
					{(address) =>
						address ? (
							<fieldset className="address-fieldset">
								<legend>{i18next.t("labels.address.label")}</legend>
								<form.AppField
									name="address.addressCountry"
									children={(field) => <field.TextField autoComplete="country" />}
								/>
								<form.AppField
									name="address.addressRegion"
									children={(field) => <field.TextField autoComplete="address-level1" />}
								/>
								<form.AppField
									name="address.addressLocality"
									children={(field) => <field.TextField autoComplete="address-level2" />}
								/>
								<form.AppField
									name="address.postalCode"
									children={(field) => <field.TextField autoComplete="postal-code" />}
								/>
								<form.AppField
									name="address.streetAddress"
									children={(field) => <field.TextField autoComplete="street-address" />}
								/>
							</fieldset>
						) : (
							<button
								type="button"
								onClick={() => {
									form.setFieldValue("address", {
										"@type": "PostalAddress",
										"@id": form.getFieldValue("@id") + "#address",
										addressCountry: "",
										addressRegion: "",
										addressLocality: "",
										postalCode: "",
										streetAddress: "",
									})
								}}
							>
								{i18next.t("labels.address.add")}
							</button>
						)
					}
				</form.Subscribe>

				<form.Field mode="array" name="event">
					{(field) => (
						<fieldset className="mass-schedules-fieldset">
							<legend>{i18next.t("labels.event.label")}</legend>
							{field.state.value?.map(({ name }, index) => (
								<fieldset key={index} className="schedule-entry">
									<legend>{i18next.t("labels.event.entry", { name })}</legend>
									<form.AppField name={`event[${index}].name`} children={(f) => <f.TextField />} />
									<form.AppField
										name={`event[${index}].type`}
										children={(f) => <f.RadioGroupField orientation="horizontal" options={ServiceTypes} />}
									/>
									<form.AppField name={`event[${index}].duration`} children={(f) => <f.TextField />} />

									<form.Field mode="array" name={`event[${index}].eventSchedule`}>
										{(scheduleField) => (
											<fieldset className="mass-schedule-fieldset">
												<legend>{i18next.t("labels.event.eventSchedule.label")}</legend>
												{scheduleField.state.value?.map((_, scheduleIndex) => (
													<div key={scheduleIndex} className="mass-schedule-entry">
														<form.AppField
															name={`event[${index}].eventSchedule[${scheduleIndex}].startDate`}
															children={(f) => <f.DatePickerField />}
														/>
														<form.AppField
															name={`event[${index}].eventSchedule[${scheduleIndex}].startTime`}
															children={(f) => <f.TextField />}
														/>
														<form.AppField
															name={`event[${index}].eventSchedule[${scheduleIndex}].byDay`}
															children={(f) => <f.CheckBoxGroupField options={WeekDaysLD} />}
														/>
														<form.AppField
															name={`event[${index}].eventSchedule[${scheduleIndex}].description`}
															children={(f) => <f.TextField />}
														/>

														<button type="button" onClick={() => scheduleField.removeValue(scheduleIndex)}>
															{i18next.t("labels.event.eventSchedule.remove")}
														</button>
													</div>
												))}

												<button
													type="button"
													onClick={() =>
														scheduleField.pushValue({
															"@type": "Schedule",
															startDate: new Date().toISOString().split("T")[0],
															startTime: "12:00",
															repeatFrequency: "P1W",
															byDay: [],
															scheduleTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
														})
													}
												>
													{i18next.t("labels.event.eventSchedule.add")}
												</button>
											</fieldset>
										)}
									</form.Field>

									<button type="button" onClick={() => field.removeValue(index)}>
										{i18next.t("labels.event.remove")}
									</button>
								</fieldset>
							))}

							<button
								type="button"
								onClick={() =>
									field.pushValue({
										"@type": "Event",
										type: "mass",
										id: shortUUID(),
										name: "Holy Mass",
										eventStatus: "https://schema.org/EventScheduled",
										startDate: new Date().toISOString().split("T")[0],
										eventSchedule: [],
									})
								}
							>
								{i18next.t("labels.event.add")}
							</button>
						</fieldset>
					)}
				</form.Field>

				<form.AppForm>
					<form.SubmitButton />
				</form.AppForm>
			</form>
		</div>
	)
}
