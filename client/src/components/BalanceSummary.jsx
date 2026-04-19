// import { useState } from "react";
// import API from "../services/api";

// function BalanceSummary() {
//   const [groupId, setGroupId] = useState("");
//   const [balances, setBalances] = useState([]);

//   const fetchBalances = async () => {
//     try {
//       const response = await API.get(
//         `/expenses/balances/${groupId}`
//       );

//       setBalances(response.data);

//     } catch (error) {
//       console.error(error);
//       alert("Error fetching balances");
//     }
//   };

//   return (
//     <div>
//       <h2>Balance Summary</h2>

//       <input
//         placeholder="Group ID"
//         value={groupId}
//         onChange={(e) => setGroupId(e.target.value)}
//       />

//       <br /><br />

//       <button onClick={fetchBalances}>
//         Get Balances
//       </button>

//       <ul>
//         {balances.map((b, index) => (
//           <li key={index}>
//             {b.from} pays {b.to} ₹{b.amount}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default BalanceSummary;

import { useEffect, useState } from "react";
import API from "../services/api"
/**
 * Plain React + React Router version of the Balances page.
 * Picks a group and shows simplified "who pays whom" transfers.
 */
/* -------------------- Styles -------------------- */
const styles = {
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "system-ui, sans-serif",
    background: "linear-gradient(135deg, #f9fafb, #eef2ff)",
    minHeight: "100vh",
  },

  header: {
    marginBottom: "18px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    margin: 0,
    color: "#111827",
  },

  subtitle: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "18px",
  },

  card: {
    background: "white",
    borderRadius: "14px",
    padding: "18px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#111827",
  },

  subText: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "14px",
  },

  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
    display: "block",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    fontSize: "13px",
    outline: "none",
  },

  button: {
    width: "100%",
    marginTop: "10px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },

  hintBox: {
    marginTop: "12px",
    padding: "10px",
    borderRadius: "10px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    fontSize: "12px",
    color: "#6b7280",
  },

  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: "12px",
  },

  statTitle: {
    fontSize: "15px",
    fontWeight: "600",
  },

  statSub: {
    fontSize: "12px",
    color: "#6b7280",
  },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    marginBottom: "10px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
  },

  transfer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
  },

  arrow: {
    color: "#9ca3af",
  },

  amount: {
    background: "#f3f4f6",
    padding: "6px 10px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "13px",
  },

  empty: {
    textAlign: "center",
    padding: "40px 20px",
    borderRadius: "12px",
    border: "1px dashed #d1d5db",
    color: "#6b7280",
    fontSize: "13px",
  },

  success: {
    textAlign: "center",
    padding: "40px 20px",
    borderRadius: "12px",
    border: "1px dashed #a7f3d0",
    background: "#ecfdf5",
    color: "#065f46",
  },
};

/* -------------------- Component -------------------- */
export default function BalanceSummary() {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    API.get("/groups")
      .then((r) => setGroups(r.data || []))
      .catch(console.error);
  }, []);

  async function fetchBalances() {
    if (!groupId.trim()) {
      alert("Pick or enter a group first");
      return;
    }

    try {
      setLoading(true);
      setTouched(true);

      const res = await API.get(`/expenses/balances/${groupId}`);
      setBalances(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Could not fetch balances");
      setBalances([]);
    } finally {
      setLoading(false);
    }
  }

  const totalSettlement = balances.reduce(
    (s, b) => s + (b.amount || 0),
    0
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Balance Summary</h1>
        <p style={styles.subtitle}>
          View and settle group expenses easily
        </p>
      </div>

      <div style={styles.grid}>
        {/* Left panel */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Pick a group</h2>
          <p style={styles.subText}>
            Select a group to calculate settlements
          </p>

          <div>
            <label style={styles.label}>Group</label>

            {groups.length > 0 ? (
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                style={styles.input}
              >
                <option value="">Select a group</option>
                {groups.map((g) => (
                  <option key={g._id || g.id} value={g._id || g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                style={styles.input}
                placeholder="Group ID"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              />
            )}

            <button
              onClick={fetchBalances}
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Loading..." : "Get balances"}
            </button>

            <div style={styles.hintBox}>
              Tip: This calculates the minimum number of transactions needed
              to settle the group.
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={styles.card}>
          <div style={styles.statHeader}>
            <div>
              <div style={styles.statTitle}>Settlements</div>
              <div style={styles.statSub}>
                {balances.length
                  ? `${balances.length} transfer(s) · ₹${totalSettlement.toFixed(
                      2
                    )}`
                  : "No data yet"}
              </div>
            </div>
          </div>

          {loading ? (
            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              Loading balances...
            </p>
          ) : !touched ? (
            <div style={styles.empty}>
              Select a group and click “Get balances”
            </div>
          ) : balances.length === 0 ? (
            <div style={styles.success}>
              <strong>All settled 🎉</strong>
              <div>No pending balances</div>
            </div>
          ) : (
            <div>
              {balances.map((b, i) => (
                <div key={i} style={styles.listItem}>
                  <div style={styles.transfer}>
                    <span style={{ fontWeight: "600" }}>{b.from}</span>
                    <span style={styles.arrow}>→</span>
                    <span style={{ fontWeight: "600" }}>{b.to}</span>
                  </div>

                  <div style={styles.amount}>
                    ₹{b.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}