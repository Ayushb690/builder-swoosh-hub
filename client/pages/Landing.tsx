import { useNavigate } from "react-router-dom";
import Topbar from "@/components/layout/Topbar";

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-muted/20">
      <Topbar title="FRAi" showTitle={false} showLogo={false} showSearch={false} showProfile={false} showMenu={false} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16">
          <div className="text-center">
            <div className="mx-auto h-16 px-4 grid place-items-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">FRAi</div>
            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight">FRAi</h1>
            <p className="mt-3 text-lg text-muted-foreground">Simple and Future</p>
            <button
              className="mt-8 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 shadow hover:bg-primary/90"
              onClick={() => nav("/sign-in")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
