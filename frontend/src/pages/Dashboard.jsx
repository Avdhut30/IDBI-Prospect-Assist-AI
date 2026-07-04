import { useEffect, useState } from "react";
import {
  AlertTriangle,
  IndianRupee,
  Target,
  Users,
} from "lucide-react";
import API from "../api/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/dashboard")
      .then((response) => setData(response.data))
      .catch(() => setError("Unable to load dashboard data."));
  }, []);

  if (error) {
    return <div className="p-6 text-red-700">{error}</div>;
  }

  if (!data) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="mb-2 text-3xl font-bold">Prospect Assist AI</h1>
      <p className="mb-6 text-slate-600">AI Relationship Manager Copilot</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card
          title="Total Customers"
          value={data.total_customers}
          icon={<Users />}
        />
        <Card
          title="Total Prospects"
          value={data.total_prospects}
          icon={<Target />}
        />
        <Card
          title="High Risk Customers"
          value={data.high_risk_customers}
          icon={<AlertTriangle />}
        />
        <Card
          title="Avg Income"
          value={`₹${Number(data.average_income).toLocaleString("en-IN")}`}
          icon={<IndianRupee />}
        />
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-2 text-2xl font-bold">{value}</h2>
        </div>
        <div className="text-blue-600">{icon}</div>
      </div>
    </div>
  );
}
