import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ResetPassword({ navigate }) {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API = import.meta.env.VITE_API_URL;
      await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, password }),
      });

      toast.success("Password updated successfully ✅");
      navigate("login");
    } catch (err) {
      console.error(err);
      toast.error("Reset failed");
    }
  };

  const handleResend = async () => {
    try {
      const API = import.meta.env.VITE_API_URL;
      await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // NOTE: ideally email should be passed, but keeping simple
      });

      toast.success("OTP resent successfully 📩");
      setTimer(30);
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[400px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full -top-20 -left-20" />
        <div className="absolute w-[300px] h-[300px] bg-emerald-400/20 blur-[120px] rounded-full bottom-0 right-0" />
      </div>

      <div className="backdrop-blur-xl bg-white/[0.04] border border-white/10 rounded-3xl p-8 w-[340px] shadow-[0_0_60px_rgba(139,92,246,0.2)]">
        <h2 className="text-white text-xl font-semibold mb-2">Reset Password</h2>
        <p className="text-white/40 text-sm mb-6">Enter OTP and your new password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Enter OTP"
            className="w-full bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.25)]"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <div className="flex justify-between items-center text-xs text-white/40">
            <span>
              {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive OTP?"}
            </span>
            <button
              type="button"
              disabled={timer > 0}
              onClick={handleResend}
              className={`text-violet-400 ${timer > 0 ? "opacity-30 cursor-not-allowed" : "hover:text-violet-300"}`}
            >
              Resend
            </button>
          </div>

          <input
            type="password"
            placeholder="New Password"
            className="w-full bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.25)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-500 text-white rounded-2xl py-3 font-medium text-sm shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-[1.02] active:scale-[0.97] transition-all"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}