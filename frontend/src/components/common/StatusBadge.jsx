export default function StatusBadge({ type = "default", value }) {
  const normalized = String(value || "").toLowerCase();

  let style = "bg-slate-100 text-slate-700";

  if (type === "risk") {
    if (normalized.includes("low")) style = "bg-green-50 text-green-700";
    else if (normalized.includes("medium")) style = "bg-yellow-50 text-yellow-700";
    else if (normalized.includes("high")) style = "bg-red-50 text-red-700";
  }

  if (type === "priority") {
    if (normalized.includes("high")) style = "bg-blue-50 text-blue-700";
    else if (normalized.includes("medium")) style = "bg-yellow-50 text-yellow-700";
    else if (normalized.includes("low")) style = "bg-slate-100 text-slate-700";
  }

  if (type === "product") {
    style = "bg-indigo-50 text-indigo-700";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${style}`}>
      {value}
    </span>
  );
}
