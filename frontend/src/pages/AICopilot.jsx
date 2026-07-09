import { useEffect, useMemo, useRef, useState } from "react";
import API from "../api/api";
import { Bot, Send, Copy, Trash2 } from "lucide-react";
import PageHeader from "../components/common/PageHeader";

export default function AICopilot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sampleCustomerId, setSampleCustomerId] = useState("CUST10001");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    API.get("/customers?limit=1")
      .then((res) => {
        const firstCustomer = res.data?.[0];

        if (firstCustomer?.customer_id) {
          setSampleCustomerId(firstCustomer.customer_id);
        }
      })
      .catch(() => {
        setSampleCustomerId("CUST10001");
      });
  }, []);

  const suggestions = useMemo(
    () => [
      "Who should I contact today?",
      `Explain customer ${sampleCustomerId}`,
      `What is the CIBIL score of ${sampleCustomerId}?`,
      "Show top 5 Home Loan prospects",
      "How many high-risk customers are there?",
      "Average income by city",
    ],
    [sampleCustomerId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function askCopilot(q = question) {
    if (!q.trim() || loading) return;

    const userMessage = {
      role: "user",
      text: q,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", { question: q });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: res.data.answer,
          intent: res.data.intent,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong. Please check backend connection.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function copyText(text) {
    navigator.clipboard?.writeText(text);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <PageHeader
        title="AI Relationship Manager Copilot"
        subtitle="Ask natural-language questions about any customer or metric in the active dataset."
      />

      <div className="max-w-6xl rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-3 rounded-2xl">
              <Bot />
            </div>
            <div>
              <h2 className="text-xl font-bold">Prospect Assist AI</h2>
              <p className="text-slate-500 text-sm">
                Data-aware banking assistant powered by your active customer CSV
              </p>
            </div>
          </div>

          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 text-slate-700"
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => askCopilot(s)}
              className="bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="h-[470px] overflow-y-auto bg-slate-50 rounded-3xl p-5 mb-5 space-y-5">
          {messages.length === 0 && (
            <div className="mt-36 text-center text-slate-500">
              Ask me about any customer, city, loan product, risk segment, score,
              income, FOIR, or portfolio summary.
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[82%] ${
                msg.role === "user" ? "ml-auto" : ""
              }`}
            >
              <div
                className={`p-4 rounded-2xl whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-800"
                }`}
              >
                {msg.text}
              </div>

              <div
                className={`flex items-center gap-3 mt-2 text-xs text-slate-400 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span>{msg.time}</span>

                {msg.role === "ai" && (
                  <button
                    onClick={() => copyText(msg.text)}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Copy size={13} />
                    Copy
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="bg-white border border-slate-200 text-slate-500 p-4 rounded-2xl max-w-[80%]">
              Prospect Assist AI is analyzing banking data...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askCopilot()}
            placeholder={`Ask: Compare ${sampleCustomerId} with another customer...`}
            className="flex-1 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => askCopilot()}
            disabled={loading || !question.trim()}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
