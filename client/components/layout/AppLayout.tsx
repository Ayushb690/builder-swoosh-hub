import { useState, type ReactNode } from "react";
import Topbar from "./Topbar";

interface AppLayoutProps {
  left?: ReactNode;
  children: ReactNode;
  title?: string;
  topbarFixed?: boolean;
  topbarSolid?: boolean;
}

export default function AppLayout({
  left,
  children,
  title = "FRA Atlas",
  topbarFixed = false,
  topbarSolid = false,
}: AppLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const gridCols = left
    ? "grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]"
    : "grid-cols-1";

  return (
    <div className="min-h-screen bg-muted/20">
      <Topbar
        title={title}
        onMenuClick={() => setMobileSidebarOpen((s) => !s)}
        fixed={topbarFixed}
        solid={topbarSolid}
      />
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className={`grid ${gridCols} gap-4 lg:gap-6 py-4 lg:py-6`}>
          {/* Sidebar for desktop */}
          {left ? (
            <aside className="hidden lg:block">
              <div className="rounded-xl bg-card shadow-sm border p-4 lg:p-5 sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto relative z-[1100]">
                {left}
              </div>
            </aside>
          ) : null}

          {/* Mobile sidebar drawer */}
          {left ? (
            <div
              className={`lg:hidden fixed inset-0 z-40 transition ${
                mobileSidebarOpen
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={!mobileSidebarOpen}
              onClick={() => setMobileSidebarOpen(false)}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div
                className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-card border-r shadow-xl p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {left}
              </div>
            </div>
          ) : null}

          {/* Main content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
