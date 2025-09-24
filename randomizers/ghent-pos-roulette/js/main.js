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
      window.addRouletteHistory(pt[0], pt[1]);
    setTimeout(() => {
      audio.currentTime = 0;
      audio.pause();
    }, 100);
    ui.enableSpin();
  });
}

 const historyMenu = document.getElementById('historyMenu');
    const openHistoryButton = document.getElementById('openHistoryButton');
    const closeHistoryButton = document.getElementById('closeHistoryButton');
    const historyList = document.getElementById('historyList');
    const clearHistoryButton = document.getElementById('clearHistoryButton');
    let historyData = []; // {lat, lng, name}

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
        if (data) {
            historyData = JSON.parse(data);
        }
    }

    function clearHistory() {
        if (confirm('Are you sure you want to clear the history?')) {
            historyData = [];
            saveHistory();
            renderHistory();
        }
    }

    openHistoryButton.addEventListener('click', () => {
      historyMenu.classList.add('open');
    });
    closeHistoryButton.addEventListener('click', () => {
      historyMenu.classList.remove('open');
    });
    clearHistoryButton.addEventListener('click', clearHistory);

    window.addEventListener('DOMContentLoaded', () => {
        loadHistory();
        renderHistory();
    });

    // Example: Add this function to your spin logic to push new coordinates
    window.addRouletteHistory = function(lat, lng, name = '') {
      if(name === ""){
        name = "Team " + (historyData.length + 1);
      }
        historyData.unshift({lat, lng, name});
        saveHistory();
        renderHistory();
    };


    const exportPdfButton = document.getElementById('exportPdfButton');
    const exportCsvButton = document.getElementById('exportCsvButton');

    exportCsvButton.onclick = () => {
      const rows = [['Name', 'Latitude', 'Longitude']];
      historyData.forEach(item => {
        rows.push([
          `"${item.name || ''}"`,
          item.lat,
          item.lng
        ]);
      });
      if(historyData.length === 0){
        alert("No history to export.");
        return;
      }
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
    };

    exportPdfButton.onclick = async () => {
      // Dynamically load jsPDF if not present
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
      y += 8;
      historyData.forEach(item => {
        doc.text(item.name || '', 10, y);
        doc.text(item.lat.toFixed(5), 70, y);
        doc.text(item.lng.toFixed(5), 120, y);
        y += 8;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
      if(historyData.length === 0){
        alert("No history to export.");
        return;
      }
      doc.save('roulette-history.pdf');
    };