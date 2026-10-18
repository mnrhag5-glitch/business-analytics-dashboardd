
import { useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-[width,transform] duration-300 ease-in-out lg:translate-x-0 ${
          collapsed ? "w-[76px]" : "w-64"
        } ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          onNavigate={() => setMobileMenuOpen(false)}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      </aside>

      <div
        className={`min-h-screen min-w-0 transition-[padding] duration-300 ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-64"
        }`}
      >
        <div className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <span className="font-bold tracking-tight text-slate-900">
            MetricFlow
          </span>
        </div>

        <Header />

        <main className="mx-auto w-full max-w-[1800px] min-w-0 p-4 sm:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
