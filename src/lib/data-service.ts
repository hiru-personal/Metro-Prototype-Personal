import stationsData from '@/data/stations.json';
import routesData from '@/data/routes.json';

export interface Station {
  id: string;
  name: { en: string; si: string; ta: string };
  latitude: number;
  longitude: number;
  routes: string[];
  accessibility: {
    wheelchair: boolean;
    tactile: boolean;
    elevator: boolean;
  };
}

export interface Route {
  id: string;
  name: { en: string; si: string; ta: string };
  color: string;
  stations: string[];
  frequency: string;
  operatingHours: { start: string; end: string };
  farePerStation: number;
}

export interface JourneyResult {
  route: Route;
  fromStation: Station;
  toStation: Station;
  stops: number;
  travelTime: number; // minutes
  fare: number;
  transfers: number;
}

export function getStations(): Station[] {
  return stationsData as Station[];
}

export function getStationById(id: string): Station | undefined {
  return (stationsData as Station[]).find((s) => s.id === id);
}

export function getRoutes(): Route[] {
  return routesData as Route[];
}

export function getRouteById(id: string): Route | undefined {
  return (routesData as Route[]).find((r) => r.id === id);
}

export function findRoutes(fromId: string, toId: string): JourneyResult[] {
  const stations = stationsData as Station[];
  const routes = routesData as Route[];

  const fromStation = stations.find((s) => s.id === fromId);
  const toStation = stations.find((s) => s.id === toId);

  if (!fromStation || !toStation) return [];

  const results: JourneyResult[] = [];

  // Direct routes (both stations on the same line)
  for (const route of routes) {
    const fromIdx = route.stations.indexOf(fromId);
    const toIdx = route.stations.indexOf(toId);

    if (fromIdx !== -1 && toIdx !== -1) {
      const stops = Math.abs(toIdx - fromIdx);
      results.push({
        route,
        fromStation,
        toStation,
        stops,
        travelTime: stops * 4, // ~4 min per stop
        fare: stops * route.farePerStation,
        transfers: 0,
      });
    }
  }

  // Transfer routes (one transfer between two lines)
  for (let i = 0; i < routes.length; i++) {
    for (let j = i + 1; j < routes.length; j++) {
      const routeA = routes[i];
      const routeB = routes[j];

      const fromInA = routeA.stations.indexOf(fromId);
      const toInB = routeB.stations.indexOf(toId);

      if (fromInA === -1 || toInB === -1) continue;

      // Find transfer stations (common stations)
      const transferStations = routeA.stations.filter((s) =>
        routeB.stations.includes(s)
      );

      for (const transferId of transferStations) {
        const transferInA = routeA.stations.indexOf(transferId);
        const transferInB = routeB.stations.indexOf(transferId);

        const stopsA = Math.abs(transferInA - fromInA);
        const stopsB = Math.abs(toInB - transferInB);
        const totalStops = stopsA + stopsB;

        const transferStation = stations.find((s) => s.id === transferId);
        if (!transferStation) continue;

        // Avoid duplicates where this could also be a direct route
        const alreadyDirect = results.some(
          (r) => r.transfers === 0 && r.stops <= totalStops
        );
        if (alreadyDirect && totalStops >= (results[0]?.stops || Infinity)) continue;

        results.push({
          route: routeA, // primary route
          fromStation,
          toStation,
          stops: totalStops,
          travelTime: totalStops * 4 + 5, // +5 min transfer wait
          fare: stopsA * routeA.farePerStation + stopsB * routeB.farePerStation,
          transfers: 1,
        });
      }
    }
  }

  // Sort by travel time
  results.sort((a, b) => a.travelTime - b.travelTime);

  return results;
}

export function calculateFare(stops: number, farePerStation: number): number {
  return stops * farePerStation;
}
