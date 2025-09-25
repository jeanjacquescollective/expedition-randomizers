import { showMarker } from "./map.js";

export function setupUI(onSpin) {
  const button = document.querySelector('#spinButton');
  button.addEventListener('click', onSpin);
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!button.disabled) {
        onSpin();
      } 
    }
  });

  



  const latSlot = document.querySelector('#latSlot .roulette__slot-value');
  const lngSlot = document.querySelector('#lngSlot .roulette__slot-value');
  const result = document.querySelector('#result');
  const link = document.querySelector('#gmapsLink');
  const copyButton = document.querySelector('#copyButton');
  const copyText = document.querySelector('#copyText');
  const searchSlot = document.querySelector('#searchSlot');
  const searchButton = document.querySelector('#searchButton');

  const searchEvent = searchSlot.addEventListener('click', () => {
    latSlot.select();
    latSlot.focus();
    searchButton.classList.add('pin');    
    searchSlot.removeEventListener('click', searchEvent);
    searchEvent = searchSlot.addEventListener('click', () => {
      searchButton.classList.remove('pin');
      latSlot.blur();
      lngSlot.blur();
      const lat = parseFloat(latSlot.value);
      const lng = parseFloat(lngSlot.value);
      if (!isNaN(lat) && !isNaN(lng)) {
        // Assuming you have a global 'map' object and 'L' from Leaflet.js
        showMarker([lat, lng]);
        searchSlot.removeEventListener('click', searchEvent);
        searchEvent = searchSlot.addEventListener('click', () => {
          latSlot.select();
          latSlot.focus();
          searchButton.classList.add('pin');    
          searchSlot.removeEventListener('click', searchEvent);
        });
      }
    });
  });
  copyButton.addEventListener('click', () => {
    const lat = latSlot.textContent;
    const lng = lngSlot.textContent;
    const text = `${lat}, ${lng}`;
    navigator.clipboard.writeText(text).then(() => {
      // copyStatus.textContent = 'Copied!';
      copyText.textContent = 'Copied!';
      setTimeout(() => {
        // copyStatus.textContent = '';
        copyText.textContent = 'Copy Lat/Lng';
      }, 1500);
    }).catch(() => {
      copyText.textContent = 'Failed';
      setTimeout(() => copyStatus.textContent = 'Copy Lat/Lng', 1500);
    });
  });

  let animInterval;

  function updateSlot(lat, lng) {
    latSlot.value = `${lat.toFixed(5)}`;
    lngSlot.value = `${lng.toFixed(5)}`;
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
    disableSpin: () => button.disabled = true,
    enableSpin: () => button.disabled = false
  };
}
