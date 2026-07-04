import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function ProspectExplorer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/top-prospects")
      .then((res) => setCustomers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading prospects...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="mb-6 text-3xl font-bold">Prospect Explorer</h1>

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
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
            {customers.map((customer) => (
              <tr
                key={customer.customer_id}
                className="border-t border-slate-200"
              >
                <td className="p-4">{customer.customer_id}</td>
                <td className="p-4">{customer.city}</td>
                <td className="p-4">
                  {Number(customer.monthly_income).toLocaleString("en-IN")}
                </td>
                <td className="p-4">{customer.cibil_score}</td>
                <td className="p-4">{customer.prospect_score}</td>
                <td className="p-4">{customer.recommended_loan}</td>
                <td className="p-4">
                  <Link
                    to={`/customers/${customer.customer_id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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
