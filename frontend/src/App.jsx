import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import AICopilot from "./pages/AICopilot";
import CustomerProfile from "./pages/CustomerProfile";
import Dashboard from "./pages/Dashboard";
import ProspectExplorer from "./pages/ProspectExplorer";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-100">
        <aside className="min-h-screen w-64 shrink-0 bg-slate-900 p-6 text-white">
          <h2 className="mb-8 text-xl font-bold">Prospect Assist AI</h2>

          <nav className="space-y-4">
            <Link className="block hover:text-blue-300" to="/">
              Dashboard
            </Link>
            <Link className="block hover:text-blue-300" to="/prospects">
              Prospect Explorer
            </Link>
            <Link className="block hover:text-blue-300" to="/ai-copilot">
              AI Copilot
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prospects" element={<ProspectExplorer />} />
            <Route path="/ai-copilot" element={<AICopilot />} />
            <Route
              path="/customers/:customerId"
              element={<CustomerProfile />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
