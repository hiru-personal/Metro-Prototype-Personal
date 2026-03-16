"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getStations, getRoutes, type Station, type Route } from "@/lib/data-service";
import { useLocale, useTranslations } from "next-intl";

function createStationIcon(routes: string[], allRoutes: Route[]) {
  const colors = routes.map((rId) => {
    const route = allRoutes.find((r) => r.id === rId);
    return route?.color || "#94a3b8";
  });

  const gradient = colors.length > 1
    ? `linear-gradient(135deg, ${colors.join(", ")})`
    : colors[0];

  return L.divIcon({
    className: "custom-station-marker",
    html: `<div style="
      width: 24px; height: 24px; 
      border-radius: 50%; 
      background: ${gradient}; 
      border: 3px solid white; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      cursor: pointer;
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -16],
  });
}

export default function RouteMapClient() {
  const stations = getStations();
  const routes = getRoutes();
  const locale = useLocale() as "en" | "si" | "ta";
  const t = useTranslations("routeMap");

  // Build polylines for each route
  const routeLines = routes.map((route) => {
    const positions = route.stations
      .map((sId) => stations.find((s) => s.id === sId))
      .filter(Boolean)
      .map((s) => [s!.latitude, s!.longitude] as [number, number]);

    return { id: route.id, color: route.color, positions };
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <MapContainer
        center={[6.9100, 79.8700]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "600px", width: "100%" }}
      >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

        {/* Route Lines */}
        {routeLines.map((line) => (
          <Polyline
            key={line.id}
            positions={line.positions}
            pathOptions={{
              color: line.color,
              weight: 4,
              opacity: 0.7,
              dashArray: "8 4",
            }}
          />
        ))}

        {/* Station Markers */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={createStationIcon(station.routes, routes)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="text-base font-bold text-white mb-2">
                  {station.name[locale]}
                </h3>

                {/* Routes */}
                <div className="mb-3">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t("routes")}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {station.routes.map((rId) => {
                      const route = routes.find((r) => r.id === rId);
                      return (
                        <span
                          key={rId}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: route?.color || "#64748b" }}
                        >
                          {route?.name[locale]}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Accessibility */}
                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t("accessibility")}</span>
                  <div className="flex gap-2 mt-1">
                    {station.accessibility.wheelchair && (
                      <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400" title={t("wheelchair")}>♿</span>
                    )}
                    {station.accessibility.tactile && (
                      <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400" title={t("tactile")}>⠿</span>
                    )}
                    {station.accessibility.elevator && (
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400" title={t("elevator")}>🛗</span>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
