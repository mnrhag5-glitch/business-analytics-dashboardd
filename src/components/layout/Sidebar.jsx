
import { NavLink } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  ChevronLeft,
  CircleDollarSign,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Users,
  X,
} from "lucide-react";

const navigation = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Leads", path: "/leads", icon: Users },
  { label: "Quotations", path: "/quotations", icon: FileText },
  { label: "Deals", path: "/deals", icon: BriefcaseBusiness },
  { label: "Orders", path: "/orders", icon: ClipboardList },
  { label: "Payments", path: "/payments", icon: CircleDollarSign },
  { label: "Activity", path: "/activity", icon: Activity },
];

export default function Sidebar({
  collapsed,
  onToggle,
  onNavigate,
  mobileMenuOpen,
  onCloseMobile,
}) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-800 bg-slate-950 text-slate-300">
      <div className="flex h-[72px] shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-950/30">
            <BarChart3 size={23} />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-base font-bold tracking-tight text-white">
                MetricFlow
              </p>
              <p className="mt-0.5 truncate text-[9px] font-semibold tracking-[0.16em] text-slate-400">
                BUSINESS INTELLIGENCE
              </p>
            </div>
          )}
        </div>

        {mobileMenuOpen && (
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        )}
      </div>

      <div className="px-4 pb-2 pt-7">
        {!collapsed && (
          <p className="text-[10px] font-bold tracking-[0.18em] text-slate-500">
            WORKSPACE
          </p>
        )}
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 pb-4"
        aria-label="Main navigation"
      >
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            title={collapsed ? label : undefined}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-950/20"
                  : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
              } ${collapsed ? "justify-center px-0" : ""}`
            }
          >
            <Icon size={19} strokeWidth={1.8} className="shrink-0" />

            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        {!collapsed && (
          <div className="mb-3 flex items-start gap-3 rounded-xl bg-white/[0.05] p-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400 ring-4 ring-emerald-400/10" />

            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200">
                Analytics Workspace
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Performance overview
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-xs font-medium text-slate-400 transition hover:bg-white/[0.07] hover:text-white ${
            collapsed ? "justify-center px-0" : ""
          }`}
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={18}
            className={`shrink-0 transition-transform duration-200 ${
              collapsed ? "rotate-180" : ""
            }`}
          />

          {!collapsed && <span>Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
