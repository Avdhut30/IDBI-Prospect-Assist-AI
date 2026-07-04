import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
      const matchesSearch = p.customer_id
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCity = city === "All" || p.city === city;
      const matchesLoan = loanType === "All" || p.recommended_loan === loanType;
      const matchesScore = Number(p.prospect_score || 0) >= Number(minScore);

      return matchesSearch && matchesCity && matchesLoan && matchesScore;
    });
  }, [prospects, search, city, loanType, minScore]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-2">Prospect Explorer</h1>
      <p className="text-slate-600 mb-6">
        Search, filter, and prioritize loan prospects.
      </p>

      <div className="bg-white rounded-2xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search Customer ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl p-3"
        />

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border rounded-xl p-3"
        >
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={loanType}
          onChange={(e) => setLoanType(e.target.value)}
          className="border rounded-xl p-3"
        >
          {loanTypes.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Prospect Score"
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
          className="border rounded-xl p-3"
        />
      </div>

      <div className="mb-4 text-slate-600">
        Showing <b>{filteredProspects.length}</b> prospects
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-4">Customer ID</th>
              <th className="p-4">City</th>
              <th className="p-4">Monthly Income</th>
              <th className="p-4">CIBIL Score</th>
              <th className="p-4">Prospect Score</th>
              <th className="p-4">Recommended Loan</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProspects.map((customer) => (
              <tr key={customer.customer_id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-semibold">{customer.customer_id}</td>
                <td className="p-4">{customer.city}</td>
                <td className="p-4">₹{customer.monthly_income}</td>
                <td className="p-4">{customer.cibil_score}</td>
                <td className="p-4">{customer.prospect_score}</td>
                <td className="p-4">{customer.recommended_loan}</td>
                <td className="p-4">
                  <Link
                    to={`/customers/${customer.customer_id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}