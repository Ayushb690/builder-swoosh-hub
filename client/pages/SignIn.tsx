import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "@/components/layout/Topbar";
import { setUser } from "@/state/store";

const CREDS = {
  User: { id: "user@fra", password: "1234" },
  Authority: { id: "authority@fra", password: "admin" },
};

export default function SignIn() {
  const [role, setRole] = useState("User");
  const [step, setStep] = useState(1);
  const [uid, setUid] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const proceed = () => setStep(2);

  const login = () => {
    setError("");
    const expect = CREDS[role];
    if (uid === expect.id && pwd === expect.password) {
      const user = role === "User" ? { name: "Patta Holder", role: "User" } : { name: "Authority", role: "Authority" };
      setUser(user);
      nav(role === "User" ? "/user" : "/authority");
    } else {
      setError("Invalid credentials. Use the dummy credentials shown.");
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 mr-px">
      <Topbar title="FRA+Ai" showSearch={false} showProfile={false} showMenu={false} showTitle={false} />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <h2 className="text-xl font-semibold">Sign In</h2>
          {step === 1 ? (
            <>
              <p className="text-sm text-muted-foreground mt-1">Choose a role to continue</p>
              <div className="mt-6 space-y-3">
                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${role === "User" ? "ring-2 ring-ring" : ""}`}>
                  <input type="radio" name="role" value="User" checked={role === "User"} onChange={() => setRole("User")} />
                  <div>
                    <div className="font-medium">User (Organisation)</div>
                    <div className="text-xs text-muted-foreground">Upload and track claim status</div>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${role === "Authority" ? "ring-2 ring-ring" : ""}`}>
                  <input type="radio" name="role" value="Authority" checked={role === "Authority"} onChange={() => setRole("Authority")} />
                  <div>
                    <div className="font-medium">Authority (Ministry of Tribal Affairs)</div>
                    <div className="text-xs text-muted-foreground">Review and verify claims</div>
                  </div>
                </label>
              </div>
              <button onClick={proceed} className="mt-6 w-full h-10 rounded-md bg-primary text-primary-foreground">Continue</button>
              <button onClick={() => nav("/")} className="mt-2 w-full h-10 rounded-md border">Back</button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mt-1">Use dummy credentials shown below</p>
              <div className="mt-4 p-3 rounded-lg border bg-background text-sm">
                <div><span className="text-muted-foreground">User ID:</span> {CREDS[role].id}</div>
                <div><span className="text-muted-foreground">Password:</span> {CREDS[role].password}</div>
              </div>
              <div className="mt-4 space-y-3">
                <label className="text-sm w-full">
                  <span className="text-muted-foreground">User ID</span>
                  <input className="mt-1 w-full h-10 rounded-md border px-3" value={uid} onChange={(e) => setUid(e.target.value)} />
                </label>
                <label className="text-sm w-full">
                  <span className="text-muted-foreground">Password</span>
                  <input type="password" className="mt-1 w-full h-10 rounded-md border px-3" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                </label>
                {error ? <div className="text-sm text-red-600">{error}</div> : null}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setStep(1)} className="h-10 px-4 rounded-md border">Back</button>
                <button onClick={login} className="h-10 px-4 rounded-md bg-primary text-primary-foreground">Login</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
