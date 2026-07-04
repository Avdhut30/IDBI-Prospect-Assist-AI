import Dashboard from "./pages/Dashboard";

function App() {
  return <Dashboard />;
}

export default App;
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProspectExplorer from "./pages/ProspectExplorer";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
          <h2 className="text-xl font-bold mb-8">Prospect Assist AI</h2>

          <nav className="space-y-4">
            <Link className="block hover:text-blue-300" to="/">
              Dashboard
            </Link>
            <Link className="block hover:text-blue-300" to="/prospects">
              Prospect Explorer
            </Link>
          </nav>
        </aside>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prospects" element={<ProspectExplorer />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;