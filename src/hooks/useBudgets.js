import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL;

export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("aurelius_token");
      const res = await fetch(`${API}/budgets`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      setBudgets(data.budgets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBudget = async (payload) => {
    const token = localStorage.getItem("aurelius_token");
    const res = await fetch(`${API}/budgets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setBudgets((prev) => [...prev, data.budget]);
    return data.budget;
  };

  const updateBudget = async (id, payload) => {
    const token = localStorage.getItem("aurelius_token");
    const res = await fetch(`${API}/budgets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setBudgets((prev) => prev.map((b) => (b._id === id ? data.budget : b)));
  };

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

  return { budgets, loading, createBudget, updateBudget, refetch: fetchBudgets };
}
