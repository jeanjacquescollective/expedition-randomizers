import { initMap, resetMap, showMarker } from './map.js';
import { spinRoulette } from './spinner.js';
import { setupUI } from './ui.js';

const audio = new Audio('assets/bike-gear-mechanism.wav');

// History state
export let historyData = []; // {lat, lng, name}

// DOM element refs (populated in init)
let historyMenu;
let openHistoryButton;
let closeHistoryButton;
let historyList;
let clearHistoryButton;
let exportPdfButton;
let exportCsvButton;

function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = '';
    try {
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
    } catch (e) {
        console.warn('Could not render history', e);
        historyList.innerHTML = '<li class="error">Error loading history</li>';
        historyData = [];
    }
}

export function saveHistory() {
    localStorage.setItem('rouletteHistory', JSON.stringify(historyData));
}

export function loadHistory() {
    const data = localStorage.getItem('rouletteHistory');
    if (data) historyData = JSON.parse(data);
}

export function clearHistory() {
    if (confirm('Are you sure you want to clear the history?')) {
        historyData = [];
        saveHistory();
        renderHistory();
    }
}

export function exportCsv() {
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
            `"${url}"`,
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

export async function exportPdf() {
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
        try {
            // newer jspdf supports textWithLink
            if (typeof doc.textWithLink === 'function') {
                doc.textWithLink('Link', 170, y, { url });
            } else {
                doc.text('Link', 170, y);
            }
        } catch (e) {
            doc.text('Link', 170, y);
        }
        y += 8;
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });
    doc.save('roulette-history.pdf');
}


export function addRouletteHistory(lat, lng, name = '') {
    if (!name) name = "Team " + (historyData.length + 1);
    historyData.unshift({ lat, lng, name });
    saveHistory();
    renderHistory();
}

export function getHistory() {
    return historyData.slice();
}

// Initialize history UI and map. Call this after DOM is ready.
export function initHistory() {
    historyMenu = document.getElementById('historyMenu');
    openHistoryButton = document.getElementById('openHistoryButton');
    closeHistoryButton = document.getElementById('closeHistoryButton');
    historyList = document.getElementById('historyList');
    clearHistoryButton = document.getElementById('clearHistoryButton');
    exportPdfButton = document.getElementById('exportPdfButton');
    exportCsvButton = document.getElementById('exportCsvButton');

    // wire up events
    if (openHistoryButton) openHistoryButton.addEventListener('click', () => historyMenu && historyMenu.classList.add('open'));
    if (closeHistoryButton) closeHistoryButton.addEventListener('click', () => historyMenu && historyMenu.classList.remove('open'));
    if (clearHistoryButton) clearHistoryButton.addEventListener('click', clearHistory);
    if (exportCsvButton) exportCsvButton.addEventListener('click', exportCsv);
    if (exportPdfButton) exportPdfButton.addEventListener('click', exportPdf);

    // init map + UI
    loadHistory();
    renderHistory();
    const ui = setupUI(() => startSpin(ui));

    // Show marker if lat/lng in URL
    const urlParams = new URLSearchParams(window.location.search);
    const lat = parseFloat(urlParams.get('lat'));
    const lng = parseFloat(urlParams.get('lng'));
    if (!isNaN(lat) && !isNaN(lng)) {
        showMarker([lat, lng], { width: 75 });
        if (ui && typeof ui.updateCoordsDisplay === 'function') {
            ui.updateCoordsDisplay([lat, lng]);
        }
    }
}