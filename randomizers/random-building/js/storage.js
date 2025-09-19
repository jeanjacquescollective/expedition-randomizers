export const STORAGE_KEY = "flippedBuildings";

export function loadFlipped() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
	} catch {
		return [];
	}
}

export function saveFlipped(items) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addFlipped(entry) {
	const items = loadFlipped();
	items.unshift(entry);
	saveFlipped(items);
}

export function clearAll() {
	localStorage.removeItem(STORAGE_KEY);
}
