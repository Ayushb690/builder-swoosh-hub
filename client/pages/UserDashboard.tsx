import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useMemo, useRef, useState } from "react";
import { addClaim, getClaims, getUser, saveClaims } from "@/state/store";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const nav = useNavigate();
  const user = getUser();
  useEffect(() => {
    if (!user || user.role !== "User") nav("/sign-in");
  }, [user, nav]);

  const [claimType, setClaimType] = useState("IFR");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extracted, setExtracted] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setRecent(getClaims().filter((c: any) => c.ownerRole === "User"));
  }, []);

  const filtered = useMemo(() => {
    return recent.filter((r) => {
      const typeOk = filterType === "All" || r.claimType === filterType;
      const statusOk = filterStatus === "All" || r.status === filterStatus;
      return typeOk && statusOk;
    });
  }, [recent, filterType, filterStatus]);

  const startExtraction = (filename: string) => {
    setUploading(true);
    setProgress(0);
    const tick = () => setProgress((p) => Math.min(100, p + Math.floor(10 + Math.random() * 20)));
    const interval = setInterval(tick, 200);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      const dummy = {
        ownerRole: "User",
        ownerName: user?.name || "Example Name",
        name: "Example Name",
        village: "Example Village",
        coordinates: "20.30, 78.50",
        status: "Pending",
        claimType,
        filename,
      };
      const saved = addClaim(dummy);
      setExtracted(saved);
      setRecent((r) => [saved, ...r]);
      setUploading(false);
    }, 1400);
  };

  const onFileInput = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    startExtraction(f.name);
  };

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const onDrop = (e: DragEvent) => {
      prevent(e);
      const f = e.dataTransfer?.files?.[0];
      if (f) startExtraction((f as any).name);
    };
    ["dragenter","dragover","dragleave","drop"].forEach((ev) => el.addEventListener(ev as any, prevent));
    el.addEventListener("drop", onDrop as any);
    return () => {
      ["dragenter","dragover","dragleave","drop"].forEach((ev) => el.removeEventListener(ev as any, prevent));
      el.removeEventListener("drop", onDrop as any);
    };
  }, []);

  const saveEdits = () => {
    if (!extracted) return;
    const updatedList = recent.map((c) => (c.id === extracted.id ? extracted : c));
    setRecent(updatedList);
    saveClaims(updatedList);
  };

  return (
    <AppLayout title="FRA Atlas">
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold">Upload Patta / Legacy Record</h3>
            <p className="text-sm text-muted-foreground">Drag & drop a PDF/JPEG or use the file picker. We'll simulate NER extraction.</p>
            <div className="mt-4 grid sm:grid-cols-[180px_minmax(0,1fr)] gap-3">
              <select className="h-10 rounded-md border px-3" value={claimType} onChange={(e) => setClaimType(e.target.value)}>
                <option value="IFR">IFR</option>
                <option value="CR">CR</option>
                <option value="CFR">CFR</option>
              </select>
              <div ref={dropRef} className={`rounded-lg border-2 border-dashed grid place-items-center p-6 sm:p-10 text-sm ${uploading ? "opacity-75" : ""}`}>
                <div className="text-center">
                  <div className="font-medium">Drop file here</div>
                  <div className="text-xs text-muted-foreground">or</div>
                  <label className="inline-flex mt-2 items-center justify-center px-3 h-9 rounded-md border cursor-pointer">
                    <input type="file" className="hidden" accept=".pdf,image/*" onChange={onFileInput} />
                    Choose file
                  </label>
                  {uploading ? (
                    <div className="mt-4">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Extracting entities... {progress}%</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Your Submissions</h3>
              <div className="flex gap-2">
                <select className="h-9 rounded-md border px-2 text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option>All</option>
                  <option>IFR</option>
                  <option>CR</option>
                  <option>CFR</option>
                </select>
                <select className="h-9 rounded-md border px-2 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option>All</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {filtered.length === 0 ? (
                <div className="text-sm text-muted-foreground">No records yet.</div>
              ) : (
                filtered.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg border bg-background">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium">{c.filename}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded border bg-slate-50">{c.claimType}</span>
                        <span className={`px-2 py-0.5 rounded border ${c.status === "Approved" ? "bg-green-50 border-green-600 text-green-700" : c.status === "Rejected" ? "bg-red-50 border-red-600 text-red-700" : "bg-yellow-50 border-yellow-600 text-yellow-700"}`}>{c.status}</span>
                      </div>
                    </div>
                    <div className="mt-2 grid sm:grid-cols-2 gap-2 text-sm">
                      <div>Name: {c.name}</div>
                      <div>Village: {c.village}</div>
                      <div>Coordinates: {c.coordinates}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold">Extracted Details</h3>
            {!extracted ? (
              <div className="text-sm text-muted-foreground mt-2">Upload a file to view extracted fields.</div>
            ) : (
              <div className="mt-3 grid gap-3">
                <label className="text-sm">
                  <span className="text-muted-foreground">Name</span>
                  <input className="mt-1 w-full h-9 rounded-md border px-3" value={extracted.name} onChange={(e) => setExtracted({ ...extracted, name: e.target.value })} />
                </label>
                <label className="text-sm">
                  <span className="text-muted-foreground">Village</span>
                  <input className="mt-1 w-full h-9 rounded-md border px-3" value={extracted.village} onChange={(e) => setExtracted({ ...extracted, village: e.target.value })} />
                </label>
                <label className="text-sm">
                  <span className="text-muted-foreground">Coordinates</span>
                  <input className="mt-1 w-full h-9 rounded-md border px-3" value={extracted.coordinates} onChange={(e) => setExtracted({ ...extracted, coordinates: e.target.value })} />
                </label>
                <button className="mt-2 h-9 rounded-md border" onClick={saveEdits}>Save</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
