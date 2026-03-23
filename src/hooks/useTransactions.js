import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL;

function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("aurelius_token");

      const res = await fetch(`${API}/api/transactions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch transactions");

      // Handle both possible backend formats
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API]);

  const addTransaction = async (payload) => {
    const token = localStorage.getItem("aurelius_token");
    const res = await fetch(`${API}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setTransactions((prev) => [data.transaction, ...prev]);
    return data.transaction;
  };

  const deleteTransaction = async (id) => {
    const token = localStorage.getItem("aurelius_token");
    await fetch(`${API}/api/transactions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  return { transactions, loading, error, addTransaction, deleteTransaction, refetch: fetchTransactions };
}

export default useTransactions;
