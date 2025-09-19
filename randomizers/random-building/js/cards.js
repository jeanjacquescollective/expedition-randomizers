import { addFlipped } from "./storage.js";
import { renderSidebar, toggleSidebar } from "./sidebar.js";

let lastFlippedCard = null;

export function createCards(buildings, gridEl) {
	for (let i = 0; i < 24; i++) {
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

		card.addEventListener("click", function () {
			if (this.classList.contains("used") || this.classList.contains("flipped"))
				return;

			if (lastFlippedCard) {
				lastFlippedCard.classList.remove("flipped");
				lastFlippedCard.classList.add("used");
			}

			const randomBuilding =
				buildings[Math.floor(Math.random() * buildings.length)];
			const backside = this.querySelector(".card-back");
			backside.querySelector(".building-image").src = randomBuilding.image;
			backside.querySelector(".building-name").textContent =
				randomBuilding.name;
			backside.querySelector(".building-address").textContent =
				randomBuilding.address;

			this.classList.add("flipped");

			const group = prompt("Voer een groepsnaam in voor dit gebouw:") ?? "";
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
