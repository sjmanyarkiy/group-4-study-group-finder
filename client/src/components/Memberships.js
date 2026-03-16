import React, { useEffect, useState } from "react";

function Memberships({ user }) {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/users/${user.user_id}/memberships`)
      .then((r) => r.json())
      .then((data) => {
        setMemberships(data);
        setLoading(false);
      });
  }, [user]);

  const handleLeave = (membershipId) => {
    fetch(`/memberships/${membershipId}`, { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setMemberships((prev) => prev.filter((m) => m.membership_id !== membershipId));
      }
    });
  };

  if (!user) return <p style={styles.empty}>Please log in to view your memberships.</p>;
  if (loading) return <p style={styles.empty}>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>My Memberships</h1>
        <p style={styles.pageSubtitle}>Study groups you've joined.</p>
      </div>

      {memberships.length === 0 ? (
        <p style={styles.empty}>You haven't joined any groups yet.</p>
      ) : (
        <div style={styles.grid}>
          {memberships.map((m) => (
            <div key={m.membership_id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={{
                  ...styles.tierBadge,
                  backgroundColor: m.tier === "gold" ? "#FEF3E2" : m.tier === "silver" ? "#F0F4F8" : "#FDF0E0",
                  color: m.tier === "gold" ? "#B7791F" : m.tier === "silver" ? "#4A5568" : "#92400E",
                }}>
                  {m.tier === "gold" ? "🥇" : m.tier === "silver" ? "🥈" : "🥉"} {m.tier.charAt(0).toUpperCase() + m.tier.slice(1)}
                </div>
              </div>
              <h3 style={styles.cardTitle}>{m.study_group_name || m.name}</h3>
              <div style={styles.cardMeta}>
                <span style={styles.metaItem}>💰 KES {m.fee}/mo</span>
                <span style={styles.metaItem}>📅 Joined {new Date(m.date_joined).toLocaleDateString()}</span>
              </div>
              <button
                style={styles.leaveBtn}
                onClick={() => handleLeave(m.membership_id)}
              >
                Leave Group
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "900px", margin: "0 auto", padding: "48px 24px" },
  pageHeader: { marginBottom: "40px" },
  pageTitle: { fontSize: "40px", color: "#2E4057", marginBottom: "8px", fontFamily: "'Playfair Display', serif" },
  pageSubtitle: { fontSize: "16px", color: "#7A7670" },
  empty: { textAlign: "center", color: "#aaa", marginTop: "60px", fontSize: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" },
  card: { backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #E8E4DD", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
  cardTop: { marginBottom: "12px" },
  tierBadge: { display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  cardTitle: { fontSize: "18px", color: "#2E4057", marginBottom: "12px", fontFamily: "'Playfair Display', serif" },
  cardMeta: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" },
  metaItem: { fontSize: "13px", color: "#7A7670" },
  leaveBtn: { width: "100%", padding: "10px", backgroundColor: "transparent", border: "1px solid #E8E4DD", borderRadius: "6px", color: "#C0392B", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
};

export default Memberships;