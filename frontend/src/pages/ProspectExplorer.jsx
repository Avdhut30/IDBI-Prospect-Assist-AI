import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Banknote, Star } from "lucide-react";
import API from "../api/api";

export default function ProspectExplorer() {
  const [prospects, setProspects] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [loanType, setLoanType] = useState("All");
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    API.get("/top-prospects?limit=200").then((res) => setProspects(res.data));
  }, []);

  const cities = ["All", ...new Set(prospects.map((p) => p.city))];
  const loanTypes = ["All", ...new Set(prospects.map((p) => p.recommended_loan))];

  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      return (
        p.customer_id.toLowerCase().includes(search.toLowerCase()) &&
        (city === "All" || p.city === city) &&
        (loanType === "All" || p.recommended_loan === loanType) &&
        Number(p.prospect_score || 0) >= Number(minScore)
      );
    });
  }, [prospects, search, city, loanType, minScore]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Prospect Explorer</h1>
        <p className="text-slate-600 mt-1">
          Discover, filter, and prioritize high-value loan prospects.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              className="w-full border rounded-xl pl-10 p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search Customer ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
          >
            {loanTypes.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <input
            type="number"
            className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Minimum Score"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 text-slate-700">
        Showing <b>{filteredProspects.length}</b> prospects
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredProspects.map((customer) => (
          <div
            key={customer.customer_id}
            className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {customer.customer_id}
                </h2>
                <p className="flex items-center gap-1 text-slate-500 mt-1">
                  <MapPin size={16} /> {customer.city}
                </p>
              </div>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                High Potential
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Metric label="Income" value={`₹${customer.monthly_income}`} />
              <Metric label="CIBIL" value={customer.cibil_score} />
              <Metric label="Score" value={customer.prospect_score} />
              <Metric label="Loan" value={customer.recommended_loan} />
            </div>

            <div className="flex items-center gap-2 mb-4 text-yellow-500">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} />
              <span className="text-slate-600 ml-2">Priority Prospect</span>
            </div>

            <Link
              to={`/customers/${customer.customer_id}`}
              className="block text-center bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700"
            >
              View 360° Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-slate-500 text-sm">{label}</p>
      <h3 className="font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  );
}