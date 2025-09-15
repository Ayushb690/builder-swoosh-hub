import { useNavigate } from "react-router-dom";
import Topbar from "@/components/layout/Topbar";

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-muted/20">
      <Topbar title="FRA Atlas" showTitle={false} showLogo={false} showSearch={false} showProfile={false} showMenu={false} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 grid place-items-center rounded-md bg-primary text-primary-foreground font-bold shadow-sm">FA</div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">FRA Atlas</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-prose">Digitizing Forest Rights for Empowered Communities</p>
            <button
              className="mt-8 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-3 shadow hover:bg-primary/90"
              onClick={() => nav("/sign-in")}
            >
              Get Started
            </button>
          </div>
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <div className="aspect-[16/9] w-full rounded-lg bg-gradient-to-br from-green-50 to-blue-50 grid place-items-center text-muted-foreground">
              <span>WebGIS preview</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg border bg-background">IFR/CR/CFR tracking</div>
              <div className="p-3 rounded-lg border bg-background">Claim verification</div>
              <div className="p-3 rounded-lg border bg-background">AI recommendations</div>
              <div className="p-3 rounded-lg border bg-background">Responsive dashboard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
