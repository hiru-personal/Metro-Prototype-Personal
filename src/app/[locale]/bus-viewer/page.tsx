"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import "pannellum/build/pannellum.css";

interface PannellumViewer {
  destroy?: () => void;
  stopAutoRotate: () => void;
  setPitch: (pitch: number, duration?: number) => void;
  setYaw: (yaw: number, duration?: number) => void;
  setHfov: (hfov: number, duration?: number) => void;
  startAutoRotate: (speed?: number) => void;
  toggleFullscreen: () => void;
}

interface PannellumModule {
  viewer: (elementId: string, config: unknown) => PannellumViewer;
}

const hotspots = [
  {
    id: "seating",
    title: "Seating Information",
    body: "Regular Seats: 200, Priority Seats: 40, Wheelchair Spaces: 4.",
  },
  {
    id: "door",
    title: "Door Mechanism",
    body: "Pneumatic sliding doors with safety sensors and emergency manual override.",
  },
  {
    id: "emergency",
    title: "Emergency Exit",
    body: "Four marked exit points with audio and visual alarm system.",
  },
];

export default function BusViewerPage() {
  const t = useTranslations("busViewer");
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [openHotspot, setOpenHotspot] = useState<string>("seating");

  useEffect(() => {
    const loadViewer = async () => {
      setIsLoading(true);
      setHasError(false);

      if (viewerRef.current?.destroy) {
        viewerRef.current.destroy();
      }

      const pannellum = (await import("pannellum")) as unknown as PannellumModule;

      try {
        viewerRef.current = pannellum.viewer("panorama", {
          type: "equirectangular",
          panorama: "/bus360.jpg",
          autoLoad: true,
          compass: true,
          showZoomCtrl: true,
          keyboardZoom: true,
          mouseZoom: true,
          draggable: true,
          autoRotate: -2,
          autoRotateInactivityDelay: 3000,
          hfov: 88,
          pitch: 2,
          yaw: 5,
          hotSpots: [
            { pitch: -1, yaw: 18, type: "info", text: t("hotspots.lowFloor") },
            { pitch: 3, yaw: -28, type: "info", text: t("hotspots.ticketing") },
            { pitch: -4, yaw: 95, type: "info", text: t("hotspots.exitDoor") },
          ],
        });
        setIsLoading(false);
      } catch {
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadViewer();
    return () => {
      if (viewerRef.current?.destroy) {
        viewerRef.current.destroy();
      }
    };
  }, [t]);

  function resetView() {
    if (!viewerRef.current) return;
    viewerRef.current.stopAutoRotate();
    viewerRef.current.setPitch(2, 650);
    viewerRef.current.setYaw(5, 650);
    viewerRef.current.setHfov(88, 650);
    viewerRef.current.startAutoRotate(-2);
  }

  function openFullscreen() {
    if (!viewerRef.current) return;
    viewerRef.current.toggleFullscreen();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">{t("title")}</h1>

      <section className="relative rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-br from-indigo-500 to-violet-600 p-3 shadow-sm mb-6">
        <div className="rounded-lg bg-black/20 p-3 mb-3 flex items-center justify-between gap-3 text-white text-sm">
          <p>{t("dragToExplore")}</p>
          <div className="flex gap-2">
            <button onClick={resetView} className="rounded-md border border-white/30 px-3 py-1.5 hover:bg-white/15">{t("resetView")}</button>
            <button onClick={openFullscreen} className="rounded-md border border-white/30 px-3 py-1.5 hover:bg-white/15">{t("fullscreen")}</button>
          </div>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/45 text-white">
              {t("loading")}
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-red-900/60 px-5 text-center text-white">
              {t("failedLoad")}
            </div>
          )}

          <div id="panorama" className="h-[370px] sm:h-[520px] rounded-lg overflow-hidden border border-white/30" />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Metro Coach Details</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Model: M1 Coachyard 2024</li>
            <li>Capacity: 280 passengers</li>
            <li>Length: 26.5 meters</li>
            <li>Features: Air conditioning, CCTV, USB charging, Wi-Fi, emergency communication.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Hotspots</h2>
          <div className="space-y-2">
            {hotspots.map((spot) => (
              <div key={spot.id} className="rounded-lg border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenHotspot((prev) => (prev === spot.id ? "" : spot.id))}
                  className={`w-full px-3 py-2 text-left text-sm font-semibold flex items-center justify-between ${
                    openHotspot === spot.id ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <span>{spot.title}</span>
                  <span>{openHotspot === spot.id ? "▲" : "▼"}</span>
                </button>
                {openHotspot === spot.id && (
                  <div className="px-3 py-3 text-sm text-slate-700 bg-white">{spot.body}</div>
                )}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
