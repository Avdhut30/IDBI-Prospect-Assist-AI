export default function Badge({ children, variant = "blue" }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
