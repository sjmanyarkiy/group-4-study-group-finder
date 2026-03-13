import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

function MembershipForm({ user }) {
  const history = useHistory();
  const location = useLocation();
  const preselectedGroup = location.state?.group || null;

  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    study_group_id: preselectedGroup?.study_group_id || "",
    tier: "",
    name: "",
    fee: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const tierOptions = [
    { value: "bronze", label: "Bronze", fee: 500 },
    { value: "silver", label: "Silver", fee: 750 },
    { value: "gold", label: "Gold", fee: 1000 },
  ];

  useEffect(() => {
    fetch("/study_groups")
      .then((r) => r.json())
      .then(setGroups);
  }, []);

  const handleTierChange = (e) => {
    const selected = tierOptions.find((t) => t.value === e.target.value);
    setFormData((prev) => ({
      ...prev,
      tier: selected.value,
      name: `${selected.label} Membership`,
      fee: selected.fee,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return setError("You must be logged in to join a group.");
    if (!formData.tier) return setError("Please select a membership tier.");
    if (!formData.study_group_id) return setError("Please select a study group.");

    fetch("/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        user_id: user.user_id,
      }),
    }).then((res) => {
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => history.push("/memberships"), 1500);
      } else {
        res.json().then((d) => setError(d.error));
      }
    });
  };

  if (!user) return (
    <div style={styles.page}>
      <p style={styles.error}>Please log in to join a study group.</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Join a Study Group</h2>
        <p style={styles.subheading}>Choose your group and membership tier below.</p>

        {success && <div style={styles.success}>Joined successfully! Redirecting...</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Study Group */}
          <div style={styles.field}>
            <label style={styles.label}>Study Group</label>
            {preselectedGroup ? (
              <div style={styles.preselected}>
                📚 {preselectedGroup.name}
                <input type="hidden" value={preselectedGroup.study_group_id} />
              </div>
            ) : (
              <select
                value={formData.study_group_id}
                onChange={(e) => setFormData({ ...formData, study_group_id: e.target.value })}
                style={styles.input}
                required
              >
                <option value="">Select a group...</option>
                {groups.map((g) => (
                  <option key={g.study_group_id} value={g.study_group_id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tier */}
          <div style={styles.field}>
            <label style={styles.label}>Membership Tier</label>
            <div style={styles.tierGrid}>
              {tierOptions.map((t) => (
                <div
                  key={t.value}
                  style={{
                    ...styles.tierCard,
                    ...(formData.tier === t.value ? styles.tierCardActive : {}),
                  }}
                  onClick={() => handleTierChange({ target: { value: t.value } })}
                >
                  <div style={styles.tierName}>
                    {t.value === "bronze" ? "🥉" : t.value === "silver" ? "🥈" : "🥇"} {t.label}
                  </div>
                  <div style={styles.tierFee}>KES {t.fee}/mo</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {formData.tier && (
            <div style={styles.summary}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Membership</span>
                <span>{formData.name}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Monthly Fee</span>
                <span style={styles.summaryFee}>KES {formData.fee}</span>
              </div>
            </div>
          )}

          <button type="submit" style={styles.submitBtn}>
            Confirm Membership
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "560px", margin: "0 auto", padding: "48px 24px" },
  card: { backgroundColor: "white", borderRadius: "12px", padding: "36px", border: "1px solid #E8E4DD", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" },
  heading: { fontSize: "28px", color: "#2E4057", marginBottom: "8px" },
  subheading: { fontSize: "15px", color: "#7A7670", marginBottom: "28px" },
  form: { display: "flex", flexDirection: "column", gap: "24px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#7A7670", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #E8E4DD", fontSize: "14px", backgroundColor: "white" },
  preselected: { padding: "12px 16px", backgroundColor: "#EEF9F8", borderRadius: "8px", border: "1px solid #C8E8E6", color: "#048A81", fontWeight: "600", fontSize: "15px" },
  tierGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" },
  tierCard: { padding: "16px 12px", borderRadius: "10px", border: "2px solid #E8E4DD", cursor: "pointer", textAlign: "center", transition: "all 0.15s" },
  tierCardActive: { border: "2px solid #048A81", backgroundColor: "#EEF9F8" },
  tierName: { fontSize: "14px", fontWeight: "600", color: "#2E4057", marginBottom: "4px" },
  tierFee: { fontSize: "13px", color: "#7A7670" },
  summary: { backgroundColor: "#FAF8F5", borderRadius: "8px", padding: "16px 20px", border: "1px solid #E8E4DD" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", padding: "6px 0" },
  summaryLabel: { color: "#7A7670" },
  summaryFee: { fontWeight: "600", color: "#2E4057" },
  submitBtn: { padding: "14px", backgroundColor: "#2E4057", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600" },
  success: { backgroundColor: "#EEF9F8", color: "#048A81", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontWeight: "500" },
  errorBox: { backgroundColor: "#FEF0F0", color: "#C0392B", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" },
  error: { color: "#C0392B", textAlign: "center" },
};

export default MembershipForm;