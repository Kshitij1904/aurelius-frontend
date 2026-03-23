// Format number as Indian currency
export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

// Get percentage
export const getPercentage = (value, total) => {
  const v = Number(value) || 0;
  const t = Number(total) || 0;
  return t === 0 ? 0 : Math.round((v / t) * 100);
};

// Category color map
export const categoryColors = {
  Food: "#f59e0b",
  Housing: "#6366f1",
  Entertainment: "#8b5cf6",
  Health: "#ec4899",
  Transport: "#f97316",
  Shopping: "#3b82f6",
  Utilities: "#06b6d4",
  Investment: "#14b8a6",
  Income: "#10b981",
  Other: "#6b7280",
};

// Category icon map
export const categoryIcons = {
  Food: "🛒",
  Housing: "🏠",
  Entertainment: "🎬",
  Health: "🏥",
  Transport: "⛽",
  Shopping: "📦",
  Utilities: "⚡",
  Investment: "📈",
  Income: "💼",
  Other: "💳",
};
