import { useEffect, useState } from "react";
import API from "../api/api";
import MetricCard from "../components/common/MetricCard";
import ChartCard from "../components/common/ChartCard";
import PageHeader from "../components/common/PageHeader";
import AIInsights from "../components/dashboard/AIInsights";
import {
  Users,
  Target,
  AlertTriangle,
  IndianRupee,
  Sparkles,
} from "lucide-react";
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
  const [brief, setBrief] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then((res) => setData(res.data));
    API.get("/executive-brief").then((res) => setBrief(res.data));
  }, []);

  if (!data || !brief) {
    return <div className="p-6">Loading enterprise dashboard...</div>;
  }

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
      <PageHeader
        title="Executive Dashboard"
        subtitle="AI-powered overview of customer lending opportunities."
      />

      <section className="bg-gradient-to-r from-slate-950 to-blue-950 text-white rounded-3xl p-8 shadow mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-200 mb-3">
              <Sparkles size={20} />
              <span>AI Executive Brief</span>
            </div>

            <h2 className="text-3xl font-bold mb-3">{brief.greeting} 👋</h2>
            <p className="text-blue-100 max-w-3xl leading-relaxed">
              {brief.brief}
            </p>
          </div>

          <div className="bg-white/10 rounded-3xl p-6 min-w-[230px]">
            <p className="text-blue-200 text-sm">Business Opportunity</p>
            <h3 className="text-4xl font-bold mt-2">
              ₹{brief.estimated_business_opportunity_cr} Cr
            </h3>
            <p className="text-blue-200 mt-2">Projected portfolio opportunity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <BriefCard title="High Priority" value={brief.high_priority_prospects} />
          <BriefCard title="Top City" value={brief.top_city} />
          <BriefCard title="Top Product" value={brief.top_product} />
          <BriefCard title="Immediate Follow-ups" value={brief.immediate_followups} />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <MetricCard
          title="Total Customers"
          value={data.total_customers}
          icon={<Users />}
          trend="8.2%"
        />
        <MetricCard
          title="High Potential Prospects"
          value={data.total_prospects}
          icon={<Target />}
          trend="12.4%"
        />
        <MetricCard
          title="High Risk Customers"
          value={data.high_risk_customers}
          icon={<AlertTriangle />}
          trend="3.1%"
        />
        <MetricCard
          title="Average Income"
          value={`₹${data.average_income}`}
          icon={<IndianRupee />}
          trend="5.7%"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Loan Product Distribution"
          subtitle="Distribution of recommended loan products."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={loanData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Risk Distribution"
          subtitle="Portfolio risk segmentation across all customers."
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={riskData} dataKey="value" nameKey="name" outerRadius={105} label>
                {riskData.map((_, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="City-wise Opportunity"
          subtitle="High potential prospects grouped by city."
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={cityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="prospects" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <AIInsights brief={brief} />
      </section>
    </div>
  );
}

function BriefCard({ title, value }) {
  return (
    <div className="bg-white/10 rounded-2xl p-4">
      <p className="text-blue-200 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}
