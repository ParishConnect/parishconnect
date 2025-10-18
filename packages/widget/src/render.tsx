import { Temporal } from "@js-temporal/polyfill"
import { useMemo } from "react"
import { findParishDataOnDocument } from "./find-parish-data-on-document.ts"
import { getWeeklySchedule, weeklyScheduleToLocale } from "./get-weekly-schedule.ts"
import { getDayInSameWeek } from "@parishconnect/rrule-converter"
import type { ColorScheme, Theme } from "./themes/types.ts"
import i18next from "i18next"

export interface ParishConnectRenderProps {
	theme?: Theme
	colorScheme?: ColorScheme
}

export default function ParishConnectRender({ theme, colorScheme }: ParishConnectRenderProps) {
	const parishData = useMemo(() => findParishDataOnDocument(), [])

	const weeklySchedule = useMemo(() => {
		if (!parishData) return {}

		return weeklyScheduleToLocale(getWeeklySchedule(parishData))
	}, [parishData])

	if (!parishData) {
		return <div>{i18next.t("no-parish-data")}</div>
	}

	return (
		<div className="service-schedule masstime-schedule" data-theme={theme} data-color-scheme={colorScheme}>
			{Object.entries(weeklySchedule).map(([day, times]) => (
				<div key={day} className="day-block">
					<span className="day-header">
						{getDayInSameWeek(Temporal.Now.zonedDateTimeISO(), Number(day)).toLocaleString(undefined, {
							weekday: "long",
						})}
					</span>

					<ul className="times-list">
						{times.length > 0 &&
							times.map(({ time, name, duration, description, url }) => (
								<li className="times-list-item" key={time + name + duration + description + url}>
									<span className="name">{name}</span>
									<time className="time">{time}</time>
									{duration && (
										<span className="duration">{Temporal.Duration.from(duration).toLocaleString(undefined)}</span>
									)}
									{description && <span className="description">{description}</span>}
									{url ? (
										<a href={url} target="_blank" rel="noopener" className="more-info">
											More info
										</a>
									) : null}
								</li>
							))}
					</ul>
				</div>
			))}
		</div>
	)
}
