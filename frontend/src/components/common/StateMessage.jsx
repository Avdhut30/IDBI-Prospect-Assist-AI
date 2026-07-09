import { AlertCircle, Inbox, Loader2 } from "lucide-react";

const config = {
  loading: {
    icon: <Loader2 className="animate-spin text-blue-600" size={28} />,
    title: "Loading data",
    className: "border-blue-100 bg-blue-50 text-blue-800",
  },
  error: {
    icon: <AlertCircle className="text-red-600" size={28} />,
    title: "Unable to load data",
    className: "border-red-100 bg-red-50 text-red-800",
  },
  empty: {
    icon: <Inbox className="text-slate-500" size={28} />,
    title: "No data found",
    className: "border-slate-200 bg-white text-slate-700",
  },
};

export default function StateMessage({ type = "loading", title, message }) {
  const state = config[type] || config.loading;

  return (
    <div className="min-h-[320px] p-6">
      <div
        className={`flex max-w-2xl items-start gap-4 rounded-3xl border p-6 shadow-sm ${state.className}`}
      >
        <div className="rounded-2xl bg-white/70 p-3">{state.icon}</div>

        <div>
          <h2 className="text-lg font-bold">{title || state.title}</h2>
          {message && <p className="mt-1 text-sm opacity-85">{message}</p>}
        </div>
      </div>
    </div>
  );
}
