const editWidgetButton = document.getElementById("edit-widget")
editWidgetButton?.addEventListener("click", async () => {
	await import("./widget")
	editWidgetButton.remove()
})
