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
    gap: 8,
  },
  {
    id: 2,
    name: "Rural East",
    position: [39.9526, -75.1652],
    coverage: 48,
    gap: 52,
  },
  {
    id: 3,
    name: "Mountain Zone",
    position: [38.9072, -77.0369],
    coverage: 33,
    gap: 67,
  },
];

interface MapViewProps {
  selectedRegion: string;
}

export default function MapView({ selectedRegion }: MapViewProps) {
  const filteredPoints =
    selectedRegion === "All Regions"
      ? telecomPoints
      : telecomPoints.filter(
          (point) => point.name === selectedRegion
        );

  // ================= GAP COLOR LOGIC =================
  const getGapColor = (gap: number) => {
    if (gap <= 20) return "#22c55e";
    if (gap <= 50) return "#facc15";
    return "#ef4444";
  };

  // ================= KPI CALCULATIONS =================
  const totalRegions = filteredPoints.length;

  const avgCoverage =
    filteredPoints.reduce((sum, p) => sum + p.coverage, 0) /
    (filteredPoints.length || 1);

  const avgGap =
    filteredPoints.reduce((sum, p) => sum + p.gap, 0) /
    (filteredPoints.length || 1);

  const criticalAreas = filteredPoints.filter(
    (p) => p.gap > 50
  ).length;

  // ================= CSV EXPORT =================
  const exportCSV = () => {
    const header = ["ID", "Region", "Latitude", "Longitude", "Coverage", "Gap"];

    const rows = filteredPoints.map((p) => [
      p.id,
      p.name,
      p.position[0],
      p.position[1],
      p.coverage,
      p.gap,
    ]);

    const csvContent =
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "telecom-data.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // ================= CARD STYLE =================
  const cardStyle = {
    background: "rgba(17,17,17,0.9)",
    color: "#fff",
    padding: "10px",
    borderRadius: "10px",
    minWidth: "120px",
    textAlign: "center" as const,
    border: "1px solid #333",
    backdropFilter: "blur(6px)",
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      
      {/* ================= LEFT SIDEBAR ================= */}
      <div
        style={{
          width: "260px",
          background: "#0f0f0f",
          color: "#fff",
          padding: "15px",
          borderRight: "1px solid #333",
        }}
      >
        <h2>Network Dashboard</h2>

        <p>Total Regions: {totalRegions}</p>
        <p>Avg Coverage: {avgCoverage.toFixed(1)}%</p>
        <p>Avg Gap: {avgGap.toFixed(1)}</p>
        <p>Critical Areas: {criticalAreas}</p>

        <hr style={{ margin: "10px 0" }} />

        <button
          onClick={exportCSV}
          style={{
            width: "100%",
            padding: "10px",
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Export CSV
        </button>

        <div style={{ marginTop: "20px" }}>
          <h4>Legend</h4>
          <p>🟢 Low (0–20)</p>
          <p>🟡 Medium (21–50)</p>
          <p>🔴 High (51+)</p>
        </div>
      </div>

      {/* ================= MAP AREA ================= */}
      <div style={{ flex: 1, position: "relative" }}>
        
        <MapContainer
          center={[39.5, -98.35]}
          zoom={4}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          />

          {filteredPoints.map((point) => (
            <CircleMarker
              key={point.id}
              center={point.position as [number, number]}
              radius={10 + point.gap / 5}
              pathOptions={{
                color: getGapColor(point.gap),
                fillOpacity: 0.6,
              }}
            >
              <Popup>
                <div>
                  <h3>{point.name}</h3>
                  <p>Coverage: {point.coverage}%</p>
                  <p>Gap Score: {point.gap}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

      </div>
    </div>
  );
} // <--- Added this final closing curly brace to fix the build error!