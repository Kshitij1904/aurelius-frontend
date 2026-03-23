import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// import { user } from "../data/dummyData";

const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "transactions", icon: "↕", label: "Transactions" },
  { id: "budget", icon: "◎", label: "Budget" },
];

export default function Sidebar({ active, setTab, navigate }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen fixed left-0 top-0 z-30 p-6 backdrop-blur-2xl bg-white/[0.03] border-r border-white/10 shadow-[0_0_60px_rgba(139,92,246,0.15)]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-[220px] h-[220px] bg-violet-600/20 blur-[100px] rounded-full -top-10 -left-10" />
          <div className="absolute w-[180px] h-[180px] bg-emerald-400/20 blur-[100px] rounded-full bottom-0 right-0" />
        </div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white font-bold">₹</span>
          </div>
          <span className="text-white text-lg font-semibold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Aurelius
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all relative hover:scale-[1.02] ${
                active === item.id
                  ? "text-white"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
              }`}
            >
              {active === item.id && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_0_30px_rgba(139,92,246,0.25)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="text-base relative z-10">{item.icon}</span>
              {active === item.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
              )}
              <span className="relative z-10">{item.label}</span>
              {active === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 relative z-10" />
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.06] hover:scale-[1.01] transition-all cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/80 to-emerald-400/80 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-white/30 text-xs truncate">{user?.email || ""}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
                if (navigate) {
                  navigate("/login");
                } else {
                  window.location.href = "/login";
                }
              }}
              className="text-white/20 hover:text-white/50 transition-colors text-xs"
              title="Sign out"
            >
              ⟵
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-white/[0.04] border-t border-white/10 px-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around py-3">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${
                active === item.id ? "text-violet-400" : "text-white/30"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {active === item.id && <div className="w-1 h-1 rounded-full bg-violet-400" />}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
