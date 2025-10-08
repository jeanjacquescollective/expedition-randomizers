// GitHub Copilot

import { addHistoryData, initHistory } from "./history.js";

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
const SLOT_HEIGHT = 64;
const RANDOM_DURATION = 300;
const SETTLE_DURATION = 500;
const EASE = 'cubic-bezier(.17,.67,.83,.67)';
const LEVER_ANIM_DURATION = 700; // ms

let wordList = [];
let maxLen = 0;
let spinning = false;

const els = {
    display: document.getElementById('wordDisplay'),
    spinBtn: document.getElementById('spinBtn'),
    lever: document.getElementById('lever')
};

async function init() {
    try {
        const res = await fetch('./assets/json/wordlist.json');
        const data = await res.json();
        wordList = data.begrippen || [];
        maxLen = wordList.reduce((m, w) => Math.max(m, w.length), 0);
        renderSlots();
        attachListeners();
        initHistory();
    } catch (err) {
        console.error('Failed to load word list', err);
    }
}

function attachListeners() {
    els.spinBtn?.addEventListener('click', spinSlotMachine);
    els.lever?.addEventListener('click', spinSlotMachine);
}

function renderSlots() {
    els.display.innerHTML = '';
    const lettersFragment = createLettersFragment();
    for (let i = 0; i < maxLen; i++) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';

        const roller = document.createElement('div');
        roller.className = 'letter-roller';
        roller.dataset.index = String(i);
        // append a cloned fragment of letters to keep DOM nodes separate per roller
        roller.appendChild(lettersFragment.cloneNode(true));

        slot.appendChild(roller);
        els.display.appendChild(slot);

        // initialize to space (last item)
        setRollerIndex(roller, ALPHABET.length - 1, { animate: false });
    }
}

function createLettersFragment() {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < ALPHABET.length; i++) {
        const div = document.createElement('div');
        div.className = 'letter';
        div.style.transform = `translateY(${i * SLOT_HEIGHT}px)`;
        div.textContent = ALPHABET[i];
        frag.appendChild(div);
    }
    return frag;
}

function setRollerIndex(roller, idx, { animate = true, duration = SETTLE_DURATION } = {}) {
    if (!roller) return;
    if (!animate) {
        roller.style.transition = 'none';
        roller.style.transform = `translateY(-${idx * SLOT_HEIGHT}px)`;
        // force style flush to ensure immediate placement
        void roller.offsetHeight;
        return;
    }
    roller.style.transition = `transform ${duration}ms ${EASE}`;
    roller.style.transform = `translateY(-${idx * SLOT_HEIGHT}px)`;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function triggerLeverAnimation() {
    if (!els.lever) return;
    // reset then apply to replay animation reliably
    els.lever.classList.remove('pulled');
    void els.lever.offsetHeight;
    els.lever.classList.add('pulled');
    // auto remove so next pull animates again
    setTimeout(() => {
        els.lever.classList.remove('pulled');
    }, LEVER_ANIM_DURATION);
}

async function spinSlotMachine() {
    if (spinning || !wordList.length) return;
    spinning = true;

    // animate lever when spin starts
    triggerLeverAnimation();

    const chosen = (wordList[Math.floor(Math.random() * wordList.length)] || '').toUpperCase();

    // Stage 1: quick random jitter on all rollers
    for (let i = 0; i < maxLen; i++) {
        const roller = els.display.querySelector(`.letter-roller[data-index="${i}"]`);
        const randomIdx = Math.floor(Math.random() * ALPHABET.length);
        setRollerIndex(roller, randomIdx, { animate: true, duration: RANDOM_DURATION });
    }

    // small pause, then settle to chosen word
    await sleep(400);

    for (let i = 0; i < maxLen; i++) {
        const roller = els.display.querySelector(`.letter-roller[data-index="${i}"]`);
        const letter = chosen[i] || ' ';
        const idx = Math.max(0, ALPHABET.indexOf(letter));
        setRollerIndex(roller, idx, { animate: true, duration: SETTLE_DURATION });
    }

    // wait until animations finish
    await sleep(SETTLE_DURATION + 100);
    // add to history
    addHistoryData({word: chosen});
    spinning = false;
}

init();