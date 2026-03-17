"use client";

import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { getStations } from "@/lib/data-service";

const RouteMapClient = dynamic(() => import("@/components/RouteMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl skeleton" />
  ),
});

export default function RouteMapPage() {
  const t = useTranslations("routeMap");
  const locale = useLocale() as "en" | "si" | "ta";
  const stations = getStations();
  const highlightedStation = stations[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-slate-900">{t("title")}</h1>
        <p className="text-slate-600 text-lg">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <section className="xl:col-span-2">
          <RouteMapClient />
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
              <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
              Line 1
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
              <span className="h-3 w-3 rounded-full bg-[#3B82F6]" />
              Line 2
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
              <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
              Line 3
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Station Information</h2>
            <p className="text-sm text-slate-700">{highlightedStation.name[locale]}</p>
            <p className="text-sm text-slate-600 mt-1">Routes: {highlightedStation.routes.join(", ")}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1">Wheelchair</span>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1">Elevator</span>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1">Help Desk</span>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Map Filters</h2>
            <div className="space-y-2 text-sm text-slate-700">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked />Line 1</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked />Line 2</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked />Line 3</label>
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
}
