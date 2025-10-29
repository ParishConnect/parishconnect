// @ts-check
import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import starlightThemeNext from "starlight-theme-next"
import mermaid from "astro-mermaid"
import cloudflare from "@astrojs/cloudflare"

// https://astro.build/config
export default defineConfig({
	adapter: cloudflare({ imageService: "compile" }),
	site: "https://docs.parishconnect.io",
	integrations: [
		starlight({
			plugins: [starlightThemeNext()],
			title: "ParishConnect Docs",
			customCss: ["./src/styles/custom.css"],
			logo: {
				src: "./src/assets/blue_logo.png",
			},
			lastUpdated: true,
			defaultLocale: "en",
			social: [
				{ icon: "github", label: "GitHub", href: "https://github.com/parishconnect/parishconnect" },
				{ icon: "x.com", label: "X", href: "https://x.com/parishconnect" },
			],
			sidebar: [
				{
					label: "Guides",
					autogenerate: { directory: "guides" },
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],
		}),
		mermaid({
			theme: "forest",
			autoTheme: true,
		}),
	],
})
