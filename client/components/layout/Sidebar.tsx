import { useMemo } from "react";

export type Filters = {
  state: string;
  district: string;
  village: string;
  showIFR: boolean;
  showCR: boolean;
  showCFR: boolean;
};

interface SidebarProps {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
}

const MOCK_DATA = {
  states: [
    {
      name: "Odisha",
      districts: [
        {
          name: "Mayurbhanj",
          villages: ["Jashipur", "Baripada", "Kaptipada"],
        },
        {
          name: "Kandhamal",
          villages: ["Phulbani", "Baliguda", "Tumudibandha"],
        },
      ],
    },
    {
      name: "Maharashtra",
      districts: [
        { name: "Gadchiroli", villages: ["Aheri", "Bhamragad", "Etapalli"] },
        { name: "Nashik", villages: ["Igatpuri", "Surgana", "Dindori"] },
      ],
    },
  ],
};

export default function Sidebar({ filters, onChange }: SidebarProps) {
  const districts = useMemo(() => {
    const s = MOCK_DATA.states.find((x) => x.name === filters.state);
    return s?.districts ?? [];
  }, [filters.state]);

  const villages = useMemo(() => {
    const d = districts.find((x) => x.name === filters.district);
    return d?.villages ?? [];
  }, [districts, filters.district]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">FRAi</h2>
        <p className="text-sm text-muted-foreground mt-1">
          WebGIS dashboard for Forest Rights Act monitoring
        </p>
      </div>

      <section>
        <h3 className="font-medium mb-3">Filters</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">State</label>
            <select
              className="mt-1 w-full h-10 rounded-md border bg-background px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={filters.state}
              onChange={(e) =>
                onChange({ state: e.target.value, district: "", village: "" })
              }
            >
              <option value="">All States</option>
              {MOCK_DATA.states.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">District</label>
            <select
              className="mt-1 w-full h-10 rounded-md border bg-background px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={filters.district}
              onChange={(e) =>
                onChange({ district: e.target.value, village: "" })
              }
              disabled={!filters.state}
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Village</label>
            <select
              className="mt-1 w-full h-10 rounded-md border bg-background px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={filters.village}
              onChange={(e) => onChange({ village: e.target.value })}
              disabled={!filters.district}
            >
              <option value="">All Villages</option>
              {villages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-medium mb-3">Rights</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={filters.showIFR}
              onChange={(e) => onChange({ showIFR: e.target.checked })}
            />
            <span>Individual Forest Rights (IFR)</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={filters.showCR}
              onChange={(e) => onChange({ showCR: e.target.checked })}
            />
            <span>Community Rights (CR)</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={filters.showCFR}
              onChange={(e) => onChange({ showCFR: e.target.checked })}
            />
            <span>Community Forest Resource Rights (CFR)</span>
          </label>
        </div>
      </section>

      <section>
        <h3 className="font-medium mb-3">Progress</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg border bg-background shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span>Claims Granted</span>
              <span className="font-medium">70%</span>
            </div>
            <div className="h-2 mt-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-[70%] bg-green-600 rounded-full" />
            </div>
          </div>
          <div className="p-3 rounded-lg border bg-background shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span>Pending</span>
              <span className="font-medium">30%</span>
            </div>
            <div className="h-2 mt-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-[30%] bg-yellow-500 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <div className="text-xs text-muted-foreground">
        Data shown is mock for prototype
      </div>
    </div>
  );
}
