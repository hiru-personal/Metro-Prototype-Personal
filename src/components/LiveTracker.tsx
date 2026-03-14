"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function LiveTracker() {
  const t = useTranslations("tracker");
  const [minutes, setMinutes] = useState(() => Math.floor(Math.random() * 12) + 3);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setMinutes((prev) => {
        if (prev <= 1) {
          // Reset to simulate another bus coming
          return Math.floor(Math.random() * 10) + 5;
        }
        return prev - 1;
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
      <div className="flex items-center gap-3">
        {/* Animated pulse */}
        <div className="relative flex items-center justify-center w-8 h-8">
          <div className="absolute w-8 h-8 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="relative w-3 h-3 rounded-full bg-emerald-500 animate-pulse-glow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">
              {t("nextBus")}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
              {t("simulated")}
            </span>
          </div>
          <div className="text-lg font-bold text-emerald-400">
            {t("arriving")} {minutes} {t("minutes")}
          </div>
        </div>
      </div>

      {/* Progress bar animation */}
      <div className="hidden sm:flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1.5 h-4 rounded-full transition-all duration-500"
            style={{
              backgroundColor: i < Math.ceil(minutes / 3) ? "#10b981" : "rgba(255,255,255,0.1)",
              animationDelay: `${i * 150}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
