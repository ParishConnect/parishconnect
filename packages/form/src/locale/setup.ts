import i18next from "i18next"
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector"
import resourcesToBackend from "i18next-resources-to-backend"
import en from "./en.json" with { type: "json" }

i18next
	.use(I18nextBrowserLanguageDetector)
	.use(resourcesToBackend((language: string) => import(`./locale/${language}.json`)))
	.init({ fallbackLng: "en", nsSeparator: "|", debug: true, resources: { en: { translation: en } } })
