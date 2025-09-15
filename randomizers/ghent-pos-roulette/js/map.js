import { polygonGeoJSON } from './coordinates.js';
import Palette from '../../../js/general.js';
let map, marker;

export function initMap() {
  map = L.map('map', { zoomControl: false }).setView([51.0536, 3.7253], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OSM contributors'
  }).addTo(map);
  L.geoJSON(polygonGeoJSON, { style: { color: Palette.heliotrope, weight: 2, fillOpacity: 0.1 } }).addTo(map);
}

export function showMarker([lat, lng]) {
  if (marker) marker.remove();
  marker = L.marker([lat, lng]).addTo(map);
  L.circle([lat, lng], { radius: 50, color: Palette.smokyBlack, fillOpacity: 0.2 }).addTo(map);
  map.setView([lat, lng], 20, { animate: true });

}

export function resetMap() {
  if (marker) marker.remove();
  map.setView([51.0536, 3.7253], 14, { animate: true });
}