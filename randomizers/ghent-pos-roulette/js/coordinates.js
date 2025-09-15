// Illustrative polygon — replace with accurate Ghent inner-city polygon
export const polygonGeoJSON = {
  "type": "Polygon",
  "coordinates": [
    [
       [ 3.7251649835256586, 51.03872721195785],//citadel
        [3.7144560730936647, 51.04447953598973],
        [3.7141988716649106, 51.04585402420166],
        [3.70291415773832, 51.05015914258808],
        [3.6931606226152525, 51.05751063085499],
        [3.6933578443136286, 51.06107146217237],
        [3.6950088275301205, 51.06314667422569],
        [3.6994900676891693, 51.066185209756014],
        [3.7025137812342157, 51.064273678510965],
        [3.732923273184607, 51.0677930163819],
        [3.7404698319224905, 51.052250772851146],
        [3.745658636317179, 51.047543247009266],
        [3.7374626839210228, 51.038831208965256],
        [3.7366961557175116, 51.038571676270045],
      // [3.7254930553198897, 51.03871998081658]
    ]
  ]
};

// Ray-casting algorithm for point-in-polygon
function pointInPolygon(point, polygon) {
  const [lng, lat] = point;
  const coords = polygon.coordinates[0];
  let inside = false;

  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const [xi, yi] = coords[i];
    const [xj, yj] = coords[j];

    const intersect = ((yi > lat) !== (yj > lat)) &&
                      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function randomPointInPolygon(polygon) {
  const coords = polygon.coordinates[0];
  const lats = coords.map(([_lng, lat]) => lat);
  const lngs = coords.map(([lng, _lat]) => lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  function rand(min, max) { return Math.random() * (max - min) + min; }

  while (true) {
    const lat = rand(minLat, maxLat);
    const lng = rand(minLng, maxLng);
    if (pointInPolygon([lng, lat], polygon)) {
      return [lat, lng]; // ✅ guaranteed inside
    }
  }
}
