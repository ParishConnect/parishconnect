import { defineConfig } from "vocs"

export default defineConfig({
	cacheDir: "../../node_modules/.vocs",
	baseUrl: "https://docs.parishconnect.io",
	rootDir: ".",
	title: "ParishConnect Docs",
	logoUrl: "blue_logo.png",
	iconUrl: "blue_logo.png",
	socials: [{ icon: "x", link: "https://x.com/parishconnect", label: "X" }],
	sidebar: [
		{
			text: "Getting Started",
			link: "/getting-started",
		},
		{
			text: "Example",
			link: "/example",
		},
	],
})
