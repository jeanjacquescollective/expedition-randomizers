import { randomPointInPolygon, polygonGeoJSON } from './coordinates.js';
export function spinRoulette(onComplete) {
  let elapsed = 0;
  let interval = 100;
  const total = 2000;
  let timer;

  function tick() {
    elapsed += interval;
    const pt = randomPointInPolygon(polygonGeoJSON);
    interval = 100 + (elapsed / total) * 400;
    if (elapsed < total) {
      timer = setTimeout(tick, interval);
    } else {
      onComplete(pt);
    }
  }

  tick();
  return () => clearTimeout(timer);
}