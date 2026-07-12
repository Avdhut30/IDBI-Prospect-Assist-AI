import { useEffect, useState } from "react";
import API from "../api/api";
import MetricCard from "../components/common/MetricCard";
import ChartCard from "../components/common/ChartCard";
import PageHeader from "../components/common/PageHeader";
import StateMessage from "../components/common/StateMessage";
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
  CartesianGrid,
  LabelList,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatPercent } from "../utils/formatters";

const RISK_COLORS = ["#16a34a", "#f59e0b", "#dc2626"];
const BAR_COLOR = "#2563eb";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([API.get("/dashboard"), API.get("/executive-brief")])
      .then(([dashboardRes, briefRes]) => {
        setData(dashboardRes.data);
        setBrief(briefRes.data);
        setError(null);
      })
      .catch(() => {
        setError("Unable to load dashboard insights. Please check backend.");
      });
  }, []);

  if (error) {
    return <StateMessage type="error" title="Dashboard unavailable" message={error} />;
  }

  if (!data || !brief) {
    return (
      <StateMessage
        type="loading"
        title="Loading enterprise dashboard"
        message="Preparing portfolio KPIs, charts, and executive brief."
      />
    );
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

  const cityChartHeight = Math.max(360, cityData.length * 42);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="AI-powered overview of customer lending opportunities."
      />

      <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-8 text-white shadow-xl shadow-blue-950/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-blue-200">
              <Sparkles size={20} />
              <span>AI Executive Brief</span>
            </div>

            <h2 className="mb-3 text-3xl font-bold">{brief.greeting} 👋</h2>
            <p className="max-w-3xl leading-relaxed text-blue-100">
              {brief.brief}
            </p>
            {brief.generated_time && (
              <p className="mt-4 text-sm text-blue-200">
                Generated at {brief.generated_time}
              </p>
            )}
          </div>

          <div className="min-w-[250px] rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-blue-200">Business Opportunity</p>
            <h3 className="mt-2 text-4xl font-bold">
              ₹{brief.estimated_business_opportunity_cr} Cr
            </h3>
            <p className="mt-2 text-blue-200">Projected portfolio opportunity</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <BriefCard title="High Priority" value={brief.high_priority_prospects} />
          <BriefCard title="Top City" value={brief.top_city} />
          <BriefCard title="Top Product" value={brief.top_product} />
          <BriefCard title="Immediate Follow-ups" value={brief.immediate_followups} />
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-4">
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
          trend={formatPercent(12.4)}
        />
        <MetricCard
          title="High Risk Customers"
          value={data.high_risk_customers}
          icon={<AlertTriangle />}
          trend={formatPercent(3.1)}
        />
        <MetricCard
          title="Average Income"
          value={formatCurrency(data.average_income)}
          icon={<IndianRupee />}
          trend={formatPercent(5.7)}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Loan Product Distribution"
          subtitle="Distribution of recommended loan products."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={loanData}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "#eff6ff" }} />
              <Bar dataKey="value" fill={BAR_COLOR} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Risk Distribution"
          subtitle="Portfolio risk segmentation across all customers."
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                nameKey="name"
                outerRadius={105}
                label
              >
                {riskData.map((_, index) => (
                  <Cell key={index} fill={RISK_COLORS[index % RISK_COLORS.length]} />
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
          <ResponsiveContainer width="100%" height={cityChartHeight}>
            <BarChart
              data={cityData}
              layout="vertical"
              margin={{ top: 4, right: 48, bottom: 4, left: 8 }}
              barCategoryGap="24%"
            >
              <CartesianGrid horizontal={false} stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                interval={0}
                width={92}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#334155", fontSize: 13, fontWeight: 600 }}
              />
              <Tooltip cursor={{ fill: "#eff6ff" }} />
              <Bar dataKey="prospects" fill={BAR_COLOR} radius={[0, 8, 8, 0]}>
                <LabelList
                  dataKey="prospects"
                  position="right"
                  fill="#475569"
                  fontSize={12}
                  fontWeight={600}
                />
              </Bar>
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
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className="text-sm text-blue-200">{title}</p>
      <h3 className="mt-1 text-2xl font-bold">{value}</h3>
    </div>
  );
}
