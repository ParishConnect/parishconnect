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
		return html/*html*/ `<div>
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
							${times.length > 0 && times.map((time) => html/*html*/ `<li><time>${time}</time></li>`)}
						</ul>
					</div>
				`
			)}
		</div>`
	}
}
