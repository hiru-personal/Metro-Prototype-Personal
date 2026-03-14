"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

interface Hotspot {
  id: string;
  x: number; // percentage position
  y: number;
  labelKey: string;
  descKey: string;
  icon: string;
}

const HOTSPOTS: Hotspot[] = [
  { id: "low-floor", x: 20, y: 70, labelKey: "lowFloor", descKey: "lowFloorDesc", icon: "♿" },
  { id: "ticketing", x: 50, y: 40, labelKey: "ticketing", descKey: "ticketingDesc", icon: "🎫" },
  { id: "exit-door", x: 80, y: 65, labelKey: "exitDoor", descKey: "exitDoorDesc", icon: "🚪" },
];

export default function BusViewerPage() {
  const t = useTranslations("busViewer");
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastX(e.clientX);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - lastX;
    setRotation((prev) => prev + delta * 0.3);
    setLastX(e.clientX);
  }, [isDragging, lastX]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setLastX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - lastX;
    setRotation((prev) => prev + delta * 0.3);
    setLastX(e.touches[0].clientX);
  }, [isDragging, lastX]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.min(2, Math.max(0.5, prev - e.deltaY * 0.001)));
  }, []);

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

      {/* Viewer */}
      <div
        ref={containerRef}
        className="relative w-full h-[500px] sm:h-[600px] rounded-2xl overflow-hidden border border-white/10 cursor-grab active:cursor-grabbing select-none animate-slide-up"
        style={{ animationDelay: "100ms" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Panoramic Background - Simulated 360° interior */}
        <div
          className="absolute inset-0 transition-transform duration-75"
          style={{
            transform: `scale(${zoom})`,
          }}
        >
          {/* Interior simulation using CSS gradients and shapes */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(${rotation}deg, 
                  #1a1a2e 0%, #16213e 15%, #0f3460 30%, 
                  #1a1a2e 45%, #16213e 60%, #0f3460 75%, #1a1a2e 90%, #16213e 100%
                )
              `,
            }}
          >
            {/* Bus interior elements */}
            {/* Ceiling */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-700 to-transparent opacity-80" />
            
            {/* Ceiling lights */}
            <div className="absolute top-6 left-0 right-0 flex justify-center gap-16">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-1.5 rounded-full bg-white/30"
                  style={{ 
                    transform: `translateX(${Math.sin((rotation + i * 45) * Math.PI / 180) * 20}px)`,
                    opacity: 0.3 + Math.abs(Math.cos((rotation + i * 45) * Math.PI / 180)) * 0.5
                  }}
                />
              ))}
            </div>

            {/* Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-800 to-transparent" />
            
            {/* Floor pattern */}
            <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(${90 + rotation * 0.5}deg, transparent, transparent 30px, rgba(255,255,255,0.1) 30px, rgba(255,255,255,0.1) 31px)`,
              }}
            />

            {/* Seats - Left side */}
            <div className="absolute left-4 sm:left-8 top-1/3 flex flex-col gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex gap-1" style={{ 
                  transform: `perspective(500px) rotateY(${5 + Math.sin((rotation + i * 30) * Math.PI / 180) * 3}deg)`,
                }}>
                  <div className="w-10 h-8 sm:w-14 sm:h-10 rounded-lg bg-blue-600/40 border border-blue-400/20 shadow-inner" />
                  <div className="w-10 h-8 sm:w-14 sm:h-10 rounded-lg bg-blue-600/40 border border-blue-400/20 shadow-inner" />
                </div>
              ))}
            </div>

            {/* Seats - Right side */}
            <div className="absolute right-4 sm:right-8 top-1/3 flex flex-col gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex gap-1" style={{
                  transform: `perspective(500px) rotateY(${-5 + Math.sin((rotation + i * 30) * Math.PI / 180) * 3}deg)`,
                }}>
                  <div className="w-10 h-8 sm:w-14 sm:h-10 rounded-lg bg-blue-600/40 border border-blue-400/20 shadow-inner" />
                  <div className="w-10 h-8 sm:w-14 sm:h-10 rounded-lg bg-blue-600/40 border border-blue-400/20 shadow-inner" />
                </div>
              ))}
            </div>

            {/* Handrails */}
            <div className="absolute top-20 left-1/4 right-1/4 flex justify-between">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-1 h-40 bg-gradient-to-b from-yellow-500/50 to-yellow-500/10 rounded-full"
                  style={{ transform: `translateX(${Math.sin((rotation + i * 90) * Math.PI / 180) * 10}px)` }}
                />
              ))}
            </div>

            {/* Windows */}
            <div className="absolute top-16 left-0 right-0 flex justify-center gap-8 sm:gap-16">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i}
                  className="w-16 h-20 sm:w-24 sm:h-28 rounded-lg border border-cyan-500/20 overflow-hidden"
                  style={{
                    transform: `translateX(${Math.sin((rotation + i * 72) * Math.PI / 180) * 30}px)`,
                    opacity: 0.5 + Math.abs(Math.cos((rotation + i * 72) * Math.PI / 180)) * 0.5,
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-sky-900/40 to-sky-800/20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotspots */}
        {HOTSPOTS.map((hotspot) => (
          <div
            key={hotspot.id}
            className="absolute z-10"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              id={`hotspot-${hotspot.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id);
              }}
              className="relative group"
            >
              {/* Pulse ring */}
              <div className="absolute inset-0 w-12 h-12 -m-1 rounded-full bg-cyan-400/20 animate-ping" />
              
              {/* Hotspot button */}
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-lg shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform cursor-pointer border-2 border-white/30">
                {hotspot.icon}
              </div>
            </button>

            {/* Tooltip */}
            {activeHotspot === hotspot.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-fade-in z-20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{hotspot.icon}</span>
                  <h3 className="text-sm font-bold text-white">
                    {t(`hotspots.${hotspot.labelKey}`)}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t(`hotspots.${hotspot.descKey}`)}
                </p>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-r border-b border-white/10 rotate-45 -mt-1.5" />
              </div>
            )}
          </div>
        ))}

        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm text-xs text-slate-300 pointer-events-none">
          {t("dragToExplore")}
        </div>

        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(2, z + 0.2)); }}
            className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center justify-center text-lg"
          >
            +
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(0.5, z - 0.2)); }}
            className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center justify-center text-lg"
          >
            −
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {HOTSPOTS.map((hotspot, idx) => (
          <div
            key={hotspot.id}
            className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all animate-slide-up cursor-pointer"
            style={{ animationDelay: `${(idx + 2) * 100}ms` }}
            onClick={() => setActiveHotspot(hotspot.id)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-xl">
                {hotspot.icon}
              </div>
              <h3 className="font-semibold text-white text-sm">
                {t(`hotspots.${hotspot.labelKey}`)}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(`hotspots.${hotspot.descKey}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
