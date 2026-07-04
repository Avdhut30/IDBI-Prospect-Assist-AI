import { useEffect, useState } from "react";
import API from "../api/api";

export default function ProspectExplorer() {
  const [prospects, setProspects] = useState([]);

  useEffect(() => {
    API.get("/top-prospects?limit=50").then((res) => setProspects(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-2">Prospect Explorer</h1>
      <p className="text-slate-600 mb-6">
        High-potential loan prospects ranked for relationship managers.
      </p>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-4">Customer ID</th>
              <th className="p-4">City</th>
              <th className="p-4">Income</th>
              <th className="p-4">CIBIL</th>
              <th className="p-4">FOIR</th>
              <th className="p-4">Recommended Loan</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {prospects.map((customer) => (
              <tr key={customer.customer_id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-semibold">{customer.customer_id}</td>
                <td className="p-4">{customer.city}</td>
                <td className="p-4">₹{customer.monthly_income}</td>
                <td className="p-4">{customer.cibil_score}</td>
                <td className="p-4">{customer.foir}</td>
                <td className="p-4">{customer.recommended_loan}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                    High Potential
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}