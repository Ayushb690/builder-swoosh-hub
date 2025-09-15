import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useMemo, useState } from "react";
import { addClaim, getClaims, getUser } from "@/state/store";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const nav = useNavigate();
  const user = getUser();
  useEffect(() => {
    if (!user || user.role !== "User") nav("/sign-in");
  }, [user, nav]);

  const [file, setFile] = useState(null);
  const [claimType, setClaimType] = useState("IFR");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setRecent(getClaims().filter((c) => c.ownerRole === "User"));
  }, []);

  const hasApproved = useMemo(() => recent.some((c) => c.status === "Approved"), [recent]);

  const onUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    // Simulate NER extraction
    const dummy = {
      ownerRole: "User",
      ownerName: user?.name || "Example Name",
      name: "Example Name",
      village: "Example Village",
      coordinates: "20.30, 78.50",
      status: "Pending",
      claimType: claimType,
      filename: f.name,
    };

    const saved = addClaim(dummy);
    setRecent((r) => [saved, ...r]);
  };

  return (
    <AppLayout title="FRA Atlas">
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold">Upload Patta / Legacy Record</h3>
            <p className="text-sm text-muted-foreground">Upload PDF or JPEG. NER will auto-extract details.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <select className="h-10 rounded-md border px-3" value={claimType} onChange={(e) => setClaimType(e.target.value)}>
                <option value="IFR">IFR</option>
                <option value="CR">CR</option>
                <option value="CFR">CFR</option>
              </select>
              <input className="h-10 rounded-md border px-3" type="file" accept=".pdf,image/*" onChange={onUpload} />
            </div>
            {file ? (
              <div className="mt-4 text-sm text-muted-foreground">Uploaded: {file.name}</div>
            ) : null}
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold">Extracted Details (Mock)</h3>
            {recent.length === 0 ? (
              <div className="text-sm text-muted-foreground mt-2">No records yet.</div>
            ) : (
              <div className="mt-4 grid gap-3">
                {recent.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg border bg-background">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium">{c.filename}</div>
                      <span className={`px-2 py-0.5 rounded text-xs border ${c.status === "Approved" ? "bg-green-50 border-green-600 text-green-700" : c.status === "Rejected" ? "bg-red-50 border-red-600 text-red-700" : "bg-yellow-50 border-yellow-600 text-yellow-700"}`}>{c.status}</span>
                    </div>
                    <div className="mt-2 grid sm:grid-cols-2 gap-2 text-sm">
                      <div>Name: {c.name}</div>
                      <div>Village: {c.village}</div>
                      <div>Coordinates: {c.coordinates}</div>
                      <div>Claim Type: {c.claimType}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold">Disclaimer</h3>
            {hasApproved ? (
              <p className="text-sm mt-2">Your patta has been verified. Recommendation: Eligible for PM-KISAN and Jal Shakti scheme based on land use and location.</p>
            ) : (
              <p className="text-sm mt-2">Once your patta is verified by the authority, decision support will suggest compatible CSS schemes for you.</p>
            )}
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold">Tips</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2">
              <li>Ensure documents are clear and readable.</li>
              <li>Use correct claim type (IFR/CR/CFR).</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
