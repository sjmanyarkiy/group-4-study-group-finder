import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function StudyGroups({ user }) {
  const [groups, setGroups] = useState([]);
  const [reviewForm, setReviewForm] = useState({ studyGroupId: null, stars: 5, comment: "" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("/study_groups")
      .then((res) => res.json())
      .then((data) => setGroups(data));
       
      fetch("/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  const handleReviewSubmit = (e, studyGroupId) => {
    e.preventDefault();
    fetch("/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        study_group_id: studyGroupId,
        user_id: user.user_id,
        stars: reviewForm.stars,
        comment: reviewForm.comment,
      }),
    }).then((res) => {
      if (res.ok) {
        setMessage("Review submitted!");
        setReviewForm({ studyGroupId: null, stars: 5, comment: "" });
      } else {
        res.json().then((data) => setMessage(data.error));
      }
    });
  };

  if (!groups.length) return <p style={styles.empty}>No study groups found.</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Study Groups</h2>
      {message && <p style={styles.message}>{message}</p>}
      <div style={styles.grid}>
        {groups.map((group) => (
          <div key={group.study_group_id} style={styles.card}>
            <h3 style={styles.cardTitle}>{group.name}</h3>
            {group.description && <p style={styles.cardDesc}>{group.description}</p>}
            {group.subject && <p style={styles.tag}>{group.subject}</p>}

            <div style={styles.actions}>
              {user && (
                <Link to="/memberships/new" style={styles.joinButton}>
                  Join Group
                </Link>
              )}
              {user && (
                <button
                  style={styles.reviewButton}
                  onClick={() =>
                    setReviewForm((prev) => ({
                      ...prev,
                      studyGroupId: prev.studyGroupId === group.study_group_id ? null : group.study_group_id,
                    }))
                  }
                >
                  {reviewForm.studyGroupId === group.study_group_id ? "Cancel" : "Leave Review"}
                </button>
              )}
            </div>

            {reviewForm.studyGroupId === group.study_group_id && (
              <form onSubmit={(e) => handleReviewSubmit(e, group.study_group_id)} style={styles.reviewForm}>
                <label>Stars</label>
                <select
                  value={reviewForm.stars}
                  onChange={(e) => setReviewForm({ ...reviewForm, stars: parseInt(e.target.value) })}
                  style={styles.input}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{"⭐".repeat(n)}</option>
                  ))}
                </select>
                <label>Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  style={styles.textarea}
                  placeholder="Share your experience..."
                />
                <button type="submit" style={styles.submitButton}>Submit Review</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "900px", margin: "0 auto", padding: "40px 24px" },
  heading: { fontSize: "28px", color: "#2E4057", marginBottom: "24px" },
  empty: { textAlign: "center", color: "#888", marginTop: "40px" },
  message: { color: "#048A81", marginBottom: "16px", fontWeight: "600" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" },
  card: { backgroundColor: "white", borderRadius: "10px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  cardTitle: { fontSize: "18px", color: "#2E4057", marginBottom: "8px" },
  cardDesc: { fontSize: "14px", color: "#666", marginBottom: "12px" },
  tag: { display: "inline-block", backgroundColor: "#e8f4f8", color: "#048A81", padding: "4px 10px", borderRadius: "12px", fontSize: "12px", marginBottom: "16px" },
  actions: { display: "flex", gap: "10px", marginBottom: "12px" },
  joinButton: { padding: "8px 16px", backgroundColor: "#2E4057", color: "white", borderRadius: "6px", textDecoration: "none", fontSize: "14px" },
  reviewButton: { padding: "8px 16px", backgroundColor: "transparent", color: "#2E4057", border: "1px solid #2E4057", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  reviewForm: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px", borderTop: "1px solid #eee", paddingTop: "12px" },
  input: { padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px" },
  textarea: { padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px", minHeight: "80px", resize: "vertical" },
  submitButton: { padding: "10px", backgroundColor: "#048A81", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
};

export default StudyGroups;