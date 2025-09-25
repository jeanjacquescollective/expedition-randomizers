import { initMap, resetMap, showMarker } from './map.js';
import { spinRoulette } from './spinner.js';
import { setupUI } from './ui.js';

const audio = new Audio('assets/bike-gear-mechanism.wav');

// History state
let historyData = []; // {lat, lng, name}

// DOM elements
const historyMenu = document.getElementById('historyMenu');
const openHistoryButton = document.getElementById('openHistoryButton');
const closeHistoryButton = document.getElementById('closeHistoryButton');
const historyList = document.getElementById('historyList');
const clearHistoryButton = document.getElementById('clearHistoryButton');
const exportPdfButton = document.getElementById('exportPdfButton');
const exportCsvButton = document.getElementById('exportCsvButton');

// --- History Functions ---
function renderHistory() {
  historyList.innerHTML = '';
  historyData.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'roulette__history-item';

    const nameInput = document.createElement('input');
    nameInput.className = 'roulette__history-name';
    nameInput.value = item.name || '';
    nameInput.placeholder = 'Name';
    nameInput.addEventListener('change', (e) => {
      historyData[idx].name = e.target.value;
      saveHistory();
    });

    const coordsSpan = document.createElement('span');
    coordsSpan.className = 'roulette__history-coords';
    coordsSpan.textContent = `${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}`;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'roulette__history-delete';
    deleteButton.innerHTML = '🗑️';
    deleteButton.title = 'Delete';
    deleteButton.onclick = () => {
      historyData.splice(idx, 1);
      saveHistory();
      renderHistory();
    };

    li.appendChild(nameInput);
    li.appendChild(coordsSpan);
    li.appendChild(deleteButton);
    historyList.appendChild(li);
  });
}

function saveHistory() {
  localStorage.setItem('rouletteHistory', JSON.stringify(historyData));
}

function loadHistory() {
  const data = localStorage.getItem('rouletteHistory');
  if (data) historyData = JSON.parse(data);
}

function clearHistory() {
  if (confirm('Are you sure you want to clear the history?')) {
    historyData = [];
    saveHistory();
    renderHistory();
  }
}

// --- Export Functions ---
function exportCsv() {
  if (historyData.length === 0) {
    alert("No history to export.");
    return;
  }
  const rows = [['Name', 'Latitude', 'Longitude', 'URL']];
  historyData.forEach(item => {
    const url = `https://jeanjacquescollective.github.io/expedition-randomizers/randomizers/ghent-pos-roulette/index.html?lat=${item.lat}&lng=${item.lng}`;
    rows.push([
      `"${item.name || ''}"`,
      item.lat,
      item.lng,
      `"${url}"`
    ]);
  });
  const csvContent = rows.map(r => r.join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'roulette-history.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportPdf() {
  if (historyData.length === 0) {
    alert("No history to export.");
    return;
  }
  if (typeof window.jsPDF === 'undefined') {
    await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text('Roulette History', 10, 10);
  let y = 20;
  doc.setFontSize(10);
  doc.text('Name', 10, y);
  doc.text('Latitude', 70, y);
  doc.text('Longitude', 120, y);
  doc.text('URL', 170, y);
  y += 8;
  historyData.forEach(item => {
    doc.text(item.name || '', 10, y);
    doc.text(String(item.lat), 70, y);
    doc.text(String(item.lng), 120, y);
    const url = `https://jeanjacquescollective.github.io/expedition-randomizers/randomizers/ghent-pos-roulette/index.html?lat=${item.lat}&lng=${item.lng}`;
    doc.textWithLink('Link', 170, y, { url });
    y += 8;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });
  doc.save('roulette-history.pdf');
}

// --- Spin Logic ---
function startSpin(ui) {
  ui.disableSpin();
  ui.startRolling();
  resetMap();
  audio.play();
  spinRoulette(pt => {
    ui.stopRolling(pt);
    showMarker(pt);
    window.addRouletteHistory(pt[0], pt[1]);
    window.history.replaceState({}, '', `?lat=${pt[0]}&lng=${pt[1]}`);
    setTimeout(() => {
      audio.currentTime = 0;
      audio.pause();
    }, 100);
    ui.enableSpin();
  });
}

// --- Global for adding history ---
window.addRouletteHistory = function (lat, lng, name = '') {
  if (!name) name = "Team " + (historyData.length + 1);
  historyData.unshift({ lat, lng, name });
  saveHistory();
  renderHistory();
};

// --- Event Listeners ---
openHistoryButton.addEventListener('click', () => {
  historyMenu.classList.add('open');
});
closeHistoryButton.addEventListener('click', () => {
  historyMenu.classList.remove('open');
});
clearHistoryButton.addEventListener('click', clearHistory);
exportCsvButton.addEventListener('click', exportCsv);
exportPdfButton.addEventListener('click', exportPdf);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadHistory();
  renderHistory();
  const ui = setupUI(() => startSpin(ui));

  // Show marker if lat/lng in URL
  const urlParams = new URLSearchParams(window.location.search);
  const lat = parseFloat(urlParams.get('lat'));
  const lng = parseFloat(urlParams.get('lng'));
  if (!isNaN(lat) && !isNaN(lng)) {
    showMarker([lat, lng], { width: 75 });
    ui.updateCoordsDisplay([lat, lng]);
  }
});
