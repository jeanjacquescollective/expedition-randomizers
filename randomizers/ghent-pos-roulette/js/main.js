import { initMap, showMarker } from './map.js';
import { spinRoulette } from './spinner.js';
import { setupUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  const ui = setupUI(() => startSpin(ui));
});

function startSpin(ui) {
  ui.disableSpin();
  ui.startRolling();
  spinRoulette(pt=> showMarker(pt), pt => {
    ui.stopRolling(pt);
    showMarker(pt);
    ui.enableSpin();
  });
}
