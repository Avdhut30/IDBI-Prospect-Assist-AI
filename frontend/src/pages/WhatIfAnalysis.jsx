import { useState } from "react";
import API from "../api/api";

export default function WhatIfAnalysis() {
  const [customerId, setCustomerId] = useState("CUST00001");
  const [incomeChange, setIncomeChange] = useState(20000);
  const [emiChange, setEmiChange] = useState(-5000);
  const [result, setResult] = useState(null);

  async function runAnalysis() {
    const res = await API.post("/what-if", {
      customer_id: customerId,
      income_change: Number(incomeChange),
      emi_change: Number(emiChange),
    });
    setResult(res.data);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-2">What-if Analysis</h1>
      <p className="text-slate-600 mb-6">
        Simulate how income or EMI changes affect prospect quality.
      </p>

      <div className="bg-white rounded-3xl shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input className="border rounded-xl p-3" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
        <input className="border rounded-xl p-3" type="number" value={incomeChange} onChange={(e) => setIncomeChange(e.target.value)} />
        <input className="border rounded-xl p-3" type="number" value={emiChange} onChange={(e) => setEmiChange(e.target.value)} />
        <button onClick={runAnalysis} className="bg-blue-600 text-white rounded-xl">
          Run Simulation
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Box title="Current Score" value={result.current.prospect_score} />
          <Box title="Projected Score" value={result.projected.prospect_score} />
          <Box title="Score Change" value={result.impact.score_change} />

          <div className="bg-white rounded-3xl shadow p-6 md:col-span-3">
            <h2 className="text-xl font-bold mb-4">Decision Impact</h2>
            <p className="text-slate-700">{result.impact.decision}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Box({ title, value }) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <p className="text-slate-500">{title}</p>
      <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
  );
}
