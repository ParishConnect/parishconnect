import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import { findParishDataOnDocument } from "./lib/find-parish-data-on-document"
import { getWeeklySchedule, weeklyScheduleToLocale } from "./lib/get-weekly-schedule"
import { Temporal } from "@js-temporal/polyfill"

function getDayInSameWeek(date: Temporal.ZonedDateTime, destDayOfWeek: number): Temporal.ZonedDateTime {
	return date.add({ days: destDayOfWeek - date.dayOfWeek })
}

@customElement("render-root")
export class RenderRoot extends LitElement {
	#parishData = findParishDataOnDocument()
	#weeklySchedule = this.#parishData ? weeklyScheduleToLocale(getWeeklySchedule(this.#parishData)) : {}

	render() {
		if (!this.#parishData) return html`<div>No parish data found on this page.</div>`

		return html/*html*/ `<div>
			<span>${this.#parishData.name}</span>

			<pre>${JSON.stringify(this.#parishData.address, null, 2)}</pre>

			<h2>Weekly Schedule</h2>
			${Object.entries(this.#weeklySchedule).map(
				([day, times]) => html/*html*/ `
					<div>
						<strong
							>${getDayInSameWeek(Temporal.Now.zonedDateTimeISO(), Number(day)).toLocaleString(undefined, {
								weekday: "long",
							})}</strong
						>
						<ul>
							${times.length > 0 &&
							times.map(
								({ time, name, duration, description, url }) => html/*html*/ `<li>
									<span>${name}</span>
									<span> - </span>
									<time>${time}</time>
									<span>${duration ? Temporal.Duration.from(duration).toLocaleString(undefined) : ""}</span>
									<span>${description ? ` - ${description}` : ""}</span>
									${url ? html`<a href="${url}" target="_blank" rel="noopener">More info</a>` : ""}
								</li>`
							)}
						</ul>
					</div>
				`
			)}
		</div>`
	}
}
