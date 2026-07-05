import { Bell, Search, UserCircle } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-6">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="search"
            placeholder="Search customers and prospects..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

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
