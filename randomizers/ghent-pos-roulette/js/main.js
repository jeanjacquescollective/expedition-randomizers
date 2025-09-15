import { initMap, resetMap, showMarker } from './map.js';
import { spinRoulette } from './spinner.js';
import { setupUI } from './ui.js';
  const audio = new Audio('assets/bike-gear-mechanism.wav');

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  const ui = setupUI(() => startSpin(ui));
});

function startSpin(ui) {
  ui.disableSpin();
  ui.startRolling();
  resetMap();
  audio.play();
  spinRoulette(pt => {
    ui.stopRolling(pt);
    showMarker(pt);
    setTimeout(() => {
      audio.currentTime = 0;
      audio.pause();
    }, 100);
    ui.enableSpin();
  });
}
