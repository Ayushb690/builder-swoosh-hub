import { useEffect, useRef } from "react";

export type MapFilters = {
  state: string;
  district: string;
  village: string;
  showIFR: boolean;
  showCR: boolean;
  showCFR: boolean;
};

const INDIA_CENTER: [number, number] = [20.5937, 78.9629];

export default function MapView({ filters }: { filters: MapFilters }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<any>(null);
  const layersRef = useRef<{ [k: string]: any }>({});

  useEffect(() => {
    const L = (window as any).L;
    if (!L) return;

    if (!leafletMap.current && mapRef.current) {
      const map = L.map(mapRef.current, { zoomControl: true }).setView(
        INDIA_CENTER,
        5,
      );
      leafletMap.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Mock FRA boundaries (polygon)
      const fraPoly = L.polygon(
        [
          [19.5, 77.0],
          [20.5, 77.5],
          [21.0, 79.0],
          [19.8, 79.5],
        ],
        { color: "#dc2626", weight: 2, fill: false },
      );

      // Land use polygons
      const farmland = L.polygon(
        [
          [18.8, 73.5],
          [19.4, 74.0],
          [19.0, 75.0],
          [18.5, 74.6],
        ],
        {
          color: "#d97706",
          weight: 1,
          fillColor: "#f59e0b",
          fillOpacity: 0.35,
        },
      );

      const forest = L.polygon(
        [
          [21.0, 84.8],
          [21.6, 85.2],
          [21.2, 86.2],
          [20.7, 85.7],
        ],
        {
          color: "#065f46",
          weight: 1,
          fillColor: "#10b981",
          fillOpacity: 0.35,
        },
      );

      const water = L.polygon(
        [
          [22.4, 88.1],
          [22.8, 88.4],
          [22.6, 89.0],
          [22.1, 88.6],
        ],
        {
          color: "#1d4ed8",
          weight: 1,
          fillColor: "#3b82f6",
          fillOpacity: 0.35,
        },
      );

      const settlements = L.polygon(
        [
          [23.1, 75.0],
          [23.5, 75.4],
          [23.2, 76.1],
          [22.8, 75.7],
        ],
        {
          color: "#374151",
          weight: 1,
          fillColor: "#9ca3af",
          fillOpacity: 0.35,
        },
      );

      // Rights mock points
      const ifr = L.circleMarker([20.3, 78.5], {
        radius: 6,
        color: "#16a34a",
        fillColor: "#16a34a",
        fillOpacity: 0.9,
      }).bindPopup("IFR Claim");
      const cr = L.circleMarker([19.9, 78.0], {
        radius: 6,
        color: "#a16207",
        fillColor: "#a16207",
        fillOpacity: 0.9,
      }).bindPopup("CR Claim");
      const cfr = L.circleMarker([20.7, 79.1], {
        radius: 6,
        color: "#2563eb",
        fillColor: "#2563eb",
        fillOpacity: 0.9,
      }).bindPopup("CFR Claim");

      const overlays: Record<string, any> = {
        "FRA Boundaries": fraPoly,
        Farmland: farmland,
        Forest: forest,
        Water: water,
        Settlements: settlements,
        "IFR Claims": ifr,
        "CR Claims": cr,
        "CFR Claims": cfr,
      };

      Object.entries(overlays).forEach(
        ([k, layer]) => (layersRef.current[k] = layer),
      );

      const layersControl = L.control.layers(
        undefined,
        {
          "FRA Boundaries": fraPoly,
          Farmland: farmland,
          Forest: forest,
          Water: water,
          Settlements: settlements,
        },
        { position: "topright" },
      );
      layersControl.addTo(map);

      // Legend
      const legend = L.control({ position: "bottomright" });
      legend.onAdd = function () {
        const div = L.DomUtil.create(
          "div",
          "legend bg-white/90 rounded-md shadow p-2 text-sm border",
        );
        div.innerHTML = `
          <div class="font-medium mb-1">Legend</div>
          <div class="flex items-center gap-2 mb-1"><span style="background:#f59e0b" class="inline-block w-3 h-3 border"></span> Farmland</div>
          <div class="flex items-center gap-2 mb-1"><span style="background:#10b981" class="inline-block w-3 h-3 border"></span> Forest</div>
          <div class="flex items-center gap-2 mb-1"><span style="background:#3b82f6" class="inline-block w-3 h-3 border"></span> Water</div>
          <div class="flex items-center gap-2"><span style="background:#9ca3af" class="inline-block w-3 h-3 border"></span> Settlements</div>
        `;
        return div;
      } as any;
      legend.addTo(map);

      // default visible
      fraPoly.addTo(map);
      forest.addTo(map);
      farmland.addTo(map);
      water.addTo(map);
      settlements.addTo(map);

      // Add rights based on filters initial state
      if (filters.showIFR) ifr.addTo(map);
      if (filters.showCR) cr.addTo(map);
      if (filters.showCFR) cfr.addTo(map);
    }
  }, []);

  // Update rights layers visibility when filters change
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !leafletMap.current) return;

    const map = leafletMap.current;
    const { showIFR, showCR, showCFR, state, district, village } = filters;

    const ifr = layersRef.current["IFR Claims"];
    const cr = layersRef.current["CR Claims"];
    const cfr = layersRef.current["CFR Claims"];

    const ensureOnMap = (layer: any, visible: boolean) => {
      if (!layer) return;
      if (visible && !map.hasLayer(layer)) layer.addTo(map);
      if (!visible && map.hasLayer(layer)) map.removeLayer(layer);
    };

    ensureOnMap(ifr, showIFR);
    ensureOnMap(cr, showCR);
    ensureOnMap(cfr, showCFR);

    // Recenter based on selection (mock extents)
    if (village) {
      map.setView([20.3, 78.5], 9);
    } else if (district) {
      map.setView([20.0, 78.2], 7);
    } else if (state) {
      map.setView([20.5, 85.5], 6);
    } else {
      map.setView(INDIA_CENTER, 5);
    }
  }, [filters]);

  return (
    <div
      ref={mapRef}
      className="h-[calc(100vh-6rem)] rounded-xl border shadow-sm overflow-hidden"
    />
  );
}
