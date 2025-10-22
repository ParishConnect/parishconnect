export function isAdminPage(): boolean {
	const currentLocation = window.location.href
	const searchParams = new URLSearchParams(window.location.search)

	return (
		currentLocation.includes("admin") ||
		currentLocation.includes("wp-admin") ||
		currentLocation.includes("webflow") ||
		currentLocation.includes("ecatholic.com") ||
		currentLocation.includes("squarespace.com") ||
		currentLocation.includes("wixsite.com") ||
		currentLocation.includes("weebly") ||
		!!searchParams.get("edit-masstimes") ||
		!!searchParams.get("admin")
	)
}
