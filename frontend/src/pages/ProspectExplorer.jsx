import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, MapPin, Search, ShieldCheck, Star } from "lucide-react";
import API from "../api/api";
import PageHeader from "../components/common/PageHeader";
import StateMessage from "../components/common/StateMessage";
import StatusBadge from "../components/common/StatusBadge";
import { formatCurrency, formatNumber } from "../utils/formatters";

export default function ProspectExplorer() {
  const [searchParams] = useSearchParams();
  const [prospects, setProspects] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState("All");
  const [loanType, setLoanType] = useState("All");
  const [minScore, setMinScore] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/top-prospects?limit=200")
      .then((res) => {
        setProspects(res.data);
        setError(null);
      })
      .catch(() => {
        setError("Unable to load prospects. Please check backend connection.");
      })
      .finally(() => setLoading(false));
  }, []);

  const cities = ["All", ...new Set(prospects.map((p) => p.city).sort())];
  const loanTypes = [
    "All",
    ...new Set(prospects.map((p) => p.recommended_loan).sort()),
  ];

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

  if (loading) {
    return (
      <StateMessage
        type="loading"
        title="Loading prospects"
        message="Fetching ranked customers and recommendation signals."
      />
    );
  }

  if (error) {
    return (
      <StateMessage type="error" title="Prospect Explorer error" message={error} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <PageHeader
        title="Prospect Explorer"
        subtitle="Discover, filter, and prioritize high-value loan prospects."
      />

      <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              className="w-full rounded-xl border border-slate-200 p-3 pl-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Search Customer ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
          >
            {loanTypes.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <input
            type="number"
            className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Minimum Score"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-slate-700">
        <p>
          Showing <b>{filteredProspects.length}</b> of <b>{prospects.length}</b>{" "}
          prospects
        </p>
        <p className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          Sorted by prospect quality
        </p>
      </div>

      {filteredProspects.length === 0 && (
        <StateMessage
          type="empty"
          title="No prospects matched"
          message="Try clearing filters or lowering the minimum score."
        />
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredProspects.map((customer) => (
          <div
            key={customer.customer_id}
            className="group rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {customer.customer_id}
                </h2>
                <p className="mt-1 flex items-center gap-1 text-slate-500">
                  <MapPin size={16} /> {customer.city}
                </p>
              </div>

              <StatusBadge type="product" value={customer.recommended_loan} />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <Metric label="Income" value={formatCurrency(customer.monthly_income)} />
              <Metric label="CIBIL" value={customer.cibil_score} />
              <Metric label="Score" value={formatNumber(customer.prospect_score)} />
              <Metric
                label="Savings Ratio"
                value={formatNumber(customer.savings_ratio)}
              />
            </div>

            <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-yellow-500">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-slate-600">
                <ShieldCheck size={16} />
                Priority Prospect
              </span>
            </div>

            <Link
              to={`/customers/${customer.customer_id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              View 360° Profile
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-sm text-slate-500">{label}</p>
      <h3 className="mt-1 truncate font-bold text-slate-900">{value}</h3>
    </div>
  );
}
