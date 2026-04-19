import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

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
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ---------------- STYLE ---------------- */
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
    marginBottom: "12px",
  },

  title: { fontSize: "28px", fontWeight: "700", color: "#111827", margin: 0 },

  subtitle: { fontSize: "13px", color: "#6b7280" },

  button: {
    background: "#111827",
    color: "white",
    padding: "10px 14px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
  },

  nav: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },

  navBtn: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "white",
    fontSize: "13px",
    textDecoration: "none",
    color: "#111827",
    fontWeight: "500",
  },

  select: {
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "13px",
  },

  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
    marginTop: "16px",
  },

  card: {
    background: "white",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },

  section: {
    background: "white",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },

  list: {
    marginTop: "16px",
    background: "white",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
};

/* ---------------- FORMAT ---------------- */
const format = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

/* ---------------- COMPONENT ---------------- */
export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const [g, e] = await Promise.all([
          API.get("/groups"),
          API.get("/expenses"),
        ]);

        setGroups(g.data || []);
        setExpenses(e.data || []);
      } catch (err) {
        console.error("API error:", err);
      }
    }

    load();
  }, []);

  /* ---------------- FIX: NORMALIZE DATA ---------------- */
  const normalized = useMemo(() => {
    return expenses.map((e) => ({
      amount: Number(e.amount || e.totalAmount || 0),

      groupId:
        typeof e.groupId === "object"
          ? e.groupId._id
          : e.groupId || e.group,

      createdAt: e.createdAt || e.date || null,

      description: e.description || "Expense",
      paidBy: e.paidBy || "Unknown",
    }));
  }, [expenses]);

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    if (selectedGroup === "all") return normalized;

    return normalized.filter(
      (e) => String(e.groupId) === String(selectedGroup)
    );
  }, [normalized, selectedGroup]);

  /* ---------------- GROUP MAP ---------------- */
  const groupMap = useMemo(
    () => new Map(groups.map((g) => [g._id || g.id, g.name])),
    [groups]
  );

  /* ---------------- TOTAL ---------------- */
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  /* ---------------- GROUP CHART ---------------- */
  const groupAgg = new Map();

  filtered.forEach((e) => {
    const name = groupMap.get(e.groupId) || "Unknown";
    groupAgg.set(name, (groupAgg.get(name) || 0) + e.amount);
  });

  const groupData = Array.from(groupAgg.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  /* ---------------- TREND ---------------- */
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toISOString().slice(5, 10),
      total: 0,
    };
  });

  filtered.forEach((e) => {
    if (!e.createdAt) return;
    const key = new Date(e.createdAt).toISOString().slice(5, 10);
    const day = days.find((d) => d.date === key);
    if (day) day.total += e.amount;
  });

  const COLORS = ["#111827", "#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

  const recent = [...filtered]
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 5);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Track expenses & balances easily</p>
        </div>

        <Link to="/expenses/new" style={styles.button}>
          + Add Expense
        </Link>
      </div>

      {/* NAV */}
      <div style={styles.nav}>
        <select
          style={styles.select}
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="all">All Groups</option>
          {groups.map((g) => (
            <option key={g._id || g.id} value={g._id || g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <Link to="/groups" style={styles.navBtn}>👥 Groups</Link>
        <Link to="/expenses/new" style={styles.navBtn}>➕ Expense</Link>
        <Link to="/balances" style={styles.navBtn}>⚖ Balances</Link>
      </div>

      {/* STATS */}
      <div style={styles.grid4}>
        <Stat label="Total Spent" value={format(total)} />
        <Stat label="Groups" value={groups.length} />
        <Stat label="Expenses" value={filtered.length} />
        <Stat
          label="Avg"
          value={format(total / (filtered.length || 1))}
        />
      </div>

      {/* CHARTS */}
      <div style={styles.grid3}>
        <div style={styles.section}>
          <h3>📈 Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
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
          <h3>📊 By Group</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={groupData}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#111827" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.section}>
          <h3>🥧 Split</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={groupData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {groupData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT */}
      <div style={styles.list}>
        <h3>Recent Expenses</h3>

        {recent.length === 0 ? (
          <p>No expenses found</p>
        ) : (
          recent.map((e) => (
            <div
              key={e._id || e.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>
                  {e.description}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {groupMap.get(e.groupId) || "Unknown"}
                </div>
              </div>
              <div style={{ fontWeight: 600 }}>
                {format(e.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */
function Stat({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={{ fontSize: "12px", color: "#6b7280" }}>
        {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: "700" }}>
        {value}
      </div>
    </div>
  );
}