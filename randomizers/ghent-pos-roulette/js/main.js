import { initMap, resetMap, showMarker } from './map.js';
import { spinRoulette } from './spinner.js';
import { setupUI } from './ui.js';
import Palette from '../../../js/general.js';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  const ui = setupUI(() => startSpin(ui));
});

function startSpin(ui) {
  ui.disableSpin();
  ui.startRolling();
  resetMap();
  spinRoulette(pt => {
    ui.stopRolling(pt);
    showMarker(pt);
    ui.enableSpin();
  });
}
