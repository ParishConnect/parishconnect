import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { toText } from 'rrule-temporal/totext'
import { LdJsonToRRule } from './lib/ld+json-to-rrule'

const example = `{
  "@context": "https://schema.org/",
  "@type": "Event",
  "url": "http://www.example.org/events/1",
  "name": "Wednesday Mass",
  "description": "A weekly Wednesday Mass",
  "duration": "PT60M",
  "eventSchedule": {
     "@type": "Schedule",
     "startDate": "2017-01-01",
     "endDate": "2017-12-31",
     "repeatFrequency": "P1W",
     "byDay": "https://schema.org/Wednesday",
     "startTime": "19:00:00",
     "endTime": "20:00:00",
     "scheduleTimezone": "Europe/London"
  }
}`

const rule = LdJsonToRRule(example)

/**
 * ParishConnect Widget
 */
@customElement('parishconnect-widget')
export class ParishConnectWidget extends LitElement {
  render() {
    return html/*html*/ `<div>
      <h1>ParishConnect Widget</h1>
      <pre>${example}</pre>
      <span>${toText(rule)}</span>
    </div>`
  }

  static styles = css/*css*/ `
    :host {
      font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'parishconnect-widget': ParishConnectWidget
  }
}
