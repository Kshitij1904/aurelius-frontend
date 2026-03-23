import { useState, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OTPPage from "./pages/OTPPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetPage from "./pages/BudgetPage";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const [page, setPage] = useState("login");
  const [activeDashTab, setActiveDashTab] = useState("dashboard");

  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setPage("app");
    } else {
      setPage("login");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <div className="animate-pulse text-white/60">Loading...</div>
      </div>
    );
  }

  const navigate = (to) => {
    if (to === "app" || to === "dashboard") {
      setPage("app");
    } else {
      setPage(to);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
  };

  const renderPage = () => {
    if (page === "login") return (
      <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
        <LoginPage navigate={navigate} />
      </motion.div>
    );
    if (page === "register") return (
      <motion.div key="register" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
        <RegisterPage navigate={navigate} />
      </motion.div>
    );
    if (page === "otp") return (
      <motion.div key="otp" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
        <OTPPage navigate={navigate} />
      </motion.div>
    );
    if (page === "forgot") return (
      <motion.div key="forgot" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
        <ForgotPassword navigate={navigate} />
      </motion.div>
    );
    if (page === "reset") return (
      <motion.div key="reset" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
        <ResetPassword navigate={navigate} />
      </motion.div>
    );
    if (page === "app" || page === "dashboard") {
      return (
        <motion.div
          key={activeDashTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="app-shell"
        >
          {activeDashTab === "dashboard" && <Dashboard navigate={navigate} setTab={setActiveDashTab} />}
          {activeDashTab === "transactions" && <TransactionsPage navigate={navigate} setTab={setActiveDashTab} />}
          {activeDashTab === "budget" && <BudgetPage navigate={navigate} setTab={setActiveDashTab} />}
          {!["dashboard","transactions","budget"].includes(activeDashTab) && (
            <Dashboard navigate={navigate} setTab={setActiveDashTab} />
          )}
        </motion.div>
      );
    }
    return (
      <motion.div key="fallback" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
        <LoginPage navigate={navigate} />
      </motion.div>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </>
  );
}
