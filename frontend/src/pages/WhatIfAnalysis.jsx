import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";
import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import { formatCurrency, formatNumber } from "../utils/formatters";

export default function WhatIfAnalysis() {
  const [searchParams] = useSearchParams();
  const customerIdFromUrl = searchParams.get("customerId") || "";

  const [customerId, setCustomerId] = useState(customerIdFromUrl);
  const [incomeChange, setIncomeChange] = useState(20000);
  const [emiChange, setEmiChange] = useState(-5000);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerId.trim()) return;

    API.get("/customers?limit=1")
      .then((res) => {
        const firstCustomer = res.data?.[0];

        if (firstCustomer?.customer_id) {
          setCustomerId(firstCustomer.customer_id);
        }
      })
      .catch(() => {
        setError("Unable to load default customer. Please check backend.");
      });
  }, [customerId]);

  async function runAnalysis() {
    const normalizedCustomerId = customerId.trim().toUpperCase();

    if (!normalizedCustomerId) {
      setError("Please enter a valid customer ID.");
      return;
    }

    setCustomerId(normalizedCustomerId);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await API.post("/what-if", {
        customer_id: normalizedCustomerId,
        income_change: Number(incomeChange),
        emi_change: Number(emiChange),
      });

      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to run What-if analysis. Please verify the customer ID."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <PageHeader
        title="What-if Analysis"
        subtitle="Simulate income and EMI changes to understand projected prospect quality."
      />

      <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Field label="Customer ID">
            <input
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Example: CUST10001"
            />
          </Field>

          <Field label="Income Change">
            <input
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="number"
              value={incomeChange}
              onChange={(e) => setIncomeChange(e.target.value)}
            />
          </Field>

          <Field label="EMI Change">
            <input
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="number"
              value={emiChange}
              onChange={(e) => setEmiChange(e.target.value)}
            />
          </Field>

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="self-end rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Running..." : "Run Simulation"}
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ScoreBox title="Current Score" value={result.current.prospect_score} />
          <ScoreBox title="Projected Score" value={result.projected.prospect_score} />
          <ScoreBox
            title="Score Change"
            value={formatChange(result.impact.score_change)}
            positive={Number(result.impact.score_change) >= 0}
          />

          <ComparisonCard title="Current Position" data={result.current} />
          <ComparisonCard title="Projected Position" data={result.projected} />

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Decision Impact</h2>
            <p className="text-slate-700">{result.impact.decision}</p>
            <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">
              Current score uses the same baseline as Dashboard and uploaded CSV
              analysis, then applies the simulated financial impact.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}

function ScoreBox({ title, value, positive }) {
  const colorClass =
    positive === undefined
      ? "text-slate-900"
      : positive
        ? "text-green-700"
        : "text-red-700";

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-slate-500">{title}</p>
      <h2 className={`mt-2 text-4xl font-bold ${colorClass}`}>{value}</h2>
    </div>
  );
}

function ComparisonCard({ title, data }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>

      <Info label="Monthly Income" value={formatCurrency(data.monthly_income)} />
      <Info label="Existing EMI" value={formatCurrency(data.existing_emi)} />
      <Info label="FOIR" value={formatNumber(data.foir)} />
      <Info label="Savings Ratio" value={formatNumber(data.savings_ratio)} />
      <Info
        label="Risk"
        value={<StatusBadge type="risk" value={data.risk_level} />}
      />
      <Info
        label="Recommended Product"
        value={<StatusBadge type="product" value={data.recommended_product} />}
      />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

function formatChange(value) {
  const numericValue = Number(value);

  if (numericValue > 0) return `+${formatNumber(numericValue)}`;
  return formatNumber(numericValue);
}
