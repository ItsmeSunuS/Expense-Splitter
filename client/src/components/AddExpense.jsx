// import { useState } from "react";
// import API from "../services/api";

// function AddExpense() {
//   const [groupId, setGroupId] = useState("");
//   const [description, setDescription] = useState("");
//   const [amount, setAmount] = useState("");
//   const [paidBy, setPaidBy] = useState("");
//   const [participants, setParticipants] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const members = participants.split(",");

//       const share = amount / members.length;

//       const participantData = members.map((name) => ({
//         name,
//         share,
//       }));

//       await API.post("/expenses", {
//         groupId,
//         description,
//         amount: Number(amount),
//         paidBy,
//         participants: participantData,
//       });

//       alert("Expense added successfully");

//     } catch (error) {
//       console.error(error);
//       alert("Error adding expense");
//     }
//   };

//   return (
//     <div>
//       <h2>Add Expense</h2>

//       <form onSubmit={handleSubmit}>

//         <input
//           placeholder="Group ID"
//           value={groupId}
//           onChange={(e) => setGroupId(e.target.value)}
//         />

//         <br /><br />

//         <input
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <br /><br />

//         <input
//           type="number"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />

//         <br /><br />

//         <input
//           placeholder="Paid By"
//           value={paidBy}
//           onChange={(e) => setPaidBy(e.target.value)}
//         />

//         <br /><br />

//         <input
//           placeholder="Participants (comma separated)"
//           value={participants}
//           onChange={(e) => setParticipants(e.target.value)}
//         />

//         <br /><br />

//         <button type="submit">
//           Add Expense
//         </button>

//       </form>
//     </div>
//   );
// }

// export default AddExpense;


import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

/* -------------------- Styles -------------------- */
const styles = {
  page: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "system-ui, sans-serif",
    background: "linear-gradient(135deg, #f9fafb, #eef2ff)",
    minHeight: "100vh",
  },

  header: {
    marginBottom: "20px",
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
    gridTemplateColumns: "2fr 1fr",
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
    marginBottom: "14px",
    color: "#111827",
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
    transition: "0.2s",
  },

  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    fontSize: "13px",
    outline: "none",
    resize: "none",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  button: {
    marginTop: "10px",
    background: "#111827",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },

  previewBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px",
  },

  amount: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginTop: "6px",
  },

  smallText: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },

  memberItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 10px",
    borderRadius: "10px",
    background: "#f3f4f6",
    marginTop: "8px",
    fontSize: "13px",
  },
};

/* -------------------- Component -------------------- */
export default function AddExpense() {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get("/groups")
      .then((r) => setGroups(r.data || []))
      .catch((err) => console.error(err));
  }, []);

  const selectedGroup = useMemo(
    () => groups.find((g) => (g._id || g.id) === groupId),
    [groups, groupId]
  );

  useEffect(() => {
    if (selectedGroup && !participants) {
      setParticipants(selectedGroup.members.join(", "));
    }
  }, [groupId]);

  const numericAmount = Number(amount) || 0;

  const memberList = participants
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const perPerson = memberList.length
    ? numericAmount / memberList.length
    : 0;

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !groupId ||
      !description.trim() ||
      !amount ||
      !paidBy.trim() ||
      memberList.length === 0
    ) {
      alert("Please complete all fields.");
      return;
    }

    try {
      setSubmitting(true);

      await API.post("/expenses", {
        groupId,
        description: description.trim(),
        amount: numericAmount,
        paidBy: paidBy.trim(),
        participants: memberList.map((name) => ({
          name,
          share: perPerson,
        })),
      });

      alert("Expense added successfully");

      setDescription("");
      setAmount("");
      setPaidBy("");
    } catch (err) {
      console.error(err);
      alert("Could not add expense");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Add Expense</h1>
        <p style={styles.subtitle}>
          Split expenses easily among your group members
        </p>
      </div>

      <div style={styles.grid}>
        {/* Form */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Expense details</h2>

          <form onSubmit={handleSubmit}>
            {/* Group */}
            <div style={{ marginBottom: "12px" }}>
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
            </div>

            {/* Description */}
            <div style={{ marginBottom: "12px" }}>
              <label style={styles.label}>Description</label>
              <input
                style={styles.input}
                placeholder="Dinner, travel, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Amount + Paid By */}
            <div style={styles.row}>
              <div>
                <label style={styles.label}>Amount</label>
                <input
                  type="number"
                  style={styles.input}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <label style={styles.label}>Paid By</label>

                {selectedGroup?.members?.length ? (
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    style={styles.input}
                  >
                    <option value="">Select</option>
                    {selectedGroup.members.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    style={styles.input}
                    placeholder="Name"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Participants */}
            <div style={{ marginTop: "12px" }}>
              <label style={styles.label}>Participants</label>
              <textarea
                rows={2}
                style={styles.textarea}
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="Alice, Bob, Charlie"
              />
              <div style={styles.smallText}>
                Separate names with commas
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.button,
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "Saving..." : "Add Expense"}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Split preview</h2>

          <div style={styles.previewBox}>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Per person
            </div>

            <div style={styles.amount}>
              ₹{perPerson.toFixed(2)}
            </div>

            <div style={styles.smallText}>
              {memberList.length} participants · Total ₹
              {numericAmount.toFixed(2)}
            </div>
          </div>

          {memberList.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              {memberList.map((m) => (
                <div key={m} style={styles.memberItem}>
                  <span>{m}</span>
                  <span style={{ fontWeight: "600" }}>
                    ₹{perPerson.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}