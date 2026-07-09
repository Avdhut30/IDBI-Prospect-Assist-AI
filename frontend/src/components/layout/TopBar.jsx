import { Bell, Search, UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function submitSearch(event) {
    event.preventDefault();

    const normalizedQuery = query.trim().toUpperCase();

    if (!normalizedQuery) return;

    if (/^CUST\d+$/i.test(normalizedQuery)) {
      navigate(`/customers/${normalizedQuery}`);
      setQuery("");
      return;
    }

    navigate(`/prospects?search=${encodeURIComponent(normalizedQuery)}`);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-6">
        <form onSubmit={submitSearch} className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search customers and prospects..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </form>

        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell size={22} />
          </button>

          <div className="flex items-center gap-2">
            <UserCircle className="text-slate-700" size={32} />
            <div className="hidden md:block">
              <p className="font-semibold text-slate-900">Relationship Manager</p>
              <p className="text-xs text-slate-500">IDBI Bank</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
