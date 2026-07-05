import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bot,
  Upload,
  Activity,
  Building2,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import ProspectExplorer from "./pages/ProspectExplorer";
import CustomerProfile from "./pages/CustomerProfile";
import AICopilot from "./pages/AICopilot";
import WhatIfAnalysis from "./pages/WhatIfAnalysis";
import UploadCustomers from "./pages/UploadCustomers";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-100">
        <aside className="w-72 bg-slate-950 text-white p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <Building2 />
            </div>
            <div>
              <h1 className="text-xl font-bold">Prospect Assist AI</h1>
              <p className="text-slate-400 text-sm">IDBI Banking Copilot</p>
            </div>
          </div>

          <nav className="space-y-2">
            <SideLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SideLink to="/prospects" icon={<Users size={20} />} label="Prospect Explorer" />
            <SideLink to="/ai-copilot" icon={<Bot size={20} />} label="AI Copilot" />
            <SideLink to="/what-if" icon={<Activity size={20} />} label="What-if Analysis" />
            <SideLink to="/upload" icon={<Upload size={20} />} label="CSV Upload" />
          </nav>

          <div className="mt-10 bg-white/10 rounded-2xl p-4">
            <p className="text-sm text-slate-300">System Status</p>
            <p className="text-green-400 font-semibold mt-1">● AI Engine Active</p>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
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
        `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default App;
