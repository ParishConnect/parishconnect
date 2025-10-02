import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"
import { findParishDataOnDocument } from "./lib/find-parish-data-on-document.ts"
import { unfurlEventsFromLdJson } from "./lib/ld+json-to-rrule.ts"

@customElement("parishconnect-widget")
export class ParishConnectWidget extends LitElement {
	static styles = css/*css*/ `
		:host {
			font-family: --apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
				"Helvetica Neue", sans-serif;
		}
	`

	#parishData = findParishDataOnDocument()
	#rules = this.#parishData ? unfurlEventsFromLdJson(this.#parishData) : []

	render() {
		return html/*html*/ `
			<pre>

        <h1>Mass Times for ${this.#parishData?.name || "Unknown Parish"}</h1>
        ${this.#rules.map((rule) => html`<div>${rule.rrule.toString()}</div>`)}

      </pre>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"parishconnect-widget": ParishConnectWidget
	}
}
