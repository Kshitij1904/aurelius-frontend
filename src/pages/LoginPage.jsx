import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function LoginPage({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const success = await login(email.trim(), password);

      if (success) {
        navigate("dashboard");
      } else {
        toast.error("Invalid credentials or user not found");
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#080c14] flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Ambient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full bg-blue-600/8 blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-10 justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white font-bold text-lg">₹</span>
          </div>
          <span className="text-white text-xl font-semibold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Aurelius
          </span>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <h1 className="text-white text-2xl font-semibold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-white/40 text-sm mb-8">Sign in to your financial dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="priya@example.com"
                required
                className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all text-sm"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("forgot")}
                className="text-violet-400 text-xs hover:text-violet-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white rounded-2xl py-4 font-medium text-sm transition-all shadow-lg shadow-violet-500/25 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in"}
            </motion.button>
          </form>

        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/30 text-sm mt-6"
        >
          Don't have an account?{" "}
          <button onClick={() => navigate("register")} className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Create one
          </button>
        </motion.p>
      </div>
    </motion.div>
  );
}
