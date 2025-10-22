import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import ParishConnectForm from "./form"
import "./locale/setup.ts"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ParishConnectForm />
	</StrictMode>
)
