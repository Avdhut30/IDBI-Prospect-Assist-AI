import { useEffect, useState } from "react";
import API from "../api/api";
import { Users, Target, AlertTriangle, IndianRupee } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-2">Prospect Assist AI</h1>
      <p className="text-slate-600 mb-6">AI Relationship Manager Copilot</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Customers" value={data.total_customers} icon={<Users />} />
        <Card title="Total Prospects" value={data.total_prospects} icon={<Target />} />
        <Card title="High Risk Customers" value={data.high_risk_customers} icon={<AlertTriangle />} />
        <Card title="Avg Income" value={`₹${data.average_income}`} icon={<IndianRupee />} />
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
        <div className="text-blue-600">{icon}</div>
      </div>
    </div>
  );
}