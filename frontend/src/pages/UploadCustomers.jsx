import { useState } from "react";
import API from "../api/api";
import PageHeader from "../components/common/PageHeader";
import { AlertCircle, CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";

export default function UploadCustomers() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function uploadFile() {
    if (!file) {
      setError("Please select a CSV file first.");
      setResult(null);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);

    try {
      const res = await API.post("/upload-customers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch {
      setResult({
        success: false,
        message: "Upload failed. Please check backend.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <PageHeader
        title="CSV Upload"
        subtitle="Upload, validate, score, and activate customer banking data."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm xl:col-span-2">
          <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-10 text-center transition hover:border-blue-400 hover:bg-blue-50">
            <Upload className="mx-auto mb-4 text-blue-600" size={42} />

            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setError(null);
              }}
              className="sr-only"
            />

            <h2 className="text-xl font-bold text-slate-900">
              Choose customer CSV
            </h2>
            <p className="mt-2 text-slate-500">
              The file will be validated, scored, and used across Dashboard,
              Explorer, Customer 360°, and AI Copilot.
            </p>

            {file && (
              <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-medium text-slate-700 shadow-sm">
                <FileSpreadsheet className="text-green-600" size={20} />
                {file.name}
              </div>
            )}
          </label>

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <button
            onClick={uploadFile}
            disabled={loading}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Scoring customers..." : "Upload, Score & Activate"}
          </button>

          {result && (
            <UploadResult result={result} />
          )}
        </div>

        <aside className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Required CSV Fields</h2>
          <p className="mt-2 text-sm text-slate-500">
            Keep these core columns present for successful validation.
          </p>

          <div className="mt-5 space-y-3 text-sm text-slate-700">
            {[
              "customer_id",
              "city",
              "monthly_income",
              "monthly_expense",
              "existing_emi",
              "foir",
              "savings_ratio",
              "cibil_score",
              "salary_consistency",
              "digital_activity_score",
              "loan_history",
            ].map((column) => (
              <div
                key={column}
                className="rounded-xl bg-slate-50 px-3 py-2 font-medium"
              >
                {column}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function UploadResult({ result }) {
  const isSuccess = result.success;

  return (
    <div
      className={`mt-6 rounded-2xl border p-5 ${
        isSuccess
          ? "border-green-100 bg-green-50 text-green-800"
          : "border-red-100 bg-red-50 text-red-800"
      }`}
    >
      <div className="flex items-start gap-3">
        {isSuccess ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
        <div>
          <h2 className="text-lg font-bold">{result.message}</h2>

          {result.rows_uploaded && (
            <p className="mt-2">Rows uploaded: {result.rows_uploaded}</p>
          )}

          {isSuccess && (
            <div className="mt-3 space-y-1">
              <p>Prospects identified: {result.prospects_identified}</p>
              <p>High-priority prospects: {result.high_priority_prospects}</p>
              <p className="font-semibold">
                This dataset is now active across the application.
              </p>
            </div>
          )}

          {result.missing_columns && (
            <div className="mt-3">
              <p className="font-semibold">Missing columns:</p>
              <ul className="ml-6 list-disc">
                {result.missing_columns.map((col) => (
                  <li key={col}>{col}</li>
                ))}
              </ul>
            </div>
          )}

          {result.detail && <p className="mt-2 text-sm">{result.detail}</p>}
        </div>
      </div>
    </div>
  );
}
