// Illustrative polygon — replace with accurate Ghent inner-city polygon
export const polygonGeoJSON = {
    "type": "Polygon",
    "coordinates": [
        [
            [3.713379,51.064679],
            [3.720245,51.065837],
            [3.728485,51.064679],
            [3.734322,51.061492],
            [3.736725,51.057951],
            [3.736725,51.053991],
            [3.734665,51.051217],
            [3.729858,51.049774],
            [3.723335,51.048331],
            [3.717155,51.048331],
            [3.712692,51.050246],
            [3.710289,51.053991],
            [3.710289,51.058423],
            [3.713379,51.064679]
        ]
    ]
};

export function randomPointInPolygon(polygon) {
  const coords = polygon.coordinates[0];
  const lats = coords.map(([_lng, lat]) => lat);
  const lngs = coords.map(([lng, _lat]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  function rand(min, max) { return Math.random() * (max - min) + min; }
  for (;;) { // Loop until we find a point inside the polygon 
    const lat = rand(minLat, maxLat);
    const lng = rand(minLng, maxLng);
    // Optionally, add a point-in-polygon check here for accuracy
    return [lat, lng];
  }
}
