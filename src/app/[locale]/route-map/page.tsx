"use client";

import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";

const RouteMapClient = dynamic(() => import("@/components/RouteMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl skeleton" />
  ),
});

export default function RouteMapPage() {
  const t = useTranslations("routeMap");

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

      {/* Map */}
      <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
        <RouteMapClient />
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <span className="text-sm text-slate-300">Red Line</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
          <span className="text-sm text-slate-300">Blue Line</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
          <span className="text-sm text-slate-300">Green Line</span>
        </div>
      </div>
    </div>
  );
}
