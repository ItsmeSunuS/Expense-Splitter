// import { useState } from "react";
// import API from "../services/api";

// function CreateGroup() {
//   const [name, setName] = useState("");
//   const [members, setMembers] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await API.post("/groups", {
//         name,
//         members: members.split(","),
//       });

//       alert("Group created successfully");

//       setName("");
//       setMembers("");

//       console.log(response.data);

//     } catch (error) {
//       console.error(error);
//       alert("Error creating group");
//     }
//   };

//   return (
//     <div>
//       <h2>Create Group</h2>

//       <form onSubmit={handleSubmit}>

//         <input
//           type="text"
//           placeholder="Group Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <br /><br />

//         <input
//           type="text"
//           placeholder="Members (comma separated)"
//           value={members}
//           onChange={(e) => setMembers(e.target.value)}
//         />

//         <br /><br />

//         <button type="submit">
//           Create Group
//         </button>

//       </form>
//     </div>
//   );
// }

// export default CreateGroup;




/**
 * Plain React + React Router version of the Groups page.
 * Styling uses Tailwind utility classes — install Tailwind CSS first
 * (or replace classNames with your own CSS).
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  listGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "12px",
  },

  groupCard: {
    background: "white",
    borderRadius: "14px",
    padding: "14px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
    transition: "0.2s",
  },

  groupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: "10px",
  },

  groupName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  },

  groupMeta: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "2px",
  },

  badge: {
    fontSize: "10px",
    fontFamily: "monospace",
    background: "#f3f4f6",
    padding: "3px 6px",
    borderRadius: "6px",
    color: "#374151",
  },

  chipWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "10px",
  },

  chip: {
    fontSize: "11px",
    background: "#f3f4f6",
    padding: "4px 8px",
    borderRadius: "8px",
    color: "#374151",
  },

  empty: {
    textAlign: "center",
    padding: "40px 20px",
    borderRadius: "12px",
    border: "1px dashed #d1d5db",
    color: "#6b7280",
    fontSize: "13px",
  },

  linkBtn: {
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    textDecoration: "none",
    color: "#111827",
  },
};

/* -------------------- Component -------------------- */
export default function CreateGroup() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [members, setMembers] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    try {
      setLoading(true);
      const res = await API.get("/groups");
      setGroups(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !members.trim()) {
      alert("Please fill in name and members.");
      return;
    }

    try {
      setSubmitting(true);

      await API.post("/groups", {
        name: name.trim(),
        members: members
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
      });

      setName("");
      setMembers("");
      refresh();
    } catch (err) {
      console.error(err);
      alert("Could not create group");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Groups</h1>
        <p style={styles.subtitle}>
          Create and manage shared expense groups
        </p>
      </div>

      <div style={styles.grid}>
        {/* Create group */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Create group</h2>
          <p style={styles.subText}>
            Add members separated by commas
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "12px" }}>
              <label style={styles.label}>Group name</label>
              <input
                style={styles.input}
                placeholder="Goa Trip"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label style={styles.label}>Members</label>
              <input
                style={styles.input}
                placeholder="Alice, Bob, Charlie"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.button,
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "Creating..." : "Create group"}
            </button>
          </form>
        </div>

        {/* Groups list */}
        <div style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "14px",
            }}
          >
            <div>
              <h2 style={styles.sectionTitle}>Your groups</h2>
              <p style={styles.subText}>
                {groups.length} total groups
              </p>
            </div>

            <Link to="/expenses/new" style={styles.linkBtn}>
              Add expense
            </Link>
          </div>

          {loading ? (
            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              Loading groups...
            </p>
          ) : groups.length === 0 ? (
            <div style={styles.empty}>
              No groups yet. Create your first group 👈
            </div>
          ) : (
            <div style={styles.listGrid}>
              {groups.map((g) => {
                const id = g._id || g.id || "";

                return (
                  <div key={id} style={styles.groupCard}>
                    <div style={styles.groupHeader}>
                      <div>
                        <div style={styles.groupName}>{g.name}</div>
                        <div style={styles.groupMeta}>
                          {g.members?.length || 0} members
                        </div>
                      </div>

                      <div style={styles.badge}>
                        {id.slice(-6)}
                      </div>
                    </div>

                    <div style={styles.chipWrap}>
                      {(g.members || []).slice(0, 6).map((m) => (
                        <span key={m} style={styles.chip}>
                          {m}
                        </span>
                      ))}

                      {(g.members?.length || 0) > 6 && (
                        <span style={styles.chip}>
                          +{g.members.length - 6}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}