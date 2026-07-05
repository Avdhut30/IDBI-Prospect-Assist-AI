export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
    </div>
  );
}
