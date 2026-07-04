import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function CustomerProfile() {
  const { customerId } = useParams();
  const [profile, setProfile] = useState(null);
  const [intel, setIntel] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      API.get(`/customers/${customerId}`),
      API.get(`/customers/${customerId}/intelligence`),
      API.get(`/customers/${customerId}/recommendation`),
      API.get(`/customers/${customerId}/explanation`),
    ])
      .then(([profileResponse, intelResponse, recResponse, explainResponse]) => {
        setProfile(profileResponse.data);
        setIntel(intelResponse.data);
        setRecommendation(recResponse.data);
        setExplanation(explainResponse.data);
      })
      .catch(() => setError("Unable to load the customer profile."));
  }, [customerId]);

  if (error) {
    return <div className="p-6 text-red-700">{error}</div>;
  }

  if (!profile || !intel || !recommendation || !explanation) {
    return <div className="p-6">Loading customer profile...</div>;
  }

  const customer = profile.customer;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="mb-2 text-3xl font-bold">Customer 360° Profile</h1>
      <p className="mb-6 text-slate-600">
        Complete prospect intelligence and recommendation view.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card
          title="Prospect Score"
          value={`${intel.overall_prospect_score}/100`}
        />
        <Card
          title="Recommended Loan"
          value={recommendation.recommended_product}
        />
        <Card title="Risk Level" value={intel.risk_level} />
        <Card title="Priority" value={recommendation.priority} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-6 shadow lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold">AI Summary</h2>
          <p className="mb-4 leading-relaxed text-slate-700">
            {explanation.summary}
          </p>
          <p className="mb-4 leading-relaxed text-slate-700">
            {explanation.relationship_manager_note}
          </p>

          <div className="mt-4">
            <h3 className="mb-2 font-semibold">Recommended Action</h3>
            <p className="rounded-xl bg-blue-50 p-4 text-blue-800">
              {explanation.recommended_action}
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Customer Details</h2>
          <Info label="Customer ID" value={customer.customer_id} />
          <Info label="City" value={customer.city} />
          <Info label="Employment" value={customer.employment_type} />
          <Info label="Account Type" value={customer.account_type} />
          <Info
            label="Monthly Income"
            value={`₹${Number(customer.monthly_income).toLocaleString("en-IN")}`}
          />
          <Info label="CIBIL Score" value={customer.cibil_score} />
          <Info label="FOIR" value={customer.foir} />
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Score Breakdown</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(intel.score_breakdown).map(([key, value]) => (
            <div key={key} className="rounded-xl border p-4">
              <p className="capitalize text-slate-500">
                {key.replaceAll("_", " ")}
              </p>
              <h3 className="text-2xl font-bold">{value}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Why This Customer?</h2>
        <div className="space-y-3">
          {explanation.key_reasons.map((reason) => (
            <div key={reason} className="flex items-center gap-3">
              <ShieldCheck className="text-green-600" size={20} />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-2 text-2xl font-bold">{value}</h2>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
