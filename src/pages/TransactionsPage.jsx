import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import AddTransactionModal from "../components/AddTransactionModal";
import useTransactions from "../hooks/useTransactions";

const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const filters = ["All", "Income", "Expense"];
const cats = ["All", "Food", "Housing", "Shopping", "Entertainment", "Health", "Transport", "Investment"];

export default function TransactionsPage({ navigate, setTab }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const { transactions = [], refetch, loading } = useTransactions();
const shimmerStyle = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;
  useEffect(() => {
    if (!document.getElementById("shimmer-style-transactions")) {
      const style = document.createElement("style");
      style.id = "shimmer-style-transactions";
      style.innerHTML = shimmerStyle;
      document.head.appendChild(style);
    }
  }, []);

  const API = import.meta.env.VITE_API_URL;

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aurelius_token")}`,
        },
      });
      refetch();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filtered = transactions.filter(tx => {
    const matchFilter = filter === "All" || (filter === "Income" ? tx.type === "credit" : tx.type === "debit");
    const matchCat = cat === "All" || tx.category === cat;
    const matchSearch = (tx?.title || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchCat && matchSearch;
  });

  const totalIn = filtered.filter(t => t.type === "credit").reduce((a, t) => a + t.amount, 0);
  const totalOut = filtered.filter(t => t.type === "debit").reduce((a, t) => a + t.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white md:ml-64 px-4 md:px-8 py-6 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Header */}
        <div className="h-6 w-40 bg-white/[0.05] rounded-xl" />

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          {[1,2].map(i => (
            <div key={i} className="h-20 rounded-3xl bg-white/[0.05] border border-white/10" />
          ))}
        </div>

        {/* Search */}
        <div className="h-12 rounded-2xl bg-white/[0.05] border border-white/10" />

        {/* Filters */}
        <div className="flex gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-8 w-16 rounded-xl bg-white/[0.05] border border-white/10" />
          ))}
        </div>

        {/* Transactions */}
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-16 rounded-2xl bg-white/[0.05] border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[400px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full -top-20 -left-20" />
        <div className="absolute w-[300px] h-[300px] bg-emerald-400/20 blur-[120px] rounded-full bottom-0 right-0" />
      </div>
      <Sidebar active="transactions" setTab={setTab} navigate={navigate} />

      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="md:ml-64 px-4 md:px-8 py-6 pb-28 md:pb-12"
      >
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-white text-2xl font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Transactions
          </h1>
          <p className="text-white/30 text-sm mt-0.5">All your financial activity</p>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-4 hover:scale-[1.02] transition-all"
          >
            <p className="text-emerald-400/60 text-xs uppercase tracking-widest">Total In</p>
            <p className="text-emerald-400 text-xl font-semibold mt-1">+₹{fmt(totalIn)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-4 hover:scale-[1.02] transition-all"
          >
            <p className="text-red-400/60 text-xs uppercase tracking-widest">Total Out</p>
            <p className="text-red-400 text-xl font-semibold mt-1">−₹{fmt(totalOut)}</p>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.25)] text-sm"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "bg-white/[0.04] text-white/40 border border-white/8 hover:text-white/60"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="w-px bg-white/10 mx-1 self-stretch" />
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                cat === c
                  ? "bg-white/10 text-white border border-white/20"
                  : "bg-white/[0.04] text-white/30 border border-white/8 hover:text-white/50"
              }`}
            >
              {c}
            </button>
          ))}
        </motion.div>

        {/* Transaction List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.15)]"
        >
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-white/20">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm">No transactions found</p>
            </div>
          ) : (
            filtered.map((tx, i) => (
              <motion.div
                key={tx._id || tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className="group flex items-center gap-4 px-5 py-4 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.08] hover:scale-[1.02] transition-all cursor-pointer"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -100) {
                    handleDelete(tx._id || tx.id);
                  }
                }}
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${tx?.color || "#8b5cf6"}15` }}>
                  {tx?.icon || "💸"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{tx?.title || "Untitled"}</p>
                  <p className="text-white/30 text-xs mt-0.5">{tx?.category || "General"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.type === "credit" ? "+" : "−"}₹{fmt(tx?.amount || 0)}
                    </p>
                    <p className="text-white/20 text-xs mt-0.5">{tx?.date || ""}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(tx._id || tx.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-sm transition"
                  >
                    🗑️
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.main>

      <motion.button
        onClick={() => setModalOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-6 bottom-24 md:bottom-8 z-40 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-white text-3xl shadow-[0_0_60px_rgba(139,92,246,0.7)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        +
      </motion.button>

      <AddTransactionModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={refetch}
      />
    </div>
  );
}