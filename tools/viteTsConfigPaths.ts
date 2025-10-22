import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import tsconfig from "../tsconfig.base.json" with { type: "json" }

const __dirname = dirname(fileURLToPath(import.meta.url))

export function viteTsConfigPaths() {
	const aliases: Record<string, string> = {}

	for (const [key, value] of Object.entries(tsconfig.compilerOptions.paths)) {
		aliases[key] = resolve(__dirname, '..', value[0])
	}
	return aliases
}
