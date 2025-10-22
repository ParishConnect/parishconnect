import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { viteTsConfigPaths } from "../../tools/viteTsConfigPaths"

// https://vite.dev/config/
export default defineConfig({
	cacheDir: "../../node_modules/.vite/form",
	plugins: [
		react({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
	],
})
