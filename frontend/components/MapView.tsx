
"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const telecomPoints = [
  {
    id: 1,
    name: "Urban Core",
    position: [40.7128, -74.006],
    coverage: 92,
  },
  {
    id: 2,
    name: "Rural East",
    position: [39.9526, -75.1652],
    coverage: 48,
  },
  {
    id: 3,
    name: "Mountain Zone",
    position: [38.9072, -77.0369],
    coverage: 33,
  },
];

export default function MapView() {
  return (
    <MapContainer
      center={[39.5, -98.35]}
      zoom={4}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
/>

      {telecomPoints.map((point) => (
        <CircleMarker
          key={point.id}
          center={point.position as [number, number]}
          radius={20}
          pathOptions={{
            color: point.coverage > 70 ? "#38BDF8" : "#EF4444",
            fillOpacity: 0.5,
          }}
        >
          <Popup>
            <div>
              <h3>{point.name}</h3>
              <p>Coverage: {point.coverage}%</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}