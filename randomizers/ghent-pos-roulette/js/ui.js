export function setupUI(onSpin) {
  const btn = document.getElementById('spinBtn');
  btn.addEventListener('click', onSpin);

  const latSlot = document.getElementById('latSlot');
  const lngSlot = document.getElementById('lngSlot');
  const result = document.getElementById('result');
  const link = document.getElementById('gmapsLink');

  let animInterval;

  function updateSlot(lat, lng) {
    latSlot.textContent = `Lat: ${lat.toFixed(5)}`;
    lngSlot.textContent = `Lng: ${lng.toFixed(5)}`;
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
