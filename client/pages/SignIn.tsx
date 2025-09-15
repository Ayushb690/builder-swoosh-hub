import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "@/components/layout/Topbar";
import { setUser } from "@/state/store";

export default function SignIn() {
  const [role, setRole] = useState("User");
  const nav = useNavigate();

  const continueLogin = () => {
    const user = role === "User" ? { name: "Patta Holder", role: "User" } : { name: "Authority", role: "Authority" };
    setUser(user);
    nav(role === "User" ? "/user" : "/authority");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Topbar title="FRA Atlas" />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <h2 className="text-xl font-semibold">Sign In</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose a role to continue</p>
          <div className="mt-6 space-y-3">
            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${role === "User" ? "ring-2 ring-ring" : ""}`}>
              <input type="radio" name="role" value="User" checked={role === "User"} onChange={() => setRole("User")} />
              <div>
                <div className="font-medium">User (Patta Holder)</div>
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
          <button onClick={continueLogin} className="mt-6 w-full h-10 rounded-md bg-primary text-primary-foreground">Continue</button>
          <button onClick={() => nav("/")} className="mt-2 w-full h-10 rounded-md border">Back</button>
        </div>
      </div>
    </div>
  );
}
