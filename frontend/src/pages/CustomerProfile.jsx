import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import {
  ShieldCheck,
  AlertTriangle,
  BadgeCheck,
  User,
  MapPin,
  Briefcase,
  IndianRupee,
} from "lucide-react";

export default function CustomerProfile() {
  const { customerId } = useParams();

  const [profile, setProfile] = useState(null);
  const [intel, setIntel] = useState(null);
  const [rec, setRec] = useState(null);
  const [explain, setExplain] = useState(null);

  useEffect(() => {
    API.get(`/customers/${customerId}`).then((res) => setProfile(res.data));
    API.get(`/customers/${customerId}/intelligence`).then((res) => setIntel(res.data));
    API.get(`/customers/${customerId}/recommendation`).then((res) => setRec(res.data));
    API.get(`/customers/${customerId}/explanation`).then((res) => setExplain(res.data));
  }, [customerId]);

  if (!profile || !intel || !rec || !explain) {
    return <div className="p-6">Loading customer intelligence...</div>;
  }

  const customer = profile.customer;
  const score = intel.overall_prospect_score;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Customer 360°</h1>
        <p className="text-slate-600 mt-1">
          AI-powered prospect intelligence and lending recommendation.
        </p>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-3xl p-7 shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-blue-200 mb-2">Customer ID</p>
            <h2 className="text-4xl font-bold">{customer.customer_id}</h2>
            <div className="flex flex-wrap gap-4 mt-4 text-blue-100">
              <span className="flex items-center gap-2">
                <MapPin size={18} /> {customer.city}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase size={18} /> {customer.employment_type}
              </span>
              <span className="flex items-center gap-2">
                <IndianRupee size={18} /> ₹{customer.monthly_income}
              </span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 text-center min-w-[180px]">
            <p className="text-blue-200">Prospect Score</p>
            <h3 className="text-5xl font-bold mt-2">{score}</h3>
            <p className="mt-2">{intel.prospect_category}</p>
          </div>

          <a
            href={`http://127.0.0.1:8000/customers/${customer.customer_id}/report`}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-blue-900 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50"
          >
            Export PDF Report
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <TopCard title="Recommended Product" value={rec.recommended_product} />
        <TopCard title="Priority" value={rec.priority} />
        <TopCard title="Risk Level" value={intel.risk_level} />
        <TopCard title="CIBIL Score" value={customer.cibil_score} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white rounded-3xl shadow p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">AI Recommendation Summary</h2>

          <p className="text-slate-700 leading-relaxed mb-4">
            {explain.summary}
          </p>

          <p className="text-slate-700 leading-relaxed mb-5">
            {explain.relationship_manager_note}
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h3 className="font-bold text-blue-900 mb-2">Recommended Action</h3>
            <p className="text-blue-800">{explain.recommended_action}</p>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Customer Snapshot</h2>
          <Info label="Account Type" value={customer.account_type} />
          <Info label="Monthly Income" value={`₹${customer.monthly_income}`} />
          <Info label="Avg Balance" value={`₹${customer.avg_monthly_balance}`} />
          <Info label="Existing EMI" value={`₹${customer.existing_emi}`} />
          <Info label="FOIR" value={customer.foir} />
          <Info label="Savings Ratio" value={customer.savings_ratio} />
          <Info label="Digital Score" value={customer.digital_activity_score} />
        </section>
      </div>

      <section className="bg-white rounded-3xl shadow p-6 mt-6">
        <h2 className="text-2xl font-bold mb-5">Score Breakdown</h2>

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

      <section className="bg-white rounded-3xl shadow p-6 mt-6">
        <h2 className="text-2xl font-bold mb-5">Why This Customer?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {explain.key_reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4"
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
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-slate-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b py-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function ProgressRow({ label, value }) {
  const width = Math.min(Number(value) * 5, 100);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="capitalize text-slate-600">{label}</span>
        <span className="font-bold">{value}</span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
}
