export default function MetricCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">{value}</h2>
          {trend && <p className="text-green-600 text-sm mt-2">▲ {trend}</p>}
        </div>

        <div className="bg-blue-50 text-blue-700 p-3 rounded-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
