import { useState } from "react";
import { Bot, Send, User } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { investigatePayment } from "../services/aiService";

function AIChat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello, I'm PayLens AI. Ask me about payment failures, incidents, banks, or transaction patterns.",
    },
  ]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      console.log("Sending AI investigation:", userMessage);

      const paymentId = userMessage.match(/\bPAY[\w-]+\b/i)?.[0];
      if (!paymentId) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          text: "Enter a payment ID such as PAY1001 and I’ll investigate that transaction.",
        }]);
        return;
      }

      const result = await investigatePayment(paymentId);

      console.log("AI RESPONSE:", result);

      let aiText = "";
      if (result?.root_cause || result?.rootCause) {
        const rootCause = result.root_cause || result.rootCause;
        const riskLevel =
          result.riskLevel ||
          (result.riskScore >= 70
            ? "HIGH"
            : result.riskScore >= 40
            ? "MEDIUM"
            : "LOW");
        const confidence = result.confidence ?? result.riskScore ?? 0;
        const rec = result.recommendation || "No immediate action required.";
        const evidenceStr =
          Array.isArray(result.evidence) && result.evidence.length > 0
            ? `\n\nKey Evidence:\n• ${result.evidence.join("\n• ")}`
            : "";

        aiText = `🔍 Investigation Report for ${result.paymentId || paymentId}:
• Root Cause: ${rootCause}
• Risk Level: ${riskLevel} (Score: ${result.riskScore ?? 0}/100)
• AI Confidence: ${confidence}%${evidenceStr}

💡 Recommendation:
${rec}`;
      } else {
        aiText =
          result?.answer ||
          result?.response ||
          result?.message ||
          result?.recommendation ||
          "AI investigation completed, but no findings were returned.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: aiText,
        },
      ]);
    } catch (error) {
      console.error("AI Investigator error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error.response?.data?.message ||
            "Unable to connect to the AI Investigator backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="pt-18 lg:ml-72">
        <div className="p-8">

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              AI Investigator
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Ask PayLens AI to investigate payment problems.
            </p>
          </div>

          <div className="flex h-[650px] flex-col rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* Messages */}
            <div className="flex-1 space-y-5 overflow-y-auto p-6">

              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    item.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  {/* AI Icon */}
                  {item.role === "assistant" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                      <Bot size={18} />
                    </div>
                  )}

                  {/* Message */}
                  <div
                    className={`max-w-xl rounded-xl px-4 py-3 text-sm leading-6 whitespace-pre-line ${
                      item.role === "user"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.text}
                  </div>

                  {/* User Icon */}
                  {item.role === "user" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Bot size={18} />
                  </div>

                  <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                    PayLens AI is investigating...
                  </div>
                </div>
              )}

            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-4">

              <div className="flex gap-3">

                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                  disabled={loading}
                  placeholder="Enter a payment ID, e.g. PAY1001"
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 disabled:opacity-50"
                />

                <button
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={17} />
                  {loading ? "Analyzing..." : "Send"}
                </button>

              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default AIChat;
