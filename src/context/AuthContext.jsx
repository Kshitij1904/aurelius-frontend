import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("aurelius_token") || null);
  const [loading, setLoading] = useState(true);

  const API = (import.meta.env.VITE_API_URL.replace(/\/$/, "") + "/api");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const url = `${API}/api/auth/me`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-store",
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          // Token invalid or expired
          setUser(null);
          setToken(null);
          localStorage.removeItem("aurelius_token");
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, API]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loginUrl = `${API}/api/auth/login`;

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setUser(null); // clear previous user
      setToken(data.token);
      localStorage.setItem("aurelius_token", data.token);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    setLoading(true);
    try {
      const otpUrl = `${API}/api/auth/verify-otp`;

      const res = await fetch(otpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      setUser(null);
      setToken(data.token);
      localStorage.setItem("aurelius_token", data.token);
      return true;
    } catch (err) {
      console.error("OTP error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("aurelius_token");
  };

  const authHeader = () => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  };

  const authFetch = (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
        ...(options.headers || {}),
      },
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, verifyOTP, logout, authHeader, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
