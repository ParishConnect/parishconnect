import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"
import { safelyParseJSON } from "./lib/utils"
import { unfurlEventsFromLdJson } from "./lib/ld+json-to-rrule"
import { toText } from "rrule-temporal/totext"

@customElement("parishconnect-widget")
export class ParishConnectWidget extends LitElement {
  static styles = css/*css*/ `
    :host {
      font-family: --apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
        "Helvetica Neue", sans-serif;
    }
  `

  #findParishData() {
    let script: HTMLScriptElement | null = null
    const parishConnectDataMarkedScript = document.getElementById("parishconnect-data")
    if (parishConnectDataMarkedScript?.tagName === "SCRIPT") {
      script = parishConnectDataMarkedScript as HTMLScriptElement
    }

    const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).find((script) =>
      script.textContent?.includes("CatholicChurch")
    )

    if (jsonLdScripts) {
      script = jsonLdScripts as HTMLScriptElement
    }

    if (!script) {
      return null
    }

    return safelyParseJSON(script.textContent || "")
  }

  #parishData = this.#findParishData()
  #rules = unfurlEventsFromLdJson(this.#parishData)

  render() {
    return html/*html*/ `
      <pre>

        <h1>Mass Times for ${this.#parishData?.name || "Unknown Parish"}</h1>
        ${this.#rules.map((rule) => html`<div>${rule.toString()}</div>`)}

      </pre>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "parishconnect-widget": ParishConnectWidget
  }
}
