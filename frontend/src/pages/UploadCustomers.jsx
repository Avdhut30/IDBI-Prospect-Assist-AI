import { useState } from "react";
import API from "../api/api";
import { Upload } from "lucide-react";

export default function UploadCustomers() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function uploadFile() {
    if (!file) return alert("Please select a CSV file first.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

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
      <h1 className="text-3xl font-bold mb-2">CSV Upload</h1>
      <p className="text-slate-600 mb-6">
        Upload customer banking data for batch prospect analysis.
      </p>

      <div className="bg-white rounded-3xl shadow p-8 max-w-3xl">
        <div className="border-2 border-dashed rounded-3xl p-10 text-center">
          <Upload className="mx-auto text-blue-600 mb-4" size={42} />

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />

          <p className="text-slate-500">
            Upload CSV with required customer financial fields.
          </p>
        </div>

        <button
          onClick={uploadFile}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Upload & Validate"}
        </button>

        {result && (
          <div
            className={`mt-6 rounded-2xl p-5 ${
              result.success
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <h2 className="font-bold text-lg mb-2">{result.message}</h2>

            {result.rows_uploaded && (
              <p>Rows uploaded: {result.rows_uploaded}</p>
            )}

            {result.missing_columns && (
              <div>
                <p className="font-semibold">Missing columns:</p>
                <ul className="list-disc ml-6">
                  {result.missing_columns.map((col) => (
                    <li key={col}>{col}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
