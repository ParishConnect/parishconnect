import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

const __dirname = dirname(fileURLToPath(import.meta.url))

const packageName = "rrule"

export default defineConfig({
	build: {
		outDir: resolve(__dirname, `../../dist/${packageName}`),
		lib: {
			entry: resolve(__dirname, "src/main.ts"),
			name: packageName,
			fileName: packageName,
		},
	},
})
