import { useState } from "react";
import API from "../api/api";
import { Bot, Send } from "lucide-react";

export default function AICopilot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Who should I contact today?",
    "Explain customer CUST00001",
    "Show top Home Loan prospects",
    "Give dashboard summary",
  ];

  async function askCopilot(q = question) {
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
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
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Please check backend." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        AI Relationship Manager Copilot
      </h1>
      <p className="text-slate-600 mb-6">
        Ask questions about prospects, recommendations, and customer intelligence.
      </p>

      <div className="bg-white rounded-3xl shadow p-6 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-2xl">
            <Bot />
          </div>
          <div>
            <h2 className="text-xl font-bold">Prospect Assist AI</h2>
            <p className="text-slate-500 text-sm">
              Banking decision-support assistant
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => askCopilot(s)}
              className="bg-slate-100 hover:bg-blue-50 border rounded-xl px-4 py-2 text-sm"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="h-[430px] overflow-y-auto bg-slate-50 rounded-2xl p-4 mb-5 space-y-4">
          {messages.length === 0 && (
            <div className="text-slate-500 text-center mt-32">
              Ask me who to contact, why a customer is recommended, or which loan prospects to prioritize.
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl max-w-[80%] whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-white border text-slate-800"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="bg-white border text-slate-500 p-4 rounded-2xl max-w-[80%]">
              AI is thinking...
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askCopilot()}
            placeholder="Ask: Explain customer CUST00001..."
            className="flex-1 border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => askCopilot()}
            className="bg-blue-600 text-white px-6 rounded-2xl hover:bg-blue-700 flex items-center gap-2"
          >
            <Send size={18} />
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
