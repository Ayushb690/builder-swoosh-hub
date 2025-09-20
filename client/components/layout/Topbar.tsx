import { Search, User2, Menu } from "lucide-react";

interface TopbarProps {
  title?: string;
  onMenuClick?: () => void;
  showMenu?: boolean;
  showLogo?: boolean;
  showSearch?: boolean;
  showProfile?: boolean;
  showTitle?: boolean;
  fixed?: boolean;
  solid?: boolean;
}

export default function Topbar({
  title = "FRA Atlas",
  onMenuClick,
  showMenu = true,
  showLogo = true,
  showSearch = true,
  showProfile = true,
  showTitle = true,
  fixed = false,
  solid = false,
}: TopbarProps) {
  const bgCls = solid
    ? "bg-white shadow-sm"
    : "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b";
  const posCls = fixed ? "fixed top-0 w-full z-50" : "sticky top-0 z-30";
  return (
    <>
      <header className={`${bgCls} ${posCls}`}>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          {showMenu ? (
            <button
              className="lg:hidden p-2 rounded-md hover:bg-accent"
              aria-label="Open menu"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </button>
          ) : null}
          <div className="flex items-center gap-3">
            {showLogo ? (
              <div className="h-9 w-9 grid place-items-center rounded-md bg-primary text-primary-foreground font-bold shadow-sm -ml-[3px]">
                FA
              </div>
            ) : null}
            {showTitle ? (
              <div className="font-semibold text-lg tracking-tight hidden sm:block">
                {title}
              </div>
            ) : null}
          </div>

          <div className="flex-1" />

          {showSearch ? (
            <div className="hidden md:flex items-center max-w-xl w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search village or patta holder"
                  className="w-full h-10 pl-10 pr-3 rounded-md border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ) : null}

          <div className="flex-1 md:hidden" />

          {showProfile ? (
            <button className="ml-2 h-10 w-10 grid place-items-center rounded-full bg-accent text-foreground border">
              <User2 className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </header>
      {fixed ? <div className="h-16" aria-hidden /> : null}
    </>
  );
}
