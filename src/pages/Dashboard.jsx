import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Sidebar from "../components/Sidebar";
import AddTransactionModal from "../components/AddTransactionModal";
import useStats from "../hooks/useStats";
import useTransactions from "../hooks/useTransactions";
import { AuthContext } from "../context/AuthContext";

const shimmerStyle = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

const fmt = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function Dashboard({ navigate, setTab }) {
  const [modalOpen, setModalOpen] = useState(false);

  const { stats, loading: statsLoading } = useStats();
  const { transactions, refetch } = useTransactions();
  const { user, logout } = useContext(AuthContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  const [showMenu, setShowMenu] = useState(false);

useEffect(() => {
  if (!document.getElementById("shimmer-style")) {
    const style = document.createElement("style");
    style.id = "shimmer-style";
    style.innerHTML = shimmerStyle;
    document.head.appendChild(style);
  }
}, []);

  if (statsLoading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white md:ml-64 px-4 md:px-8 py-6 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map((_, i) => (
            <div key={i} className="h-24 rounded-3xl bg-white/[0.05] border border-white/10" />
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-3 h-60 rounded-3xl bg-white/[0.05] border border-white/10" />
          <div className="md:col-span-2 h-60 rounded-3xl bg-white/[0.05] border border-white/10" />
        </div>

        {/* Transactions skeleton */}
        <div className="space-y-3">
          {[1,2,3].map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-white/[0.05] border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  const trendData = Array.isArray(stats?.trend) ? stats.trend : (Array.isArray(stats?.monthlyTrend) ? stats.monthlyTrend : []);
  const categoryData = Array.isArray(stats?.categories) ? stats.categories : (Array.isArray(stats?.categoryBreakdown) ? stats.categoryBreakdown : []);

  const statCards = [
    { label: "Total Balance", value: stats?.totalBalance || 0, icon: "◈", grad: "from-violet-600/30 to-violet-800/10", border: "border-violet-500/20", text: "text-violet-300", indicator: "▲ 12.4%" },
    { label: "Monthly Income", value: stats?.income || 0, icon: "↑", grad: "from-emerald-600/30 to-emerald-800/10", border: "border-emerald-500/20", text: "text-emerald-300", indicator: "▲ 8.1%" },
    { label: "Monthly Expenses", value: stats?.expenses || 0, icon: "↓", grad: "from-red-600/20 to-red-800/10", border: "border-red-500/20", text: "text-red-300", indicator: "▼ 3.2%" },
    { label: "Savings", value: stats?.savings || 0, icon: "◆", grad: "from-blue-600/30 to-blue-800/10", border: "border-blue-500/20", text: "text-blue-300", indicator: "▲ 22%" },
  ];

  const recent = Array.isArray(transactions) ? transactions.slice(0, 5) : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl px-4 py-3 shadow-xl text-xs">
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }} className="font-medium">
              {p.name}: ₹{fmt(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[400px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full -top-20 -left-20" />
        <div className="absolute w-[300px] h-[300px] bg-emerald-400/20 blur-[120px] rounded-full bottom-0 right-0" />
      </div>
      <Sidebar active="dashboard" setTab={setTab} navigate={navigate} />

      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="md:ml-64 px-4 md:px-8 py-6 pb-28 md:pb-12"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-white/30 text-sm">{getGreeting()} 👋</p>
            <h1 className="text-white text-2xl font-semibold mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {user?.name?.split(" ")[0] || "User"}
            </h1>
          </div>
          <div className="flex items-center gap-3 relative">
            <button className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
              🔔
            </button>

            <div
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 cursor-pointer bg-white/[0.05] border border-white/10 px-2 py-1 rounded-xl hover:bg-white/[0.08] transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/80 to-emerald-400/80 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.[0] || "U"}
              </div>
              <span className="text-white/80 text-xs hidden md:block">
                {user?.name?.split(" ")[0]}
              </span>
            </div>

            {showMenu && (
              <div className="absolute right-0 top-12 w-44 bg-[#0f172a] border border-white/10 rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-white text-sm font-medium">{user?.name}</p>
                  <p className="text-white/40 text-xs">{user?.email}</p>
                </div>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.03, rotateX: 2, rotateY: -2 }}
              className={`backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-4 md:p-5 cursor-pointer hover:scale-[1.03] transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.15)]`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`${card.text} text-lg`}>{card.icon}</span>
                <span className={`${card.text} text-[10px] font-medium bg-white/5 px-2 py-0.5 rounded-full`}>
                  {card.indicator}
                </span>
              </div>
              <p className="text-white text-lg md:text-xl font-semibold">
                ₹<CountUp end={Number(card.value) || 0} duration={1.2} separator="," />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3 backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-5 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-semibold text-sm">Monthly Trend</h3>
                <p className="text-white/30 text-xs mt-0.5">Income vs Expenses</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-white/40">
                  <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" /> Income
                </span>
                <span className="flex items-center gap-1.5 text-white/40">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Expenses
                </span>
              </div>
            </div>
            {trendData.length === 0 ? (
              <div className="text-white/40 text-xs">No trend data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={trendData} margin={{ left: -20, right: 5 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="income" stroke="#8b5cf6" strokeWidth={2.5} dot={false} name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-5 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
          >
            <div className="mb-4">
              <h3 className="text-white font-semibold text-sm">By Category</h3>
              <p className="text-white/30 text-xs mt-0.5">Expense breakdown</p>
            </div>
            <div className="flex items-center gap-4">
              {categoryData.length === 0 ? (
                <div className="text-white/40 text-xs">No category data</div>
              ) : (
                <PieChart width={110} height={110}>
                  <Pie data={categoryData} cx={50} cy={50} innerRadius={32} outerRadius={50} dataKey="value" strokeWidth={0}>
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              )}
              <div className="flex flex-col gap-1.5 flex-1">
                {categoryData.slice(0, 5).map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-white/50 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      {d.name}
                    </span>
                    <span className="text-white/70 text-[11px] font-medium">₹{fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-5 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold text-sm">Recent Transactions</h3>
              <p className="text-white/30 text-xs mt-0.5">Last 5 activities</p>
            </div>
            <button
              onClick={() => setTab("transactions")}
              className="text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {Array.isArray(recent) && recent.map((tx, i) => (
              <motion.div
                key={tx._id || tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/[0.08] hover:scale-[1.03] transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${tx?.color || "#8b5cf6"}18` }}>
                  {tx?.icon || "💸"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{tx?.title || "Untitled"}</p>
                  <p className="text-white/30 text-xs mt-0.5">{tx?.category || "General"} · {tx?.date || ""}</p>
                </div>
                <span className={`text-sm font-semibold ${tx.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                  {tx.type === "credit" ? "+" : "−"}₹{fmt(tx?.amount || 0)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.main>

      {/* FAB */}
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
        onSuccess={refetch}
      />
    </div>
  );
}
