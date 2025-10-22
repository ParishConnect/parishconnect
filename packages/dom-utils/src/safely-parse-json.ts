export function safelyParseJSON(jsonString: string): any | null {
	try {
		return JSON.parse(jsonString)
	} catch (e) {
		console.error("Failed to parse JSON:", e)
		return null
	}
}
