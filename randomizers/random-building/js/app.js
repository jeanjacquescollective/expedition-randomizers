import { renderSidebar } from "./sidebar.js";
import { createCards } from "./cards.js";

const grid = document.getElementById("buildingGrid");

async function fetchBuildings() {
	try {
		const response = await fetch("./json/buildinglist.json");
		const data = await response.json();
		return data.buildings || [];
	} catch (e) {
		console.error("Error loading buildings:", e);
		return [];
	}
}

(async function init() {
	const buildings = await fetchBuildings();
	createCards(buildings, grid);
	renderSidebar();
})();
