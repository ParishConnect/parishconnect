import i18next from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import languageDetector from "i18next-browser-languagedetector"
import { LitElement, css, html } from "lit"
import { initLitI18n, translate as t } from "lit-i18n"
import { customElement, property, state } from "lit/decorators.js"
import { findParishDataOnDocument } from "./lib/find-parish-data-on-document.ts"
import { extractSchemaText } from "./lib/utils.ts"

i18next
	.use(languageDetector)
	.use(resourcesToBackend((language: string) => import(`./locale/${language}.json`)))
	.use(initLitI18n)
	.init({ fallbackLng: "en" })

const widgetStyles = css`
	:host {
		font-family: --apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
			"Helvetica Neue", sans-serif;

		.container {
			border: 1px solid #ccc;
			border-radius: 8px;
			padding: 16px;
			display: flex;
			flex-direction: column;
			gap: 12px;

			.container-title {
				margin: 0;
			}

			form {
				display: flex;
				flex-direction: column;
				gap: 12px;
			}
		}
	}
`

@customElement("parishconnect-widget")
export class ParishConnectWidget extends LitElement {
	@property({ type: Boolean }) unstyled = false

	#parishData = findParishDataOnDocument()

	@state() i18nextInitialized = i18next.isInitialized
	connectedCallback(): void {
		super.connectedCallback()
		if (!this.i18nextInitialized) {
			i18next.on("initialized", () => {
				this.i18nextInitialized = true
				this.requestUpdate()
			})
		}
	}

	@state() _formData = {
		name: extractSchemaText(this.#parishData?.name) ?? "",
	}

	_onInputChange(e: Event) {
		const target = e.target as HTMLInputElement
		this._formData = {
			...this._formData,
			[target.name]: target.value,
		}
	}

	render() {
		if (!this.i18nextInitialized) return html``
		if (!this.#parishData) return html`<div>${t("no-parish-data")}</div>`

		return html`
			<style>
				${this.unstyled ? "" : widgetStyles}
			</style>

			<div class="container">
				<h2 class="container-title">${t("edit-parish-information")}</h2>
				<form>
					<label>
						${t("parish-name")}
						<input
							type="text"
							name="name"
							placeholder="${t("parish-name")}"
							@change=${this._onInputChange}
							.value=${this._formData.name ?? ""}
							required
						/>
					</label>

					<label>
						Name
						<input
							type="text"
							name="name"
							placeholder="Name"
							@change=${this._onInputChange}
							.value=${this._formData.name ?? ""}
							required
						/>
					</label>
				</form>
			</div>

			<output>
				<pre>${JSON.stringify(this._formData, null, 2)}</pre>
			</output>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"parishconnect-widget": ParishConnectWidget
	}
}
