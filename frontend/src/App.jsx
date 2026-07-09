import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import {
  Activity,
  Bot,
  Building2,
  LayoutDashboard,
  Upload,
  Users,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import ProspectExplorer from "./pages/ProspectExplorer";
import CustomerProfile from "./pages/CustomerProfile";
import AICopilot from "./pages/AICopilot";
import WhatIfAnalysis from "./pages/WhatIfAnalysis";
import UploadCustomers from "./pages/UploadCustomers";
import TopBar from "./components/layout/TopBar";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-100">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20 lg:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-600 p-3 shadow-lg shadow-blue-900/30">
              <Building2 />
            </div>
            <div>
              <h1 className="text-xl font-bold">Prospect Assist AI</h1>
              <p className="text-sm text-slate-400">IDBI Banking Copilot</p>
            </div>
          </div>

          <nav className="space-y-2">
            <SideLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SideLink
              to="/prospects"
              icon={<Users size={20} />}
              label="Prospect Explorer"
            />
            <SideLink
              to="/ai-copilot"
              icon={<Bot size={20} />}
              label="AI Copilot"
            />
            <SideLink
              to="/what-if"
              icon={<Activity size={20} />}
              label="What-if Analysis"
            />
            <SideLink to="/upload" icon={<Upload size={20} />} label="CSV Upload" />
          </nav>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-slate-300">System Status</p>
            <p className="mt-1 font-semibold text-green-400">● AI Engine Active</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <TopBar />

          <nav className="sticky top-[73px] z-10 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <MobileLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <MobileLink to="/prospects" icon={<Users size={18} />} label="Prospects" />
            <MobileLink to="/ai-copilot" icon={<Bot size={18} />} label="Copilot" />
            <MobileLink to="/what-if" icon={<Activity size={18} />} label="What-if" />
            <MobileLink to="/upload" icon={<Upload size={18} />} label="Upload" />
          </nav>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prospects" element={<ProspectExplorer />} />
            <Route path="/customers/:customerId" element={<CustomerProfile />} />
            <Route path="/ai-copilot" element={<AICopilot />} />
            <Route path="/what-if" element={<WhatIfAnalysis />} />
            <Route path="/upload" element={<UploadCustomers />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function SideLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function MobileLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

export default App;
