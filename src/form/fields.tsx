import { CalendarDate, parseDate, parseTime, Time } from "@internationalized/date"
import { createFormHook, createFormHookContexts, useForm, type AnyFieldApi } from "@tanstack/react-form"
import i18next from "i18next"
import { useCallback, useMemo } from "react"
import {
	TextField as AriaTextField,
	Button,
	Calendar,
	CalendarCell,
	CalendarGrid,
	Checkbox,
	CheckboxGroup,
	DateInput,
	DatePicker,
	DateSegment,
	Dialog,
	FieldError,
	Group,
	Heading,
	Input,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	Radio,
	RadioGroup,
	Select,
	SelectValue,
	TimeField,
	type CheckboxGroupProps,
	type DateFieldProps,
	type RadioGroupProps,
	type SelectProps,
	type TextFieldProps,
	type TimeFieldProps,
} from "react-aria-components"

type Options = string[] | readonly string[]

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

function FieldInfo({ field }: { field: AnyFieldApi }) {
	return field.state.meta.isTouched && !field.state.meta.isValid ? (
		<FieldError>{field.state.meta.errors.join(", ")}</FieldError>
	) : null
}

function TextField(props: TextFieldProps) {
	const field = useFieldContext<string>()

	return (
		<AriaTextField
			name={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={field.handleChange}
			validationBehavior="aria"
			{...props}
		>
			<Label>{i18next.t(`labels.${field.name.replace(/\[[0-9]\]/gi, "")}`)}</Label>
			<Input />
			<FieldInfo field={field} />
		</AriaTextField>
	)
}

function SelectField<T extends Options>({ options, ...props }: { options: T } & SelectProps<Options>) {
	const field = useFieldContext<string>()

	const items = useMemo(
		() =>
			options.map((option) => ({
				name: i18next.t(option),
				id: option,
			})),
		[options, field.name]
	)

	const children = useCallback(
		(item: { id: string; name: string }) => (
			<ListBoxItem key={item.id} id={item.id}>
				{item.name}
			</ListBoxItem>
		),
		[]
	)

	return (
		<Select
			name={field.name}
			defaultValue={items[0]?.id}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={(value) => {
				if (value && typeof value === "string") {
					field.handleChange(value)
				}
			}}
			validationBehavior="aria"
			{...props}
		>
			<Label>{i18next.t(`labels.${field.name.replace(/\[[0-9]\]/gi, "")}`)}</Label>
			<Button>
				<SelectValue />
				<span aria-hidden="true">⬇️</span>
			</Button>
			<Popover>
				<ListBox items={items}>{children}</ListBox>
			</Popover>
			<FieldInfo field={field} />
		</Select>
	)
}

function DatePickerField(props: DateFieldProps<CalendarDate>) {
	const field = useFieldContext<string>()

	return (
		<DatePicker
			onChange={(date) => {
				if (date) {
					field.handleChange(date.toString())
				}
			}}
			onBlur={field.handleBlur}
			validationBehavior="aria"
			isInvalid={!field.state.meta.isValid}
			value={parseDate(field.state.value ?? "")}
			name={field.name}
			{...props}
		>
			<Label>Date</Label>
			<Group>
				<DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
				<Button>
					<span>⬇️</span>
				</Button>
			</Group>

			<Popover>
				<Dialog>
					<Calendar>
						<header>
							<Button slot="previous">
								<span>⬅️</span>
							</Button>
							<Heading />
							<Button slot="next">
								<span>➡️</span>
							</Button>
						</header>
						<CalendarGrid>{(date) => <CalendarCell date={date} />}</CalendarGrid>
					</Calendar>
				</Dialog>
			</Popover>
		</DatePicker>
	)
}

function TimePickerField(props: TimeFieldProps<Time>) {
	const field = useFieldContext<string>()
	return (
		<TimeField
			onChange={(time) => {
				if (time) {
					field.handleChange(time.toString())
				}
			}}
			onBlur={field.handleBlur}
			validationBehavior="aria"
			isRequired
			isInvalid={!field.state.meta.isValid}
			value={parseTime(field.state.value ?? "")}
			name={field.name}
			{...props}
		>
			<Label>Event time</Label>
			<DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
		</TimeField>
	)
}

function SubmitButton() {
	const form = useForm()
	return (
		<form.Subscribe selector={(state) => ({ isSubmitting: state.isSubmitting, isValid: state.isValid })}>
			{({ isSubmitting, isValid }) => (
				<Button type="submit" isDisabled={!isValid || isSubmitting}>
					{isSubmitting ? i18next.t("submitting") : i18next.t("submit")}
				</Button>
			)}
		</form.Subscribe>
	)
}

function CheckBoxGroupField<T extends Options>({ options, ...props }: { options: T } & CheckboxGroupProps) {
	const field = useFieldContext<string[]>()

	return (
		<CheckboxGroup
			name={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={(value) => {
				if (Array.isArray(value)) {
					field.handleChange(value)
				}
			}}
			validationBehavior="aria"
			{...props}
		>
			<Label>{i18next.t(`labels.${field.name.replace(/\[[0-9]\]/gi, "")}`)}</Label>
			<Group>
				{options.map((option) => (
					<Checkbox key={option} value={option}>
						{i18next.t(option)}
					</Checkbox>
				))}
			</Group>
			<FieldInfo field={field} />
		</CheckboxGroup>
	)
}

function RadioGroupField<T extends Options>({ options, ...props }: { options: T } & RadioGroupProps) {
	const field = useFieldContext<string>()

	return (
		<RadioGroup
			name={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={field.handleChange}
			validationBehavior="aria"
			{...props}
		>
			<Label>{i18next.t(`labels.${field.name.replace(/\[[0-9]\]/gi, "")}`)}</Label>
			<Group>
				{options.map((option) => (
					<Radio key={option} value={option}>
						{i18next.t(option)}
					</Radio>
				))}
			</Group>
			<FieldInfo field={field} />
		</RadioGroup>
	)
}

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		SelectField,
		TimePickerField,
		DatePickerField,
		RadioGroupField,
		CheckBoxGroupField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
})
