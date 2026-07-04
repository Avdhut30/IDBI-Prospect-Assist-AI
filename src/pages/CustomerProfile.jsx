import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { Star, ShieldCheck, AlertTriangle } from "lucide-react";

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
    return <div className="p-6">Loading customer profile...</div>;
  }

  const customer = profile.customer;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-2">Customer 360° Profile</h1>
      <p className="text-slate-600 mb-6">
        Complete prospect intelligence and recommendation view.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Prospect Score" value={`${intel.overall_prospect_score}/100`} />
        <Card title="Recommended Loan" value={rec.recommended_product} />
        <Card title="Risk Level" value={intel.risk_level} />
        <Card title="Priority" value={rec.priority} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">AI Summary</h2>
          <p className="text-slate-700 leading-relaxed mb-4">{explain.summary}</p>
          <p className="text-slate-700 leading-relaxed mb-4">{explain.relationship_manager_note}</p>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Recommended Action</h3>
            <p className="bg-blue-50 text-blue-800 p-4 rounded-xl">
              {explain.recommended_action}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Customer Details</h2>
          <Info label="Customer ID" value={customer.customer_id} />
          <Info label="City" value={customer.city} />
          <Info label="Employment" value={customer.employment_type} />
          <Info label="Account Type" value={customer.account_type} />
          <Info label="Monthly Income" value={`₹${customer.monthly_income}`} />
          <Info label="CIBIL Score" value={customer.cibil_score} />
          <Info label="FOIR" value={customer.foir} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Score Breakdown</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(intel.score_breakdown).map(([key, value]) => (
            <div key={key} className="border rounded-xl p-4">
              <p className="text-slate-500 capitalize">
                {key.replaceAll("_", " ")}
              </p>
              <h3 className="text-2xl font-bold">{value}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Why This Customer?</h2>

        <div className="space-y-3">
          {explain.key_reasons.map((reason, index) => (
            <div key={index} className="flex items-center gap-3">
              <ShieldCheck className="text-green-600" size={20} />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-slate-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
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