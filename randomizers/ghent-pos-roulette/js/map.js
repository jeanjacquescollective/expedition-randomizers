import { polygonGeoJSON } from './coordinates.js';
import Palette from '../../../js/general.js';
const dartIcon = L.icon({
  iconUrl: 'assets/darts.png',
  iconSize: [72, 72],
  iconAnchor: [0, 72],
  popupAnchor: [28, -72]
});
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
  marker = L.marker([lat, lng], { icon: dartIcon }).addTo(map);
  L.circle([lat, lng], { radius: 75, color: Palette.smokyBlack, fillOpacity: 0.2 }).addTo(map);
  map.setView([lat, lng], 20, { animate: true });

}

export function resetMap() {
  if (marker) marker.remove();
  map.setView([51.0536, 3.7253], 14, { animate: true });
}