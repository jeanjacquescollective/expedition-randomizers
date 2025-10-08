// History state
export let historyData = []; // {word, name}

// DOM element refs (populated in init)
let historyMenu;
let openHistoryButton;
let closeHistoryButton;
let historyList;
let clearHistoryButton;
let exportPdfButton;
let exportCsvButton;
let historyItemTemplate;

function renderHistory() {
    if (!historyList || !historyItemTemplate) return;
    historyList.innerHTML = '';

    historyData.forEach((item, idx) => {
        const clone = historyItemTemplate.content.cloneNode(true);
        const li = clone.querySelector('li') || clone.querySelector('.history-item');
        const nameSpan = clone.querySelector('.history-item-name');
        const labelSpan = clone.querySelector('.history-item-label');
        const removeBtn = clone.querySelector('.history-item-remove');

        const word = item.word || (`Item ${idx + 1}`);
        const name = item.name || '';

        // show word in label and optional name in separate span
        if (labelSpan) labelSpan.textContent = word;
        if (nameSpan) nameSpan.textContent = name;

        // clicking the name will allow renaming (inline edit of the "name" field)
        if (nameSpan) {
            nameSpan.style.cursor = 'text';
            nameSpan.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'history-item-input';
                input.value = item.name || '';
                input.placeholder = 'Name';
                // replace name span with input
                nameSpan.replaceWith(input);
                input.focus();
                input.select();

                const finish = () => {
                    const newName = input.value.trim();
                    historyData[idx].name = newName;
                    saveHistory();
                    renderHistory();
                };
                input.addEventListener('blur', finish);
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        input.blur();
                    } else if (e.key === 'Escape') {
                        renderHistory(); // revert
                    }
                });
            });
        }

        // remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                historyData.splice(idx, 1);
                saveHistory();
                renderHistory();
            });
        }

        // attach to list
        if (li) historyList.appendChild(li);
    });
}

export function saveHistory() {
    try {
        localStorage.setItem('wordSlotMachineHistory', JSON.stringify(historyData));
    } catch (e) {
        console.warn('Could not save history', e);
    }
}

export function loadHistory() {
    const data = localStorage.getItem('wordSlotMachineHistory');
    if (data) {
        try {
            historyData = JSON.parse(data) || [];
        } catch (e) {
            historyData = [];
        }
    }
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
    const rows = [['Word', 'Name', 'URL']];
    historyData.forEach(item => {
        const currentUrl = new URL(window.location.href);
        const url = `${currentUrl}?word=${encodeURIComponent(item.word || '')}`;
        rows.push([
            `"${(item.word || '').replace(/"/g, '""')}"`,
            `"${(item.name || '').replace(/"/g, '""')}"`,
            `"${url}"`,
        ]);
    });
    const csvContent = rows.map(r => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'words-history.csv';
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
    doc.text('words History', 10, 10);
    let y = 20;
    doc.setFontSize(10);
    doc.text('Word', 10, y);
    doc.text('Name', 80, y);
    doc.text('URL', 140, y);
    y += 8;
    historyData.forEach(item => {
        doc.text(item.word || '', 10, y);
        doc.text(item.name || '', 80, y);
        const currentUrl = new URL(window.location.href);
        const url = `${currentUrl.origin}${currentUrl.pathname}?word=${encodeURIComponent(item.word || '')}`;
        try {
            if (typeof doc.textWithLink === 'function') {
                doc.textWithLink('Link', 140, y, { url });
            } else {
                doc.text('Link', 140, y);
            }
        } catch (e) {
            doc.text('Link', 140, y);
        }
        y += 8;
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });
    doc.save('words-history.pdf');
}

export function addHistoryData(data, name = '') {
    if (!name) name = "Team " + (historyData.length + 1);

    if (!data) return;
    const { word } = data;

    if (!word) return;
    historyData.unshift({ word, name });
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
    historyItemTemplate = document.getElementById('historyItemTemplate');

    // wire up events
    if (openHistoryButton) {
        openHistoryButton.addEventListener('click', () => {
            const isOpen = historyMenu && historyMenu.classList.contains('open');
            if (isOpen) {
                historyMenu.classList.remove('open');
                historyMenu.setAttribute('aria-hidden', 'true');
                openHistoryButton.setAttribute('aria-expanded', 'false');
            } else {
                historyMenu.classList.add('open');
                historyMenu.setAttribute('aria-hidden', 'false');
                openHistoryButton.setAttribute('aria-expanded', 'true');
            }
        });
    }
    if (closeHistoryButton) {
        closeHistoryButton.addEventListener('click', () => {
            if (historyMenu) {
                historyMenu.classList.remove('open');
                historyMenu.setAttribute('aria-hidden', 'true');
            }
            if (openHistoryButton) openHistoryButton.setAttribute('aria-expanded', 'false');
        });
    }
    if (clearHistoryButton) clearHistoryButton.addEventListener('click', clearHistory);
    if (exportCsvButton) exportCsvButton.addEventListener('click', exportCsv);
    if (exportPdfButton) exportPdfButton.addEventListener('click', exportPdf);

    // init data + UI
    loadHistory();
    renderHistory();
}
