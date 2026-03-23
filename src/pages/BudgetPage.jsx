import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import AddTransactionModal from "../components/AddTransactionModal";
// import { budgets, stats } from "../data/dummyData";

const shimmerStyle = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function BudgetPage({ navigate, setTab }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const styleEl = document.getElementById("shimmer-style-budget") || (() => {
    const style = document.createElement("style");
    style.id = "shimmer-style-budget";
    style.innerHTML = shimmerStyle;
    document.head.appendChild(style);
    return style;
  })();

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/budgets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aurelius_token")}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setBudgets(data.budgets || []);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch budgets", err);
      toast.error("Failed to load budgets");
      setLoading(false);
    }
  };

  const handleAddBudget = async () => {
    if (!category || !amount) return;

    try {
      await fetch(`${API}/api/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("aurelius_token")}`,
        },
        body: JSON.stringify({
          category,
          amount: Number(amount),
        }),
      });

      toast.success("Budget added successfully 💰");
      setShowBudgetModal(false);
      setCategory("");
      setAmount("");
      fetchBudgets();
    } catch (err) {
      console.error("Failed to add budget", err);
      toast.error("Failed to add budget");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white md:ml-64 px-4 md:px-8 py-6 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Header skeleton */}
        <div className="h-6 w-40 bg-white/[0.05] rounded-xl" />

        {/* Card skeleton */}
        <div className="h-32 rounded-3xl bg-white/[0.05] border border-white/10" />

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 rounded-2xl bg-white/[0.05] border border-white/10" />
          ))}
        </div>

        {/* Budget cards skeleton */}
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 rounded-3xl bg-white/[0.05] border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  const totalBudget = budgets.reduce((a, b) => a + (b?.amount || 0), 0);
  const totalSpent = budgets.reduce((a, b) => a + (b?.spent || 0), 0);
  const overall = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-[400px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full -top-20 -left-20" />
          <div className="absolute w-[300px] h-[300px] bg-emerald-400/20 blur-[120px] rounded-full bottom-0 right-0" />
        </div>
        <Sidebar active="budget" setTab={setTab} navigate={navigate} />

        <motion.main
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="md:ml-64 px-4 md:px-8 py-6 pb-28 md:pb-12"
        >
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-white text-2xl font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Budget
            </h1>
            <p className="text-white/30 text-sm mt-0.5">March 2025 · Monthly overview</p>
          </motion.div>

          {/* Overall Budget Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-6 mb-6 shadow-[0_0_40px_rgba(139,92,246,0.2)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-violet-300/60 text-xs uppercase tracking-widest">Overall Budget</p>
                <p className="text-white text-2xl font-semibold mt-1">₹{fmt(totalSpent)}</p>
                <p className="text-white/30 text-sm mt-0.5">of ₹{fmt(totalBudget)} spent</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs uppercase tracking-widest">Remaining</p>
                <p className="text-emerald-400 text-xl font-semibold mt-1">₹{fmt(totalBudget - totalSpent)}</p>
              </div>
            </div>

            {/* Overall progress */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overall}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-white/30 text-xs">{overall}% used</span>
              <span className="text-white/30 text-xs">{100 - overall}% left</span>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "On Track", value: budgets.filter(b => (b.amount > 0 ? b.spent / b.amount : 0) < 0.8).length, icon: "✓", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { label: "Near Limit", value: budgets.filter(b => {
                const r = (b.amount > 0 ? b.spent / b.amount : 0);
                return r >= 0.8 && r < 1;
              }).length, icon: "⚠", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              { label: "Over Budget", value: budgets.filter(b => (b.amount > 0 ? b.spent / b.amount : 0) >= 1).length, icon: "✕", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className={`backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-2xl p-3 text-center hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(139,92,246,0.12)]`}
              >
                <p className={`${s.color} text-2xl font-bold`}>{s.value}</p>
                <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Budget Cards */}
          <div className="space-y-3">
            {budgets.map((b, i) => {
              const pct = b.amount > 0 ? Math.round((b.spent / b.amount) * 100) : 0;
              const over = pct >= 100;
              const warn = pct >= 80 && !over;
              const barColor = over ? "#ef4444" : warn ? "#f59e0b" : b.color;

              return (
                <motion.div
                  key={b._id || b.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  whileHover={{ y: -3, scale: 1.02, rotateX: 2, rotateY: -2 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -100) {
                      // swipe left = delete
                      fetch(`${API}/api/budgets/${b._id}`, {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("aurelius_token")}`,
                        },
                      })
                        .then(() => {
                          toast.success("Budget deleted 🗑️");
                          fetchBudgets();
                        })
                        .catch(() => toast.error("Delete failed"));
                    }
                  }}
                  className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-5 cursor-pointer hover:bg-white/[0.06] hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(139,92,246,0.12)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${b.color}18` }}>
                      {b.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white text-sm font-medium">{b.category}</p>
                        <div className="text-right">
                          {over && <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 mr-2">Over Budget</span>}
                          {warn && <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 mr-2">Near Limit</span>}
                          <span className="text-white/60 text-sm font-medium">₹{fmt(b.spent)}</span>
                          <span className="text-white/20 text-sm"> / ₹{fmt(b.amount)}</span>
                        </div>
                      </div>

                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mt-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ delay: 0.3 + i * 0.06, duration: 0.9, ease: "easeInOut" }}
                          className="h-full rounded-full"
                          style={{ background: barColor }}
                        />
                      </div>

                      <div className="flex justify-between mt-2">
                        <span className="text-white/20 text-[11px]">{pct}% used</span>
                        <span className={`text-[11px] ${over ? "text-red-400/60" : "text-white/20"}`}>
                          {over ? `₹${fmt(b.spent - b.amount)} over` : `₹${fmt(b.amount - b.spent)} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Add Budget Button */}
          <motion.button
            onClick={() => setShowBudgetModal(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileTap={{ scale: 0.96 }}
            className="w-full mt-4 backdrop-blur-xl bg-white/[0.04] border border-dashed border-white/10 rounded-3xl py-4 text-white/40 text-sm hover:bg-white/[0.08] hover:text-white/70 hover:border-white/20 transition-all shadow-[0_0_20px_rgba(139,92,246,0.15)]"
          >
            + Add new budget category
          </motion.button>
        {/* Add Budget Modal */}
        {showBudgetModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBudgetModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#020617]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 w-[340px] shadow-[0_0_60px_rgba(139,92,246,0.35)]"
            >
              <h2 className="text-white text-xl font-semibold">Add Budget</h2>
              <p className="text-white/40 text-xs mb-5">Create a new category limit</p>

              <input
                placeholder="Category"
                className="w-full mb-3 px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <input
                type="number"
                placeholder="Amount"
                className="w-full mb-5 px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBudgetModal(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBudget}
                  className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-medium shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-[1.03] active:scale-[0.97] transition-all"
                >
                  Add Budget
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </motion.main>

        <motion.button
          onClick={() => setModalOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed right-6 bottom-24 md:bottom-8 z-40 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white text-3xl shadow-[0_0_60px_rgba(139,92,246,0.7)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          +
        </motion.button>

        <AddTransactionModal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onSuccess={fetchBudgets}
        />
      </div>
    </motion.div>
  );
}
