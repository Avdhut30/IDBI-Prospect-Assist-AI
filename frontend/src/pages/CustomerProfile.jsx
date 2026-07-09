import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API, { API_BASE_URL } from "../api/api";
import StatusBadge from "../components/common/StatusBadge";
import StateMessage from "../components/common/StateMessage";
import CrossSellCard from "../components/customer/CrossSellCard";
import {
  Activity,
  Briefcase,
  FileDown,
  IndianRupee,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatNumber } from "../utils/formatters";

export default function CustomerProfile() {
  const { customerId } = useParams();

  const [profile, setProfile] = useState(null);
  const [intel, setIntel] = useState(null);
  const [rec, setRec] = useState(null);
  const [explain, setExplain] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      API.get(`/customers/${customerId}`),
      API.get(`/customers/${customerId}/intelligence`),
      API.get(`/customers/${customerId}/recommendation`),
      API.get(`/customers/${customerId}/explanation`),
      API.get(`/customers/${customerId}/timeline`),
    ])
      .then(([profileRes, intelRes, recRes, explainRes, timelineRes]) => {
        setProfile(profileRes.data);
        setIntel(intelRes.data);
        setRec(recRes.data);
        setExplain(explainRes.data);
        setTimeline(timelineRes.data.timeline);
      })
      .catch(() => {
        setError("Unable to load customer intelligence. Please try again.");
      });
  }, [customerId]);

  if (error) {
    return <StateMessage type="error" title="Customer 360 error" message={error} />;
  }

  if (!profile || !intel || !rec || !explain || !timeline) {
    return (
      <StateMessage
        type="loading"
        title="Loading customer intelligence"
        message="Fetching profile, recommendation, explanation, and timeline."
      />
    );
  }

  const customer = profile.customer;
  const score =
    profile.prediction?.lead_score ??
    customer.prospect_score ??
    intel.overall_prospect_score;
  const riskLevel = profile.prediction?.risk_level ?? intel.risk_level;
  const recommendedProduct =
    profile.prediction?.recommended_loan ??
    customer.recommended_loan ??
    rec.recommended_product;
  const reportUrl = `${API_BASE_URL}/customers/${customer.customer_id}/report`;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Customer 360°</h1>
        <p className="mt-1 text-slate-600">
          AI-powered prospect intelligence and lending recommendation.
        </p>
      </div>

      <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-7 text-white shadow-xl shadow-blue-950/10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="md:flex-1">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <UserRound size={38} />
              </div>
              <div>
                <p className="mb-1 text-blue-200">Customer ID</p>
                <h2 className="text-4xl font-bold">{customer.customer_id}</h2>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-blue-100">
              <span className="flex items-center gap-2">
                <MapPin size={18} /> {customer.city}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase size={18} /> {customer.employment_type}
              </span>
              <span className="flex items-center gap-2">
                <IndianRupee size={18} /> {formatCurrency(customer.monthly_income)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-4 sm:flex-row">
            <div className="min-w-[180px] rounded-2xl border border-white/10 bg-white/10 p-5 text-center">
              <p className="text-blue-200">Prospect Score</p>
              <h3 className="mt-2 text-5xl font-bold">{formatNumber(score)}</h3>
              <p className="mt-2">{intel.prospect_category}</p>
            </div>

            <div className="flex flex-col justify-center gap-3">
              <a
                href={reportUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
              >
                <FileDown size={18} />
                Export PDF Report
              </a>

              <Link
                to={`/what-if?customerId=${encodeURIComponent(customer.customer_id)}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20"
              >
                <Activity size={18} />
                Run What-if
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <TopCard
          title="Recommended Product"
          value={<StatusBadge type="product" value={recommendedProduct} />}
        />
        <TopCard
          title="Priority"
          value={<StatusBadge type="priority" value={rec.priority} />}
        />
        <TopCard
          title="Risk Level"
          value={<StatusBadge type="risk" value={riskLevel} />}
        />
        <TopCard title="CIBIL Score" value={customer.cibil_score} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-2xl font-bold">AI Recommendation Summary</h2>

          <p className="mb-4 leading-relaxed text-slate-700">{explain.summary}</p>

          <p className="mb-5 leading-relaxed text-slate-700">
            {explain.relationship_manager_note}
          </p>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="mb-2 font-bold text-blue-900">Recommended Action</h3>
            <p className="text-blue-800">{explain.recommended_action}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">Customer Snapshot</h2>
          <Info label="Account Type" value={customer.account_type} />
          <Info label="Monthly Income" value={formatCurrency(customer.monthly_income)} />
          <Info
            label="Avg Balance"
            value={formatCurrency(customer.avg_monthly_balance)}
          />
          <Info label="Existing EMI" value={formatCurrency(customer.existing_emi)} />
          <Info label="FOIR" value={formatNumber(customer.foir)} />
          <Info label="Savings Ratio" value={formatNumber(customer.savings_ratio)} />
          <Info label="Digital Score" value={customer.digital_activity_score} />
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold">Score Breakdown</h2>

        <div className="space-y-4">
          {Object.entries(intel.score_breakdown).map(([key, value]) => (
            <ProgressRow
              key={key}
              label={key.replaceAll("_", " ")}
              value={value}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold">Financial Timeline</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeline}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={3} />
            <Line type="monotone" dataKey="balance" stroke="#16a34a" strokeWidth={3} />
            <Line type="monotone" dataKey="savings" stroke="#f59e0b" strokeWidth={3} />
            <Line type="monotone" dataKey="emi" stroke="#dc2626" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <CrossSellCard customer={customer} />

      <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold">Why This Customer?</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {explain.key_reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4"
            >
              <ShieldCheck className="text-green-600" size={22} />
              <span className="text-slate-700">{reason}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TopCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-2 text-2xl font-bold">{value}</h2>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b py-3 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

function ProgressRow({ label, value }) {
  const width = Math.min(Number(value) * 5, 100);

  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="capitalize text-slate-600">{label}</span>
        <span className="font-bold">{formatNumber(value)}</span>
      </div>

      <div className="h-3 w-full rounded-full bg-slate-200">
        <div
          className="h-3 rounded-full bg-blue-600"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
