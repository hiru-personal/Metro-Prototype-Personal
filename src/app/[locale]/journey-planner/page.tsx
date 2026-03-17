"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getStations, findRoutes, type JourneyResult } from "@/lib/data-service";
import { LiveTracker } from "@/components/LiveTracker";

export default function JourneyPlannerPage() {
  const t = useTranslations("journey");
  const locale = useLocale() as "en" | "si" | "ta";
  const stations = useMemo(() => getStations(), []);

  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [results, setResults] = useState<JourneyResult[] | null>(null);
  const [error, setError] = useState("");
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [travelTime, setTravelTime] = useState("10:30");

  function searchJourneys() {
    setError("");
    if (!fromId || !toId) {
      setError(t("selectBoth"));
      return;
    }
    if (fromId === toId) {
      setError(t("sameStation"));
      return;
    }

    setResults(findRoutes(fromId, toId));
  }

  function swapStations() {
    setFromId(toId);
    setToId(fromId);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">{t("title")}</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Enter Your Journey Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t("from")}</label>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
              >
                <option value="">{t("fromPlaceholder")}</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name[locale]}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={swapStations}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Swap
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t("to")}</label>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
              >
                <option value="">{t("toPlaceholder")}</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name[locale]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="block text-sm font-semibold text-slate-700 mb-2">Date and Time</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                />
                <input
                  type="time"
                  value={travelTime}
                  onChange={(e) => setTravelTime(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="h-4 w-4" />
                Fastest Route
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="h-4 w-4" />
                Cheapest Route
              </label>
            </div>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="button"
              onClick={searchJourneys}
              className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              {t("search")}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">{t("results")}</h2>

          {!results && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Enter journey details and click search to see available routes.
            </div>
          )}

          {results && results.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              {t("noResults")}
            </div>
          )}

          <div className="space-y-4">
            {results?.map((result, idx) => (
              <article key={idx} className="rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-blue-600 transition-colors">
                <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900">
                    {result.fromStation.name[locale]} to {result.toStation.name[locale]}
                  </h3>
                  <div className="flex gap-2 text-xs">
                    {idx === 0 && <span className="rounded-full bg-emerald-600 px-2 py-1 text-white">Fastest</span>}
                    {idx === results.length - 1 && <span className="rounded-full bg-amber-400 px-2 py-1 text-slate-900">Budget</span>}
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap gap-3 text-sm text-slate-700">
                  <span>Time: {result.travelTime} {t("minutes")}</span>
                  <span>Fare: LKR {result.fare}</span>
                  <span>Transfers: {result.transfers}</span>
                </div>

                <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700 mb-3">
                  <div className="flex items-center gap-2 py-1">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white">1</span>
                    <span>{travelTime} - {result.fromStation.name[locale]}</span>
                  </div>
                  <div className="flex items-center gap-2 py-1">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">2</span>
                    <span>{result.route.name[locale]} Transfer Point</span>
                  </div>
                  <div className="flex items-center gap-2 py-1">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white">3</span>
                    <span>{result.toStation.name[locale]}</span>
                  </div>
                </div>

                <LiveTracker />
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
