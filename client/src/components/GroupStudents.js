import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function GroupStudents({ user }) {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/study_groups`)
      .then(r => r.json())
      .then(groups => {
        const found = groups.find(g => g.study_group_id === parseInt(groupId));
        setGroup(found);
      });

    fetch(`/study_groups/${groupId}/memberships`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setMembers(data);
        setLoading(false);
      });
  }, [groupId]);

  const tierColors = {
    gold: { bg: "#FEF3E2", color: "#B7791F" },
    silver: { bg: "#F0F4F8", color: "#4A5568" },
    bronze: { bg: "#FDF0E0", color: "#92400E" },
  };

  if (!user || user.user_category !== "lecturer") {
    return <p style={styles.empty}>Access restricted to lecturers.</p>;
  }

  return (
    <div style={styles.page}>
      {/* Back link */}
      <Link to="/groups" style={styles.backLink}>← Back to Study Groups</Link>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>{group?.name || "Study Group"}</h1>
          {group?.course_name && (
            <span style={styles.coursePill}>📚 {group.course_name}</span>
          )}
          {group?.description && (
            <p style={styles.description}>{group.description}</p>
          )}
        </div>
        <div style={styles.countBadge}>
          <span style={styles.countNum}>{members.length}</span>
          <span style={styles.countLabel}>Students</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : members.length === 0 ? (
        <p style={styles.empty}>No students enrolled in this group yet.</p>
      ) : (
        <div style={styles.tableWrap}>
          <div style={styles.tableHeader}>
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Tier</span>
            <span>Date Joined</span>
          </div>
          {members.map(m => (
            <div key={m.membership_id} style={styles.tableRow}>
              <span style={styles.studentName}>{m.student_name}</span>
              <span style={styles.cell}>{m.student_email}</span>
              <span style={styles.cell}>{m.student_phone}</span>
              <span style={{
                ...styles.tierBadge,
                backgroundColor: tierColors[m.tier]?.bg,
                color: tierColors[m.tier]?.color,
              }}>
                {m.tier === "gold" ? "🥇" : m.tier === "silver" ? "🥈" : "🥉"} {m.tier}
              </span>
              <span style={styles.cell}>
                {new Date(m.date_joined).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "900px", margin: "0 auto", padding: "40px 24px" },
  backLink: { fontSize: "14px", color: "#048A81", textDecoration: "none", fontWeight: "600", display: "inline-block", marginBottom: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" },
  heading: { fontSize: "36px", color: "#2E4057", marginBottom: "10px", fontFamily: "'Playfair Display', serif" },
  coursePill: { display: "inline-block", backgroundColor: "#E8F4F3", color: "#048A81", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", marginBottom: "8px" },
  description: { fontSize: "14px", color: "#7A7670", marginTop: "8px" },
  countBadge: { display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#2E4057", padding: "16px 28px", borderRadius: "12px" },
  countNum: { fontSize: "36px", fontWeight: "700", color: "white", fontFamily: "'Playfair Display', serif" },
  countLabel: { fontSize: "12px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "1px" },
  empty: { textAlign: "center", color: "#aaa", marginTop: "60px", fontSize: "16px" },
  tableWrap: { backgroundColor: "white", borderRadius: "12px", border: "1px solid #E8E4DD", overflow: "hidden" },
  tableHeader: { display: "grid", gridTemplateColumns: "1.5fr 2fr 1.2fr 1fr 1fr", gap: "8px", padding: "12px 20px", backgroundColor: "#F5F5F5", fontSize: "11px", fontWeight: "700", color: "#7A7670", textTransform: "uppercase", letterSpacing: "0.5px" },
  tableRow: { display: "grid", gridTemplateColumns: "1.5fr 2fr 1.2fr 1fr 1fr", gap: "8px", padding: "16px 20px", borderTop: "1px solid #F0F0F0", alignItems: "center" },
  studentName: { fontSize: "14px", fontWeight: "600", color: "#2E4057" },
  cell: { fontSize: "13px", color: "#7A7670" },
  tierBadge: { display: "inline-block", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" },
};

export default GroupStudents;