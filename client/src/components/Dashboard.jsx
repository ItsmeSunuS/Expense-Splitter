import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import API from "../services/api";

/* -------------------- Styles -------------------- */
const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "system-ui, sans-serif",
    background: "linear-gradient(135deg, #f9fafb, #eef2ff)",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "24px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: 0,
    color: "#111827",
  },

  subtitle: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
  },

  button: {
    background: "#111827",
    color: "white",
    padding: "10px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },

  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
    marginTop: "16px",
  },

  card: {
    background: "white",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  },

  section: {
    background: "white",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  },

  label: {
    fontSize: "11px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#6b7280",
    fontWeight: "600",
  },

  value: {
    fontSize: "22px",
    fontWeight: "700",
    marginTop: "10px",
    color: "#111827",
  },

  hint: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px",
  },

  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "16px",
  },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
};

/* -------------------- Helpers -------------------- */
function formatCurrency(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

/* -------------------- Component -------------------- */
export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [g, e] = await Promise.allSettled([
          API.get("/groups"),
          API.get("/expenses"),
        ]);

        if (cancelled) return;

        if (g.status === "fulfilled") setGroups(g.value.data || []);
        if (e.status === "fulfilled") setExpenses(e.value.data || []);

        if (g.status === "rejected" && e.status === "rejected") {
          setError("Could not reach the API. Check your API base URL.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => (cancelled = true);
  }, []);

  const totalSpent = expenses.reduce((s, x) => s + (x.amount || 0), 0);
  const avgPerExpense = expenses.length ? totalSpent / expenses.length : 0;

  const groupMap = new Map(
    groups.map((g) => [g._id || g.id || "", g.name])
  );

  const perGroup = new Map();
  for (const ex of expenses) {
    const key = groupMap.get(ex.groupId) || "Unknown";
    perGroup.set(key, (perGroup.get(key) || 0) + (ex.amount || 0));
  }

  const perGroupData = Array.from(perGroup.entries())
    .map(([name, value]) => ({ name, value }))
    .slice(0, 6);

  const days = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ date: d.toISOString().slice(5, 10), total: 0 });
  }

  for (const ex of expenses) {
    if (!ex.createdAt) continue;
    const key = new Date(ex.createdAt).toISOString().slice(5, 10);
    const day = days.find((d) => d.date === key);
    if (day) day.total += ex.amount || 0;
  }

  const recent = [...expenses]
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 5);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>
            A snapshot of your groups and spending
          </p>
        </div>

        <Link to="/expenses" style={styles.button}>
          + Add Expense
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Stats */}
      <div style={styles.grid4}>
        <StatCard label="Total spent" value={formatCurrency(totalSpent)} />
        <StatCard label="Groups" value={groups.length} />
        <StatCard label="Avg expense" value={formatCurrency(avgPerExpense)} />
        <StatCard
          label="14 days"
          value={formatCurrency(days.reduce((s, d) => s + d.total, 0))}
        />
      </div>

      {/* Charts */}
      <div style={styles.grid3}>
        <div style={styles.section}>
          <h3>Last 14 days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={days}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area dataKey="total" stroke="#111827" fill="#c7d2fe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.section}>
          <h3>By Group</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={perGroupData}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#111827" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent */}
      <div style={{ ...styles.section, marginTop: "16px" }}>
        <h3>Recent Expenses</h3>

        {loading ? (
          <p>Loading...</p>
        ) : recent.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          recent.map((ex) => (
            <div key={ex._id || ex.id} style={styles.listItem}>
              <div>
                <div style={{ fontWeight: 500 }}>
                  {ex.description || "Expense"}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {ex.paidBy}
                </div>
              </div>
              <div style={{ fontWeight: 600 }}>
                {formatCurrency(ex.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* -------------------- Stat Card -------------------- */
function StatCard({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}