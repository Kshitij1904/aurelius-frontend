import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Food", "Housing", "Shopping", "Entertainment", "Health", "Transport", "Utilities", "Investment", "Income", "Other"];

export default function AddTransactionModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({ title: "", amount: "", type: "debit", category: "Food", date: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("aurelius_token")}`,
        },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          date: form.date || new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add transaction");
      }

      setSuccess(true);

      // trigger UI refresh
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Add transaction error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15),transparent_60%)]"
          />
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:max-w-md"
          >
            <div className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-t-3xl md:rounded-3xl p-6 shadow-[0_0_80px_rgba(139,92,246,0.25)] overflow-hidden">
              <div className="absolute inset-0 -z-10">
                <div className="absolute w-[200px] h-[200px] bg-violet-600/20 blur-[120px] rounded-full -top-10 -left-10" />
                <div className="absolute w-[160px] h-[160px] bg-emerald-400/20 blur-[120px] rounded-full bottom-0 right-0" />
              </div>
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-white/10 mx-auto mb-6 md:hidden" />

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Add Transaction
                </h2>
                <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/[0.06] text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center text-sm">
                  ✕
                </button>
              </div>

              {success ? (
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1.05, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">✓</span>
                  </div>
                  <p className="text-white font-medium">Transaction added!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Type Toggle */}
                  <div className="flex bg-white/[0.05] rounded-2xl p-1 gap-1">
                    {["debit", "credit"].map(t => (
                      <motion.button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, type: t })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          form.type === t
                            ? t === "debit"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "text-white/30 hover:text-white/60"
                        }`}
                        whileTap={{ scale: 0.96 }}
                      >
                        {t === "debit" ? "− Expense" : "+ Income"}
                      </motion.button>
                    ))}
                  </div>

                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-widest mb-1.5 block">Title</label>
                    <input
                      required
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Netflix, Grocery..."
                      className="w-full bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.25)] text-sm"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-white/50 text-xs uppercase tracking-widest mb-1.5 block">Amount (₹)</label>
                      <input
                        required
                        type="number"
                        value={form.amount}
                        onChange={e => setForm({ ...form, amount: e.target.value })}
                        placeholder="0.00"
                        className="w-full bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.25)] text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-white/50 text-xs uppercase tracking-widest mb-1.5 block">Date</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={e => setForm({ ...form, date: e.target.value })}
                        className="w-full bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.25)] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-widest mb-1.5 block">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.25)] text-sm"
                    >
                      {categories.map(c => <option key={c} value={c} className="bg-[#1a1f2e]">{c}</option>)}
                    </select>
                  </div>

                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-500 text-white rounded-2xl py-4 font-medium text-sm shadow-[0_0_30px_rgba(139,92,246,0.5)] mt-2 hover:scale-[1.02] active:scale-[0.97] transition-all"
                  >
                    {loading ? "Adding..." : "Add Transaction"}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
