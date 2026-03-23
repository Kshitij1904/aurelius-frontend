import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

export default function RegisterPage({ navigate }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirm } = form;

    if (!name || !email || !password || !confirm) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // store email for OTP verification
      localStorage.setItem("otp_email", email);

      navigate("otp");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Priya Sharma", type: "text" },
    { key: "email", label: "Email", placeholder: "priya@example.com", type: "email" },
    { key: "password", label: "Password", placeholder: "••••••••", type: "password" },
    { key: "confirm", label: "Confirm Password", placeholder: "••••••••", type: "password" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#080c14] flex items-center justify-center p-4 relative overflow-hidden"
    >
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10 justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white font-bold text-lg">₹</span>
          </div>
          <span className="text-white text-xl font-semibold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Aurelius
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
          className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <h1 className="text-white text-2xl font-semibold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Create account
          </h1>
          <p className="text-white/40 text-sm mb-8">Start your financial journey today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
              >
                <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.08] transition-all text-sm"
                />
              </motion.div>
            ))}

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl py-4 font-medium text-sm transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : "Create account"}
            </motion.button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/30 text-sm mt-6"
        >
          Already have an account?{" "}
          <button onClick={() => navigate("login")} className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Sign in
          </button>
        </motion.p>
      </div>
    </motion.div>
  );
}
