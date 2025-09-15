export function setupUI(onSpin) {
  const btn = document.getElementById('spinBtn');
  btn.addEventListener('click', onSpin);

  const latSlot = document.querySelector('#latSlot .roulette__slot-value');
  const lngSlot = document.querySelector('#lngSlot .roulette__slot-value');
  const result = document.querySelector('#result');
  const link = document.querySelector('#gmapsLink');

  let animInterval;

  function updateSlot(lat, lng) {
    latSlot.textContent = `${lat.toFixed(5)}`;
    lngSlot.textContent = `${lng.toFixed(5)}`;
  }

  function startRolling() {
    animInterval = setInterval(() => {
      const lat = Math.random() * (51.07 - 51.04) + 51.04;
      const lng = Math.random() * (3.74 - 3.71) + 3.71;
      updateSlot(lat, lng);
    }, 50);
  }

  function stopRolling(finalCoord) {
    clearInterval(animInterval);
    updateSlot(finalCoord[0], finalCoord[1]);
    link.href = `https://maps.google.com/?q=${finalCoord[0]},${finalCoord[1]}`;
    result.classList.remove('hidden');
  }

  return {
    startRolling,
    stopRolling,
    disableSpin: () => btn.disabled = true,
    enableSpin: () => btn.disabled = false
  };
}
