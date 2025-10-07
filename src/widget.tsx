import { Temporal } from "@js-temporal/polyfill"
import i18next from "i18next"
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector"
import resourcesToBackend from "i18next-resources-to-backend"
import register from "preact-custom-element"
import { useMemo } from "preact/hooks"
import { findParishDataOnDocument } from "./lib/find-parish-data-on-document.ts"
import { getWeeklySchedule, weeklyScheduleToLocale } from "./lib/get-weekly-schedule.ts"
import { getDayInSameWeek } from "./lib/utils.ts"
import css from "./widget.css?inline"

i18next
	.use(I18nextBrowserLanguageDetector)
	.use(resourcesToBackend((language: string) => import(`./locale/${language}.json`)))
	.init({ fallbackLng: "en" })

function ParishConnectWidget() {
	const parishData = useMemo(() => findParishDataOnDocument(), [])

	const weeklySchedule = useMemo(() => {
		if (!parishData) return {}

		return weeklyScheduleToLocale(getWeeklySchedule(parishData))
	}, [parishData])

	if (!parishData) {
		return <div>{i18next.t("no-parish-data")}</div>
	}

	return (
		<>
			<style>{css}</style>
			<div>
				<span>{parishData.name}</span>

				<pre>{JSON.stringify(parishData.address, null, 2)}</pre>

				<h2>Weekly Schedule</h2>
				{Object.entries(weeklySchedule).map(([day, times]) => (
					<div key={day}>
						<strong>
							{getDayInSameWeek(Temporal.Now.zonedDateTimeISO(), Number(day)).toLocaleString(undefined, {
								weekday: "long",
							})}
						</strong>
						<ul>
							{times.length > 0 &&
								times.map(({ time, name, duration, description, url }) => (
									<li key={time + name + duration + description + url}>
										<span>{name}</span>
										<span> - </span>
										<time>{time}</time>
										<span>{duration ? " - " + Temporal.Duration.from(duration).toLocaleString(undefined) : ""}</span>
										<span>{description ? ` - ${description}` : ""}</span>
										{url ? (
											<a href={url} target="_blank" rel="noopener">
												More info
											</a>
										) : null}
									</li>
								))}
						</ul>
					</div>
				))}
			</div>
		</>
	)
}

register(ParishConnectWidget, "parishconnect-widget", [], { shadow: true })
