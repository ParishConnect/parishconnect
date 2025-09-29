const editWidgetButton = document.getElementById("edit-widget")
editWidgetButton?.addEventListener("click", async () => {
  await import("./widget")

  if (document.querySelector("parishconnect-widget")) return

  const widget = document.createElement("parishconnect-widget")
  editWidgetButton.after(widget)
})
