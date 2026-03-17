"use client";

import { useEffect, useState } from "react";

type Train = {
  id: string;
  line: number;
  at: string;
  next: string;
  eta: string;
  occupancy: number;
};

const seedTrains: Train[] = [
  { id: "TR01", line: 1, at: "Fort", next: "Nuwara", eta: "3 mins", occupancy: 75 },
  { id: "TR02", line: 1, at: "Kelaniya", next: "Negombo", eta: "7 mins", occupancy: 45 },
  { id: "TR03", line: 2, at: "Main Junction", next: "Airport", eta: "5 mins", occupancy: 85 },
];

export default function LiveTrackingPage() {
  const [lastUpdated, setLastUpdated] = useState("");
  const [trains, setTrains] = useState(seedTrains);

  useEffect(() => {
    function tick() {
      setLastUpdated(new Date().toLocaleTimeString());
      setTrains((prev) =>
        prev.map((train) => {
          const next = Math.max(30, Math.min(95, train.occupancy + (Math.random() > 0.5 ? 4 : -4)));
          return { ...train, occupancy: next };
        })
      );
    }

    tick();
    const timer = setInterval(tick, 5000);
    return () => clearInterval(timer);
  }, []);

  const lineColors = ["#E74C3C", "#3498DB", "#27AE60", "#F39C12"];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Live Tracking</h1>

      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        Last Updated: <strong>{lastUpdated}</strong> • Auto-refresh: <strong>ON</strong>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section className="h-[360px] rounded-xl bg-gradient-to-br from-slate-400 to-slate-700 text-white flex items-center justify-center p-6 text-center">
          <div>
            <p className="text-lg font-semibold mb-2">Metro System Map with Live Trains</p>
            <p className="text-sm text-slate-200">Showing active train positions in real-time.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Active Trains</h2>
          <div className="space-y-3">
            {trains.map((train) => (
              <article key={train.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-full text-white font-bold flex items-center justify-center"
                    style={{ backgroundColor: lineColors[train.line - 1] }}
                  >
                    {train.line}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-900">Train {train.id} - Line {train.line}</h3>
                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-2">
                      <span>At: {train.at}</span>
                      <span>Next: {train.next}</span>
                      <span>ETA: {train.eta}</span>
                      <span>Occupancy: {Math.round(train.occupancy)}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${train.occupancy}%` }} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
