import { randomPointInPolygon, polygonGeoJSON } from '../js/coords.js';

test('randomPointInPolygon returns a [lat, lng] pair', () => {
  const pt = randomPointInPolygon(polygonGeoJSON);
  expect(Array.isArray(pt)).toBe(true);
  expect(pt.length).toBe(2);
  expect(typeof pt[0]).toBe('number');
  expect(typeof pt[1]).toBe('number');
});
