import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Sidebar, { type Filters } from "@/components/layout/Sidebar";
import MapView from "@/components/map/MapView";

export default function Index() {
  const [filters, setFilters] = useState<Filters>({
    state: "",
    district: "",
    village: "",
    showIFR: true,
    showCR: true,
    showCFR: true,
  });

  return (
    <AppLayout
      left={<Sidebar filters={filters} onChange={(next) => setFilters((f) => ({ ...f, ...next }))} />}
      title="FRA Atlas"
    >
      <div className="rounded-xl bg-card border shadow-sm p-2 sm:p-3 lg:p-4">
        <MapView filters={filters} />
      </div>
    </AppLayout>
  );
}
