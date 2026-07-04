import { useEffect, useState } from "react";
import API from "../api/api";
import { Users, Target, AlertTriangle, IndianRupee } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="p-6">Loading dashboard...</div>;

  const loanData = Object.entries(data.loan_distribution).map(([name, value]) => ({
    name,
    value,
  }));

  const riskData = Object.entries(data.risk_distribution).map(([name, value]) => ({
    name,
    value,
  }));

  const cityData = Object.entries(data.city_distribution).map(([name, value]) => ({
    name,
    prospects: value,
  }));

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-2">Prospect Assist AI</h1>
      <p className="text-slate-600 mb-6">AI Relationship Manager Copilot</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Customers" value={data.total_customers} icon={<Users />} />
        <Card title="Total Prospects" value={data.total_prospects} icon={<Target />} />
        <Card title="High Risk Customers" value={data.high_risk_customers} icon={<AlertTriangle />} />
        <Card title="Avg Income" value={`₹${data.average_income}`} icon={<IndianRupee />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Loan Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={loanData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={riskData} dataKey="value" nameKey="name" outerRadius={100} label>
                {riskData.map((_, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="City-wise Prospect Opportunities">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="prospects" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">AI Executive Insight</h2>
          <p className="text-slate-700 leading-relaxed">
            Based on the current customer portfolio, the system has identified{" "}
            <b>{data.total_prospects}</b> high-potential loan prospects with an
            estimated conversion potential of{" "}
            <b>{data.conversion_potential_percent}%</b>. Relationship managers
            should prioritize low-risk customers with stable salary patterns,
            strong CIBIL scores, and clear loan intent signals.
          </p>
        </div>
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

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}