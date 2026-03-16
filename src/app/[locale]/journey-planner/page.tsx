"use client";

import { Suspense, useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { getStations, findRoutes, getRoutes, type JourneyResult, type Station } from "@/lib/data-service";
import { LiveTracker } from "@/components/LiveTracker";

export default function JourneyPlannerPage() {
  return (
    <Suspense fallback={<JourneyPlannerFallback />}>
      <JourneyPlannerContent />
    </Suspense>
  );
}

function JourneyPlannerFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="space-y-3">
          <div className="skeleton h-8 w-60" />
          <div className="skeleton h-5 w-96 max-w-full" />
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
          <div className="skeleton h-11 w-44" />
        </div>
      </div>
    </div>
  );
}

function JourneyPlannerContent() {
  const t = useTranslations("journey");
  const locale = useLocale() as "en" | "si" | "ta";
  const router = useRouter();
  const searchParams = useSearchParams();
  const stations = useMemo(() => getStations(), []);
  const routes = useMemo(() => getRoutes(), []);

  const [fromId, setFromId] = useState(searchParams.get("from") || "");
  const [toId, setToId] = useState(searchParams.get("to") || "");
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [results, setResults] = useState<JourneyResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  // Initialize input values from URL params
  useEffect(() => {
    const f = searchParams.get("from");
    const to = searchParams.get("to");
    if (f) {
      setFromId(f);
      const station = stations.find((s) => s.id === f);
      if (station) setFromQuery(station.name[locale]);
    }
    if (to) {
      setToId(to);
      const station = stations.find((s) => s.id === to);
      if (station) setToQuery(station.name[locale]);
    }
    if (f && to) {
      handleSearch(f, to);
    }
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowToSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function getFilteredStations(query: string, excludeId?: string): Station[] {
    return stations
      .filter((s) => s.id !== excludeId)
      .filter((s) =>
        Object.values(s.name).some((n) =>
          n.toLowerCase().includes(query.toLowerCase())
        )
      );
  }

  function handleSearch(from?: string, to?: string) {
    const f = from || fromId;
    const t2 = to || toId;

    setError("");
    if (!f || !t2) {
      setError(t("selectBoth"));
      return;
    }
    if (f === t2) {
      setError(t("sameStation"));
      return;
    }

    setLoading(true);
    setResults(null);

    // Update URL
    router.push(`?from=${f}&to=${t2}`, { scroll: false });

    // Simulate network delay
    setTimeout(() => {
      const journeyResults = findRoutes(f, t2);
      setResults(journeyResults);
      setLoading(false);
    }, 800);
  }

  function selectFrom(station: Station) {
    setFromId(station.id);
    setFromQuery(station.name[locale]);
    setShowFromSuggestions(false);
  }

  function selectTo(station: Station) {
    setToId(station.id);
    setToQuery(station.name[locale]);
    setShowToSuggestions(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t("title")}
          </span>
        </h1>
        <p className="text-slate-400 text-lg">{t("subtitle")}</p>
      </div>

      {/* Journey Form */}
      <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From Station */}
          <div ref={fromRef} className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">{t("from")}</label>
            <input
              id="input-from"
              type="text"
              value={fromQuery}
              onChange={(e) => {
                setFromQuery(e.target.value);
                setFromId("");
                setShowFromSuggestions(true);
              }}
              onFocus={() => setShowFromSuggestions(true)}
              placeholder={t("fromPlaceholder")}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            {showFromSuggestions && (
              <div className="absolute z-50 w-full mt-2 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-fade-in">
                {getFilteredStations(fromQuery, toId).map((station) => (
                  <button
                    key={station.id}
                    onClick={() => selectFrom(station)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{station.name[locale]}</span>
                    <div className="flex gap-1">
                      {station.routes.map((rId) => {
                        const route = routes.find((r) => r.id === rId);
                        return (
                          <span key={rId} className="w-2 h-2 rounded-full" style={{ backgroundColor: route?.color }} />
                        );
                      })}
                    </div>
                  </button>
                ))}
                {getFilteredStations(fromQuery, toId).length === 0 && (
                  <div className="px-4 py-3 text-sm text-slate-500">{t("noResults")}</div>
                )}
              </div>
            )}
          </div>

          {/* To Station */}
          <div ref={toRef} className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">{t("to")}</label>
            <input
              id="input-to"
              type="text"
              value={toQuery}
              onChange={(e) => {
                setToQuery(e.target.value);
                setToId("");
                setShowToSuggestions(true);
              }}
              onFocus={() => setShowToSuggestions(true)}
              placeholder={t("toPlaceholder")}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            {showToSuggestions && (
              <div className="absolute z-50 w-full mt-2 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-fade-in">
                {getFilteredStations(toQuery, fromId).map((station) => (
                  <button
                    key={station.id}
                    onClick={() => selectTo(station)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{station.name[locale]}</span>
                    <div className="flex gap-1">
                      {station.routes.map((rId) => {
                        const route = routes.find((r) => r.id === rId);
                        return (
                          <span key={rId} className="w-2 h-2 rounded-full" style={{ backgroundColor: route?.color }} />
                        );
                      })}
                    </div>
                  </button>
                ))}
                {getFilteredStations(toQuery, fromId).length === 0 && (
                  <div className="px-4 py-3 text-sm text-slate-500">{t("noResults")}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          id="journey-search"
          onClick={() => handleSearch()}
          disabled={loading}
          className="mt-6 w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("loading") : t("search")}
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4 animate-fade-in">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="space-y-3">
                <div className="skeleton h-6 w-1/3" />
                <div className="skeleton h-4 w-1/2" />
                <div className="flex gap-4">
                  <div className="skeleton h-4 w-20" />
                  <div className="skeleton h-4 w-20" />
                  <div className="skeleton h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="animate-slide-up">
          <h2 className="text-xl font-bold text-white mb-4">{t("results")}</h2>

          {results.length === 0 ? (
            <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
              <div className="text-4xl mb-3">🚫</div>
              <p className="text-slate-400">{t("noResults")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Route Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: result.route.color }}
                    >
                      {result.route.name[locale]}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300">
                      {result.transfers === 0 ? t("direct") : `${result.transfers} ${t("transfer")}`}
                    </span>
                  </div>

                  {/* Journey Path */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-400" />
                      <span className="font-medium text-white">{result.fromStation.name[locale]}</span>
                    </div>
                    <div className="flex-1 border-t border-dashed border-white/20 mx-2" />
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="font-medium text-white">{result.toStation.name[locale]}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="text-xs text-slate-400 mb-1">{t("travelTime")}</div>
                      <div className="text-lg font-bold text-white">{result.travelTime} {t("minutes")}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="text-xs text-slate-400 mb-1">{t("stops")}</div>
                      <div className="text-lg font-bold text-white">{result.stops}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="text-xs text-slate-400 mb-1">{t("transfers")}</div>
                      <div className="text-lg font-bold text-white">{result.transfers}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                      <div className="text-xs text-cyan-400 mb-1">{t("fare")}</div>
                      <div className="text-lg font-bold text-cyan-400">LKR {result.fare.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="text-xs text-slate-400 mb-2">{t("paymentMethods")}</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white/5 text-slate-300">
                        💵 {t("cash")}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white/5 text-slate-300">
                        💳 {t("card")}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white/5 text-slate-300">
                        🎫 {t("prepaid")}
                      </span>
                    </div>
                  </div>

                  {/* Live Tracker */}
                  <div className="mt-4">
                    <LiveTracker />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
