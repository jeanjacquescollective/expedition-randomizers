// Wheel of Misfortune - SVG version (no canvas)
(function () {
    const wheel = document.getElementById('wheel');
    const wheelInner = document.getElementById('wheelInner');
    const spinBtn = document.getElementById('spinBtn');
    const reloadBtn = document.getElementById('reloadBtn');
    const resultEl = document.getElementById('result');

    const fallback = [
        "rusty key", "broken compass", "moth-eaten coat", "tarnished locket",
        "glass eye", "cracked mirror", "silver spoon", "rat's tail",
        "candied bone", "old map", "cursed coin", "faded photograph"
    ];

    let segments = [];
    let angle = 0; // radians, applied as rotate(angle) on wheelInner
    let animating = false;

    // Helpers
    function sliceColor(i, n) {
        const t = i / n;
        const r = Math.floor(40 + 120 * (1 - t));
        const g = Math.floor(6 + 30 * (t));
        const b = Math.floor(12 + 18 * (1 - t));
        return `rgb(${r},${g},${b})`;
    }

    // // Build the wheel segments as SVG paths + text
    // function draw() {
    //     while (wheelInner.firstChild) wheelInner.removeChild(wheelInner.firstChild);

    //     const cx = 0; // wheelInner is translated to center already
    //     const cy = 0;
    //     const radius = 540; // relative to viewBox 1200x1200
    //     const n = Math.max(segments.length, 1);
    //     const segAngle = (Math.PI * 2) / n;

    //     for (let i = 0; i < n; i++) {
    //         const start = i * segAngle;
    //         const end = start + segAngle;

    //         // compute arc endpoints
    //         const x1 = Math.cos(start) * radius;
    //         const y1 = Math.sin(start) * radius;
    //         const x2 = Math.cos(end) * radius;
    //         const y2 = Math.sin(end) * radius;
    //         const largeArc = (segAngle > Math.PI) ? 1 : 0;

    //         // path: move to center, line to start, arc to end, close
    //         const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    //         const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    //         path.setAttribute('d', pathD);
    //         path.setAttribute('fill', sliceColor(i, n));
    //         path.setAttribute('stroke', 'rgba(0,0,0,0.25)');
    //         path.setAttribute('stroke-width', '1');
    //         wheelInner.appendChild(path);

    //         // text group positioned by rotating around center, then placing text along x
    //         const mid = start + segAngle / 2;
    //         const deg = mid * 180 / Math.PI; // degrees
    //         const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    //         g.setAttribute('transform', `rotate(${deg})`); // rotation about origin (0,0)
    //         // text element placed at radius*0.54 along +x, rotated so it reads tangentially
    //         const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    //         text.setAttribute('x', radius * 0.54);
    //         text.setAttribute('y', '0');
    //         text.setAttribute('class', 'seg-text');
    //         text.setAttribute('text-anchor', 'middle');
    //         text.setAttribute('dominant-baseline', 'middle');
    //         // rotate the text so it's vertical readable around the wheel
    //         text.setAttribute('transform', 'rotate(90)');
    //         // font-size relative to radius for reasonable scaling
    //         text.style.fontSize = Math.floor(radius / 14) + 'px';
    //         const tnode = document.createTextNode(segments[i] || '???');
    //         text.appendChild(tnode);
    //         g.appendChild(text);
    //         wheelInner.appendChild(g);
    //     }

    //     // ensure current rotation applied
    //     setWheelRotation(angle);
    // }
// Build the wheel segments as SVG paths + text
function draw() {
    while (wheelInner.firstChild) wheelInner.removeChild(wheelInner.firstChild);

    const cx = 0; // wheelInner is translated to center already
    const cy = 0;
    const radius = 540; // relative to viewBox 1200x1200
    const n = Math.max(segments.length, 1);
    const segAngle = (Math.PI * 2) / n;

    for (let i = 0; i < n; i++) {
        const start = i * segAngle;
        const end = start + segAngle;

        // compute arc endpoints
        const x1 = Math.cos(start) * radius;
        const y1 = Math.sin(start) * radius;
        const x2 = Math.cos(end) * radius;
        const y2 = Math.sin(end) * radius;
        const largeArc = (segAngle > Math.PI) ? 1 : 0;

        // path: move to center, line to start, arc to end, close
        const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('fill', sliceColor(i, n));
        path.setAttribute('stroke', 'rgba(0,0,0,0.25)');
        path.setAttribute('stroke-width', '1');
        wheelInner.appendChild(path);

        // text group: rotate to segment mid-angle, then translate outward to radial position
        const mid = start + segAngle / 2;
        const deg = mid * 180 / Math.PI; // degrees
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        // rotate about center, then move the group's origin out along the radius.
        g.setAttribute('transform', `rotate(${deg}) translate(${radius * 0.54}, 0)`);

        // text placed at group's origin (which is at the radial position) and rotated so it reads tangentially
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '0');
        text.setAttribute('y', '0');
        text.setAttribute('class', 'seg-text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        // rotate the text so it's tangential to the wheel and readable
        // slightly smaller font and ensure it fits the wedge
        text.style.fontSize = Math.floor(radius / 18) + 'px';
        // make long labels fit by adjusting spacing/glyphs
        text.setAttribute('textLength', Math.floor(radius * 0.5).toString());
        text.setAttribute('lengthAdjust', 'spacingAndGlyphs');

        const tnode = document.createTextNode(segments[i] || '???');
        text.appendChild(tnode);
        g.appendChild(text);
        wheelInner.appendChild(g);
    }

    // ensure current rotation applied
    setWheelRotation(angle);
}

    function setWheelRotation(rad) {
        // convert radians to degrees; negative sign because SVG rotate is clockwise-positive
        const deg = rad * 180 / Math.PI;
        wheelInner.setAttribute('transform', `translate(600 600) rotate(${deg})`);
    }

    function selectedIndexFromAngle() {
        const n = Math.max(segments.length, 1);
        const segAngle = (Math.PI * 2) / n;
        let relative = (-Math.PI / 2 - angle) % (Math.PI * 2);
        if (relative < 0) relative += Math.PI * 2;
        return Math.floor(relative / segAngle) % n;
    }

    async function loadItems() {
        try {
            const resp = await fetch('objectList.json', { cache: "no-store" });
            if (!resp.ok) throw new Error('fetch failed');
            const data = await resp.json();
            if (!Array.isArray(data) || data.length < 2) throw new Error('invalid data');
            segments = data.slice();
        } catch (e) {
            segments = fallback.slice();
            console.warn('Using fallback list:', e);
        }
        draw();
    }

    function startSpin() {
        if (animating) return;
        if (segments.length < 2) return alert('Need at least 2 items to spin.');
        animating = true;
        spinBtn.disabled = true;

        const n = segments.length;
        const extraRounds = Math.floor(Math.random() * 4) + 4;
        const targetIndex = Math.floor(Math.random() * n);
        const segAngle = (Math.PI * 2) / n;
        const targetRelative = (targetIndex + 0.5) * segAngle;
        const targetAngle = -Math.PI / 2 - targetRelative + (extraRounds * 2 * Math.PI);
        const duration = 3800 + Math.random() * 1600;
        const start = performance.now();
        const startAngle = angle;
        const delta = targetAngle - startAngle;
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            angle = startAngle + delta * easeOutCubic(t);
            setWheelRotation(angle);
            if (t < 1) requestAnimationFrame(tick);
            else {
                animating = false;
                spinBtn.disabled = false;
                showResult(selectedIndexFromAngle());
            }
        }
        requestAnimationFrame(tick);
    }

    function showResult(idx) {
        const txt = segments[idx] || '...';
        resultEl.textContent = `Misfortune: ${txt}`;
        resultEl.style.color = '#ffb6c1';
        resultEl.animate([
            { transform: 'translateX(-2px)' },
            { transform: 'translateX(2px)' },
            { transform: 'translateX(-1px)' },
            { transform: 'translateX(0)' }
        ], { duration: 420, easing: 'ease-out' });
    }

    // Wire up controls
    spinBtn.addEventListener('click', startSpin);
    reloadBtn.addEventListener('click', loadItems);

    // initial load
    loadItems();
})();