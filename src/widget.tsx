import i18next from "i18next"
import { lazy, StrictMode, Suspense, useLayoutEffect, useState } from "react"
import ReactDOM from "react-dom/client"

const ParishConnectForm = lazy(() => import("./form/form.tsx"))

function ParishConnectWidget() {
	const [i18nextReady, setI18nextReady] = useState(false)

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
		return null
	}

	return (
		<Suspense fallback={<div className="loading-text">Loading...</div>}>
			<ParishConnectForm />
		</Suspense>
	)
}

const rootElement = document.createElement("div")
document.body.appendChild(rootElement)
const root = ReactDOM.createRoot(rootElement)
root.render(
	<StrictMode>
		<ParishConnectWidget />
	</StrictMode>
)
