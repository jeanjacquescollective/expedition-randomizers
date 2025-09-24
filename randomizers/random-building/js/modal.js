const modal = document.getElementById("groupModal");
const groupInput = document.getElementById("groupInput");
const confirmBtn = document.getElementById("confirmGroupBtn");
const cancelBtn = document.getElementById("cancelGroupBtn");

export function showGroupModal() {
	return new Promise((resolve) => {
		modal.classList.add("open");
		groupInput.value = "";
		groupInput.focus();

		const handleConfirm = () => {
			const value = groupInput.value.trim();
			cleanup();
			resolve(value);
		};

		const handleCancel = () => {
			cleanup();
			resolve("");
		};

		const handleKeydown = (e) => {
			if (e.key === "Enter") handleConfirm();
			if (e.key === "Escape") handleCancel();
		};

		const cleanup = () => {
			modal.classList.remove("open");
			confirmBtn.removeEventListener("click", handleConfirm);
			cancelBtn.removeEventListener("click", handleCancel);
			document.removeEventListener("keydown", handleKeydown);
		};

		confirmBtn.addEventListener("click", handleConfirm);
		cancelBtn.addEventListener("click", handleCancel);
		document.addEventListener("keydown", handleKeydown);
	});
}
