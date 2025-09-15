import { polygonGeoJSON } from './coordinates.js';

let map, marker;

export function initMap() {
  map = L.map('map', { zoomControl: false }).setView([51.0536, 3.7253], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OSM contributors'
  }).addTo(map);
  L.geoJSON(polygonGeoJSON, { style: { color: '#f00', weight: 2, fillOpacity: 0.1 } }).addTo(map);
}

export function showMarker([lat, lng]) {
  if (marker) marker.remove();
  marker = L.marker([lat, lng]).addTo(map);
  map.panTo([lat, lng], { animate: true });
}
