"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapView = dynamic(
  () => import("@/components/MapView"),
  {
    ssr: false,
  }
);

interface DashboardMetrics {
  population_served: string;
  national_coverage_score: number;
}

export default function Home() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetches live telemetry metrics from your local FastAPI server instance
    fetch("http://127.0.0.1:8000/api/v1/dashboard/metrics")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: DashboardMetrics) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Data Handshake Failed:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 flex font-sans antialiased">

      {/* LEFT MAP SECTION */}
      <section className="w-[70%] border-r border-slate-800/60 p-6">

        <div className="h-full rounded-2xl border border-slate-800/50 bg-[#0B1117] p-6 shadow-xl">

          {/* CHANGED: Primary Title from cyan-400 to a premium crisp white with tracking-tight */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-50">
            Telecom Coverage Gaps Map
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-400/80">
            Real Rails Intelligence Dashboard
          </p>

          {/* LIVE MAP */}
          <div className="mt-6 h-[80vh] overflow-hidden rounded-xl border border-slate-800/80 shadow-inner">
            <MapView />
          </div>

        </div>

      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="w-[30%] bg-[#0B1117] p-6 overflow-y-auto border-l border-slate-900">

        {/* CHANGED: Section title to a modern, cleaner slate white */}
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">
          Infrastructure Intelligence
        </h2>

        {/* CARD 1 */}
        <div className="mt-6 rounded-xl border border-slate-800/60 bg-[#111827] p-5">

          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Population Served
          </p>

          {/* KEEPING: Big metrics bright white and highly prominent */}
          <h3 className="mt-2 text-4xl font-extrabold text-slate-50 font-mono tracking-tight">
            {loading ? (
              <span className="text-xl text-slate-500 animate-pulse">Loading...</span>
            ) : (
              metrics?.population_served || "12.4M"
            )}
          </h3>

        </div>

        {/* CARD 2 */}
        <div className="mt-6 rounded-xl border border-slate-800/60 bg-[#111827] p-5">

          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            National Coverage Score
          </p>

          {/* CHANGED: Shifted from text-cyan-400 to a matching bright white metric rule */}
          <h3 className="mt-2 text-4xl font-extrabold text-slate-50 font-mono tracking-tight">
            {loading ? (
              <span className="text-xl text-slate-500 animate-pulse">Loading...</span>
            ) : (
              `${metrics?.national_coverage_score || 74}%`
            )}
          </h3>

        </div>

        {/* WHY THIS MATTERS */}
        <div className="mt-6 rounded-xl border border-slate-800/60 bg-[#111827] p-5">

          {/* CHANGED: Made the heading text-slate-200 for clean hierarchy */}
          <h3 className="text-base font-bold text-slate-200">
            Why This Matters
          </h3>

          <p className="mt-2.5 text-sm text-slate-400 leading-relaxed font-normal">
            Telecom infrastructure gaps create digital inequality,
            economic exclusion, weak emergency response access,
            and reduced participation in modern digital economies.
          </p>

        </div>

        {/* WHO CONTROLS */}
        <div className="mt-6 rounded-xl border border-slate-800/60 bg-[#111827] p-5">

          {/* CHANGED: Changed from text-indigo-300 to match the clean hierarchy text-slate-200 */}
          <h3 className="text-base font-bold text-slate-200">
            Who Controls The Rail
          </h3>

          <p className="mt-2.5 text-sm text-slate-400 leading-relaxed font-normal">
            Telecom operators, spectrum regulators,
            infrastructure tower companies,
            and government policy frameworks
            control the communications rail.
          </p>

        </div>

      </aside>

    </main>
  );
}