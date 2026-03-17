"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface PannellumViewer {
  on: (event: string, callback: (...args: unknown[]) => void) => PannellumViewer;
  destroy: () => void;
  stopAutoRotate: () => void;
  startAutoRotate: (speed: number) => void;
  setPitch: (pitch: number, duration?: number) => void;
  setYaw: (yaw: number, duration?: number) => void;
  setHfov: (hfov: number, duration?: number) => void;
  toggleFullscreen: () => void;
}

interface PannellumWindow extends Window {
  pannellum?: {
    viewer: (container: HTMLElement, config: Record<string, unknown>) => PannellumViewer;
  };
}

export default function BusViewerPage() {
  const t = useTranslations("busViewer");
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let destroyed = false;

    const loadViewer = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        // Import CSS and the viewer — pannellum's side effect sets window.pannellum
        await import("pannellum/build/pannellum.css").catch(() => {});
        await import("pannellum");

        if (destroyed || !containerRef.current) return;

        const pannellum = (window as PannellumWindow).pannellum;
        if (!pannellum?.viewer) {
          throw new Error("Pannellum viewer not available");
        }

        // Destroy any previously mounted viewer
        if (viewerRef.current?.destroy) {
          try { viewerRef.current.destroy(); } catch { /* viewer may already be in an invalid state */ }
        }

        viewerRef.current = pannellum.viewer(containerRef.current, {
          type: "equirectangular",
          panorama: "/bus360.jpg",
          autoLoad: true,
          compass: true,
          showZoomCtrl: true,
          keyboardZoom: true,
          mouseZoom: true,
          draggable: true,
          friction: 0.14,
          autoRotate: -2,
          autoRotateInactivityDelay: 3500,
          minHfov: 45,
          maxHfov: 110,
          hfov: 88,
          pitch: 2,
          yaw: 5,
          hotSpots: [
            {
              pitch: -1,
              yaw: 18,
              type: "info",
              text: t("hotspots.lowFloor"),
            },
            {
              pitch: 3,
              yaw: -28,
              type: "info",
              text: t("hotspots.ticketing"),
            },
            {
              pitch: -4,
              yaw: 95,
              type: "info",
              text: t("hotspots.exitDoor"),
            },
          ],
        });

        viewerRef.current.on("load", () => {
          if (!destroyed) setIsLoading(false);
        });

        viewerRef.current.on("error", () => {
          if (!destroyed) {
            setHasError(true);
            setIsLoading(false);
          }
        });
      } catch {
        if (!destroyed) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadViewer();

    return () => {
      destroyed = true;
      if (viewerRef.current?.destroy) {
        try { viewerRef.current.destroy(); } catch { /* viewer may already be in an invalid state during unmount */ }
        viewerRef.current = null;
      }
    };
  }, [t]); // viewer is initialized once; t is stable within a locale context

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-cyan-400">
          {t("title")}
        </h1>
        <p className="text-slate-300">{t("subtitle")}</p>
      </div>

      <section className="rounded-3xl border border-white/15 bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 shadow-2xl shadow-cyan-950/20">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3">
          <p className="text-sm sm:text-base font-medium text-cyan-300">{t("dragToExplore")}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={resetView}
              className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs sm:text-sm font-semibold text-cyan-200 hover:bg-cyan-400/20 transition-colors"
            >
              {t("resetView")}
            </button>
            <button
              onClick={openFullscreen}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              {t("fullscreen")}
            </button>
          </div>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-slate-950/70 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400" />
                <p className="text-sm sm:text-base text-slate-200">{t("loading")}</p>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-red-950/60 backdrop-blur-sm">
              <div className="text-center px-4">
                <p className="text-sm sm:text-base text-red-100">{t("failedLoad")}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  {t("reload")}
                </button>
              </div>
            </div>
          )}

          <div
            ref={containerRef}
            className="w-full h-[420px] sm:h-[560px] lg:h-[650px] rounded-2xl overflow-hidden border border-white/10 bg-slate-950"
          />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-300 font-semibold mb-2">
            {t("currentStatus")}
          </p>
          <h2 className="text-2xl font-bold text-white mb-1">{t("currentView")}</h2>
          <p className="text-slate-300">{t("qualityNote")}</p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-cyan-300 font-semibold mb-2">
            {t("hotspotTitle")}
          </p>
          <ul className="space-y-2 text-slate-200">
            <li>✓ {t("hotspots.lowFloor")}</li>
            <li>✓ {t("hotspots.ticketing")}</li>
            <li>✓ {t("hotspots.exitDoor")}</li>
          </ul>
        </article>
      </section>
    </div>
  );
}