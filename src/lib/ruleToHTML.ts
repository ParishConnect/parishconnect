import { Temporal } from '@js-temporal/polyfill'
import { html, type TemplateResult } from 'lit'
import type { RRuleTemporal } from 'rrule-temporal'

export function ruleToHTML(rule: RRuleTemporal, opts: {} = {}): TemplateResult {
  const today = Temporal.Now.zonedDateTimeISO().startOfDay()
  const nextWeek = today
    .add({ weeks: 1 })
    .startOfDay()
    .subtract({ milliseconds: 1 })

  const days = rule.between(today, nextWeek, true)

  return html`<div>
    <h2>Upcoming Events</h2>
    <ul>
      ${days.length === 0 ? '<li>No events in the next week</li>' : ''}
      ${days.map((day) => {
        return html/*html*/ `<li>
          ${day.toLocaleString(undefined, {
            dateStyle: 'long',
            timeStyle: 'medium',
          })}
        </li>`
      })}
    </ul>
  </div>`
}
