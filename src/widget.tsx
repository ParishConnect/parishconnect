import i18next from "i18next"
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector"
import resourcesToBackend from "i18next-resources-to-backend"
import register from "preact-custom-element"
import { isAdminPage } from "./lib/utils.ts"
import { useLayoutEffect, useState } from "preact/hooks"
import en from "./locale/en.json"
import { lazy, Suspense } from "preact/compat"

const ParishConnectForm = lazy(() => import("./form.tsx"))

i18next
	.use(I18nextBrowserLanguageDetector)
	.use(resourcesToBackend((language: string) => import(`./locale/${language}.json`)))
	.init({ fallbackLng: "en", debug: true, resources: { en: { translation: en } } })

function ParishConnectWidget() {
	const [i18nextReady, setI18nextReady] = useState(false)
	const [showEditForm, setShowEditForm] = useState(true)
	const showEditButton = isAdminPage()

	useLayoutEffect(() => {
		if (i18next.isInitialized) {
			setI18nextReady(true)
		} else {
			const handleInitialized = () => setI18nextReady(true)
			i18next.on("initialized", handleInitialized)
			return () => {
				i18next.off("initialized", handleInitialized)
			}
		}
	}, [])

	if (!i18nextReady) {
		return null // or a loading indicator
	}

	return (
		<>
			{showEditButton && (
				<button onClick={() => setShowEditForm(true)} className="edit-schedule-button button">
					{i18next.t("edit-parish-information")}
				</button>
			)}
			{showEditForm && (
				<Suspense fallback={<div className="loading-text">Loading...</div>}>
					<ParishConnectForm />
				</Suspense>
			)}
		</>
	)
}

register(ParishConnectWidget, "parishconnect-widget", [], { shadow: true, mode: "closed" })
