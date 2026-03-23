import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

function useStats() {
  const [stats, setStats] = useState({ totalBalance: 0, income: 0, expenses: 0, savings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("aurelius_token");

        const res = await fetch(`${API}/api/stats/summary`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats({
          totalBalance: data?.totalBalance || 0,
          income: data?.income || 0,
          expenses: data?.expenses || 0,
          savings: data?.savings || 0,
          trend: Array.isArray(data?.trend) ? data.trend : [],
          monthlyTrend: Array.isArray(data?.monthlyTrend) ? data.monthlyTrend : [],
          categories: Array.isArray(data?.categories) ? data.categories : [],
          categoryBreakdown: Array.isArray(data?.categoryBreakdown) ? data.categoryBreakdown : [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading };
}

export default useStats;
