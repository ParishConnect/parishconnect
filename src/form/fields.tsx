import { CalendarDate, parseDate, parseTime, Time } from "@internationalized/date"
import { createFormHook, createFormHookContexts, useForm, type AnyFieldApi } from "@tanstack/react-form"
import clsx from "clsx"
import i18next from "i18next"
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useCallback, useMemo, type ComponentProps } from "react"
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
	type DatePickerProps,
	type RadioGroupProps,
	type SelectProps,
	type TextFieldProps,
	type TimeFieldProps,
} from "react-aria-components"

type Options =
	| string[]
	| readonly string[]
	| { value: string; label: string }[]
	| ReadonlyArray<{ value: string; label: string }>

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

const fieldNameToClassName = (fieldName: string, prefix: string = "field") =>
	`${prefix}-${fieldName.replace(/\[[0-9]\]/gi, "").replace(/\./g, "-")}`

function FieldInfo({ field }: { field: AnyFieldApi }) {
	return field.state.meta.isTouched && !field.state.meta.isValid ? (
		<FieldError className={clsx("field-error", fieldNameToClassName(field.name, "error"))}>
			{field.state.meta.errors.join(", ")}
		</FieldError>
	) : null
}

function FieldLabel({ field }: { field: AnyFieldApi }) {
	return (
		<Label className={clsx("label", fieldNameToClassName(field.name, "label"))}>
			{i18next.t(`labels.${field.name.replace(/\[[0-9]\]/gi, "")}`)}
		</Label>
	)
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
			className={clsx("text-field", fieldNameToClassName(field.name), props.className)}
		>
			<FieldLabel field={field} />
			<Input className="input" />
			<FieldInfo field={field} />
		</AriaTextField>
	)
}

function SelectField<T extends Options>({ options, ...props }: { options: T } & SelectProps<Options>) {
	const field = useFieldContext<string>()

	const items = useMemo(
		() =>
			options.map((option) => ({
				name: typeof option === "string" ? option : i18next.t(option.label),
				id: typeof option === "string" ? option : option.value,
			})),
		[options, field.name]
	)

	const children = useCallback(
		(item: { id: string; name: string }) => (
			<ListBoxItem className="list-box-item" key={item.id} id={item.id}>
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
			className={clsx("select-field", fieldNameToClassName(field.name), props.className)}
		>
			<FieldLabel field={field} />
			<Button className="button">
				<SelectValue className="select-value" />
				<ChevronDownIcon className="chevron-down-icon" />
			</Button>
			<Popover className="parishconnect-root popover">
				<ListBox className="list-box" items={items}>
					{children}
				</ListBox>
			</Popover>
			<FieldInfo field={field} />
		</Select>
	)
}

function DatePickerField(props: DatePickerProps<CalendarDate>) {
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
			className={clsx("date-picker", fieldNameToClassName(field.name), props.className)}
		>
			<FieldLabel field={field} />
			<Group className="group">
				<DateInput className="date-input">{(segment) => <DateSegment segment={segment} />}</DateInput>
				<Button className="button">
					<CalendarIcon className="calendar-icon" />
				</Button>
			</Group>

			<Popover className="parishconnect-root popover">
				<Dialog className="dialog">
					<Calendar className="calendar">
						<header>
							<Button slot="previous" className="button">
								<ChevronLeftIcon className="chevron-left-icon" />
							</Button>
							<Heading className="heading" />
							<Button slot="next" className="button">
								<ChevronRightIcon className="chevron-right-icon" />
							</Button>
						</header>
						<CalendarGrid className="calendar-grid">
							{(date) => <CalendarCell className="calendar-cell" date={date} />}
						</CalendarGrid>
					</Calendar>
				</Dialog>
			</Popover>
		</DatePicker>
	)
}

function TimePickerField(props: TimeFieldProps<Time>) {
	const field = useFieldContext<string>()
	const parsedTime = useMemo(() => {
		try {
			return parseTime(field.state.value)
		} catch (error) {
			console.error("Failed to parse time:", field.state.value, error)
			return parseTime("12:00")
		}
	}, [field.state.value])

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
			value={parsedTime}
			name={field.name}
			{...props}
			className={clsx("time-field", fieldNameToClassName(field.name), props.className)}
		>
			<FieldLabel field={field} />
			<DateInput className="date-input">{(segment) => <DateSegment segment={segment} />}</DateInput>
		</TimeField>
	)
}

function SubmitButton() {
	const form = useForm()
	return (
		<form.Subscribe selector={(state) => ({ isSubmitting: state.isSubmitting, isValid: state.isValid })}>
			{({ isSubmitting, isValid }) => (
				<Button className="button" type="submit" isDisabled={!isValid || isSubmitting}>
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
			className={clsx("checkbox-group-field", fieldNameToClassName(field.name), props.className)}
		>
			<FieldLabel field={field} />
			<Group className="group">
				{options.map((option) => (
					<Checkbox
						className="checkbox"
						key={typeof option === "string" ? option : option.value}
						value={typeof option === "string" ? option : option.value}
					>
						{typeof option === "string" ? i18next.t(option) : option.label}
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
			className={clsx("radio-group-field", fieldNameToClassName(field.name), props.className)}
		>
			<FieldLabel field={field} />
			<Group className="group">
				{options.map((option) => (
					<Radio
						className="radio"
						key={typeof option === "string" ? option : option.value}
						value={typeof option === "string" ? option : option.value}
					>
						{typeof option === "string" ? i18next.t(option) : option.label}
					</Radio>
				))}
			</Group>
			<FieldInfo field={field} />
		</RadioGroup>
	)
}

function ReadonlyField(props: ComponentProps<"span">) {
	const field = useFieldContext<string>()
	return (
		<span className={clsx("readonly-field", fieldNameToClassName(field.name), props.className)}>
			{field.state.value}
		</span>
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
		ReadonlyField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
})
