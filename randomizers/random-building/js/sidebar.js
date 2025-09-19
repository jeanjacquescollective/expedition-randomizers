import { loadFlipped, clearAll } from "./storage.js";
import { escapeHtml } from "./utils.js";

const sidebar = document.getElementById("sidebar");
const listEl = document.getElementById("list");
const countBadge = document.getElementById("countBadge");
const openSidebarBtn = document.getElementById("openSidebarBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const clearStorageBtn = document.getElementById("clearStorageBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");

export function renderSidebar() {
	const data = loadFlipped();
	countBadge.textContent = data.length;
	listEl.innerHTML = "";

	if (!data.length) {
		const empty = document.createElement("div");
		empty.className = "empty";
		empty.textContent = "Nog geen omgedraaide gebouwen.";
		listEl.appendChild(empty);
		return;
	}

	for (const item of data) {
		const el = document.createElement("div");
		el.className = "list-item";
		el.innerHTML = `
      <img src="${item.image}" alt="">
      <div class="meta">
        <div class="title">${escapeHtml(
					item.name
				)} <span class="badge">${escapeHtml(item.group || "—")}</span></div>
        <div class="sub">${escapeHtml(item.address)}</div>
        <div class="sub muted">${new Date(item.ts).toLocaleString()}</div>
      </div>
    `;
		listEl.appendChild(el);
	}
}

export function toggleSidebar(forceOpen) {
	const willOpen = forceOpen === true || !sidebar.classList.contains("open");
	sidebar.classList.toggle("open", willOpen);
}

/** Open het overzicht in beeld en start een print, zodat je als PDF kan opslaan */
export function printSidebarAsPdf() {
	// Zorg dat de laatste data gerenderd is
	renderSidebar();

	// Sidebar moet zichtbaar zijn voor print
	const wasOpen = sidebar.classList.contains("open");
	sidebar.classList.add("open");

	// Een kleine async tick geeft de layout de tijd om te updaten
	setTimeout(() => {
		window.print();
		// Herstel de vorige staat
		if (!wasOpen) sidebar.classList.remove("open");
	}, 50);
}

function wireButtons() {
	openSidebarBtn.addEventListener("click", () => toggleSidebar(true));
	closeSidebarBtn.addEventListener("click", () => toggleSidebar(false));
	clearStorageBtn.addEventListener("click", () => {
		if (confirm("Zeker dat je de lijst wilt leegmaken?")) {
			clearAll();
			renderSidebar();
		}
	});
	exportPdfBtn.addEventListener("click", () => printSidebarAsPdf());
}

wireButtons();
