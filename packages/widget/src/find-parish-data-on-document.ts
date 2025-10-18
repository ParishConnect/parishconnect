import type { CatholicChurchOrganization } from "@parishconnect/schema"
import { safelyParseJSON } from "@parishconnect/rrule-converter"

export function findParishDataOnDocument(): CatholicChurchOrganization | null {
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
