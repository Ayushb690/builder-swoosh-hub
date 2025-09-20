import AppLayout from "@/components/layout/AppLayout";
import Sidebar from "@/components/layout/Sidebar";
import MapView from "@/components/map/MapView";
import { useEffect, useMemo, useState } from "react";
import { getClaims, getUser, updateClaimStatus, deleteClaim } from "@/state/store";
import { useNavigate } from "react-router-dom";

export default function AuthorityDashboard() {
  const nav = useNavigate();
  const user = getUser();
  useEffect(() => {
    if (!user || user.role !== "Authority") nav("/sign-in");
  }, [user, nav]);

  const [filters, setFilters] = useState({
    state: "",
    district: "",
    village: "",
    showIFR: true,
    showCR: true,
    showCFR: true,
    pending: true,
    granted: true,
  });

  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const list = getClaims();
    setRecords(list);
    if (list.length && !selected) setSelected(list[0]);
  }, []);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const typeOk = (r.claimType === "IFR" && filters.showIFR) || (r.claimType === "CR" && filters.showCR) || (r.claimType === "CFR" && filters.showCFR);
      const statusOk = (r.status === "Pending" && filters.pending) || (r.status === "Approved" && filters.granted) || (r.status === "Rejected" && true);
      return typeOk && statusOk;
    });
  }, [records, filters]);

  const mark = (status) => {
    if (!selected) return;
    const updated = updateClaimStatus(selected.id, status);
    setSelected(updated);
    setRecords((rs) => rs.map((x) => (x.id === updated.id ? updated : x)));
  };

  const remove = (id) => {
    const next = deleteClaim(id);
    setRecords(next);
    setSelected((s) => (s && s.id === id ? next[0] || null : s));
  };

  return (
    <AppLayout
      title="FRA Atlas"
      left={
        <div className="space-y-6">
          <Sidebar
            filters={filters}
            onChange={(next) => setFilters((f) => ({ ...f, ...next }))}
          />
          <section>
            <h3 className="font-medium mb-3">Status Filters</h3>
            <label className="flex items-center gap-3 mb-2">
              <input type="checkbox" className="h-4 w-4" checked={filters.pending} onChange={(e) => setFilters((f) => ({ ...f, pending: e.target.checked }))} />
              <span>Pending Claims</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" checked={filters.granted} onChange={(e) => setFilters((f) => ({ ...f, granted: e.target.checked }))} />
              <span>Granted (Approved) Claims</span>
            </label>
          </section>
        </div>
      }
    >
      <div className="grid xl:grid-cols-[minmax(0,1fr)_380px] gap-4 lg:gap-6">
        <div className="space-y-4">
          <div className="rounded-xl border bg-card shadow-sm p-2 sm:p-3 lg:p-4">
            <MapView filters={filters} />
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Legacy Records</h3>
              <div className="text-xs text-muted-foreground">{filtered.length} items</div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="py-2 pr-3">File</th>
                    <th className="py-2 pr-3">Type</th>
                    <th className="py-2 pr-3">Village</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className={`border-b last:border-0 ${selected?.id === r.id ? "bg-accent/40" : ""}`}>
                      <td className="py-2 pr-3 whitespace-nowrap cursor-pointer" onClick={() => setSelected(r)}>{r.filename || "Record"}</td>
                      <td className="py-2 pr-3">{r.claimType}</td>
                      <td className="py-2 pr-3">{r.village}</td>
                      <td className="py-2 pr-3">
                        <span className={`px-2 py-0.5 rounded text-xs border ${r.status === "Approved" ? "bg-green-50 border-green-600 text-green-700" : r.status === "Rejected" ? "bg-red-50 border-red-600 text-red-700" : "bg-yellow-50 border-yellow-600 text-yellow-700"}`}>{r.status}</span>
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex gap-2">
                          <button className="px-3 h-8 rounded-md border" onClick={() => { setSelected(r); mark("Approved"); }}>Verify</button>
                          <button className="px-3 h-8 rounded-md border" onClick={() => { setSelected(r); mark("Rejected"); }}>Reject</button>
                          <button className="px-3 h-8 rounded-md border border-red-300 text-red-600" onClick={() => remove(r.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="rounded-xl border bg-card shadow-sm p-5 h-min sticky top-24">
          <h3 className="font-semibold">Details</h3>
          {!selected ? (
            <div className="text-sm text-muted-foreground mt-2">Select a record to view details</div>
          ) : (
            <div className="mt-3 space-y-2 text-sm">
              <div><span className="text-muted-foreground">File:</span> {selected.filename}</div>
              <div><span className="text-muted-foreground">Type:</span> {selected.claimType}</div>
              <div><span className="text-muted-foreground">Name:</span> {selected.name}</div>
              <div><span className="text-muted-foreground">Village:</span> {selected.village}</div>
              <div><span className="text-muted-foreground">Coordinates:</span> {selected.coordinates}</div>
              <div><span className="text-muted-foreground">Status:</span> {selected.status}</div>

              <div className="mt-4 p-3 rounded-lg border bg-background">
                <div className="font-medium mb-1">AI / DSS Recommendations</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>PM-KISAN: Income support eligibility</li>
                  <li>Jal Shakti: Water resource support</li>
                  <li>Afforestation Mission: CFR-based benefits</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="px-3 h-9 rounded-md border" onClick={() => mark("Approved")}>Mark Verified</button>
                <button className="px-3 h-9 rounded-md border" onClick={() => mark("Rejected")}>Reject</button>
                <button className="px-3 h-9 rounded-md border border-red-300 text-red-600" onClick={() => selected && remove(selected.id)}>Delete</button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </AppLayout>
  );
}
