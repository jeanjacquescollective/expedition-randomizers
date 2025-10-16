import { addFlipped } from "./storage.js";
import { renderSidebar, toggleSidebar } from "./sidebar.js";
import { showGroupModal } from "./modal.js";

let lastFlippedCard = null;
let availableBuildings = []; // Track available buildings

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomBuilding() {
	if (availableBuildings.length === 0) return null;
	const randomIndex = Math.floor(Math.random() * availableBuildings.length);
	// Remove and return the randomly selected building
	return availableBuildings.splice(randomIndex, 1)[0];
}

export function createCards(buildings, gridEl) {
	// Initialize the available buildings pool
	availableBuildings = [...buildings];

	for (let i = 0; i < buildings.length; i++) {
		const card = document.createElement("div");
		card.className = "card";

		card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img class="building-image" src="" alt="Building">
                    <div class="building-info">
                        <div class="building-name"></div>
                        <div class="building-address"></div>
                    </div>
                </div>
            </div>
        `;

		card.addEventListener("click", async function () {
			if (
				this.classList.contains("used") ||
				this.classList.contains("flipped")
			) {
				return;
			}

			// First turn back the last card if exists
			if (lastFlippedCard) {
				lastFlippedCard.classList.remove("flipped");
				lastFlippedCard.classList.add("used");
				await wait(600);
			}

			// Get group name using modal
			const group = await showGroupModal();
			if (!group) return;

			// Get a random building from the available pool
			const randomBuilding = getRandomBuilding();
			if (!randomBuilding) {
				alert("Alle gebouwen zijn al gebruikt!");
				return;
			}

			const backside = this.querySelector(".card-back");
			backside.querySelector(".building-image").src = randomBuilding.image;
			backside.querySelector(".building-name").textContent =
				randomBuilding.name;
			backside.querySelector(".building-address").textContent =
				randomBuilding.address;

			this.classList.add("flipped");

			// Save the flipped card data
			addFlipped({
				name: randomBuilding.name,
				address: randomBuilding.address,
				image: randomBuilding.image,
				group: group.trim(),
				ts: Date.now(),
			});

			renderSidebar();
			toggleSidebar(true);

			lastFlippedCard = this;
		});

		gridEl.appendChild(card);
	}
}
