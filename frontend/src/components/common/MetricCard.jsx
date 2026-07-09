export default function MetricCard({ title, value, icon, trend }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
          {trend && <p className="mt-2 text-sm text-green-600">▲ {trend}</p>}
        </div>

        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">{icon}</div>
      </div>
    </div>
  );
}
