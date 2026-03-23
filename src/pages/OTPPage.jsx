import { useState, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

export default function OTPPage({ navigate }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length < 6) return;

    setLoading(true);

    try {
      const email = localStorage.getItem("otp_email");

      const res = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setVerified(true);

      setTimeout(() => navigate("dashboard"), 1000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#080c14] flex items-center justify-center p-4 relative overflow-hidden"
    >
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-violet-500/30 mx-auto mb-6"
        >
          <span className="text-2xl">🔐</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white text-2xl font-semibold mb-2"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Verify your email
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/40 text-sm mb-10"
        >
          We sent a 6-digit code to your email
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex gap-2 justify-center mb-8"
        >
          {otp.map((v, i) => (
            <input
              key={i}
              ref={el => refs.current[i] = el}
              type="text"
              maxLength={1}
              value={v}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-12 h-14 rounded-2xl border text-center text-white text-lg font-semibold focus:outline-none transition-all bg-white/[0.06] backdrop-blur
                ${v ? "border-violet-500 bg-violet-500/10" : "border-white/10"}
                focus:border-violet-500 focus:bg-white/[0.10]`}
            />
          ))}
        </motion.div>

        <motion.button
          onClick={handleVerify}
          whileTap={{ scale: 0.97 }}
          disabled={loading || otp.join("").length < 6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className={`w-full rounded-2xl py-4 font-medium text-sm transition-all shadow-lg
            ${verified
              ? "bg-emerald-500 text-white shadow-emerald-500/25"
              : "bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-violet-500/25"
            } disabled:opacity-40`}
        >
          {verified ? "✓ Verified! Redirecting..." : loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying...
            </span>
          ) : "Verify & Continue"}
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/30 text-sm mt-5"
        >
          Didn't receive it?{" "}
          <button className="text-violet-400 hover:text-violet-300 transition-colors">Resend code</button>
        </motion.p>
      </div>
    </motion.div>
  );
}
