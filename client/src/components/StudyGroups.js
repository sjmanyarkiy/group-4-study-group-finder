import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../api";

function StudyGroups({ user }) {
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState(null);
  const [reviewForm, setReviewForm] = useState({ studyGroupId: null, stars: 5, comment: "" });
  const [message, setMessage] = useState(null);
  const [filterCourse, setFilterCourse] = useState("all");

  useEffect(() => {
    fetch("/study_groups").then(r => r.json()).then(setGroups);
    fetch("/courses").then(r => r.json()).then(setCourses);
    fetch("/reviews").then(r => r.json()).then(setReviews);
  }, []);

  const getCourse = (courseId) => courses.find(c => c.course_id === courseId);
  const getGroupReviews = (id) => reviews.filter(r => r.study_group_id === id);
  const getAvg = (id) => {
    const gr = getGroupReviews(id);
    return gr.length ? (gr.reduce((s, r) => s + r.stars, 0) / gr.length).toFixed(1) : null;
  };

  const filtered = filterCourse === "all"
    ? groups
    : groups.filter(g => g.course_id === parseInt(filterCourse));

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
    }).then(res => {
      if (res.ok) {
        res.json().then(newReview => {
          setReviews(prev => [...prev, newReview]);
          setMessage("Review submitted! ✓");
          setReviewForm({ studyGroupId: null, stars: 5, comment: "" });
          setTimeout(() => setMessage(null), 3000);
        });
      } else {
        res.json().then(d => setMessage(d.error));
      }
    });
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Study Groups</h1>
        <p style={styles.pageSubtitle}>Find your community. Learn together.</p>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <span style={styles.filterLabel}>Filter by course:</span>
        <div style={styles.filters}>
          <button
            style={filterCourse === "all" ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilterCourse("all")}
          >
            All Groups
          </button>
          {courses.map(c => (
            <button
              key={c.course_id}
              style={filterCourse === String(c.course_id) ? styles.filterActive : styles.filterBtn}
              onClick={() => setFilterCourse(String(c.course_id))}
            >
              {c.course_name}
            </button>
          ))}
        </div>
      </div>

      {message && <div style={styles.toast}>{message}</div>}

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.stat}><span style={styles.statNum}>{groups.length}</span><span style={styles.statLabel}>Groups</span></div>
        <div style={styles.stat}><span style={styles.statNum}>{courses.length}</span><span style={styles.statLabel}>Courses</span></div>
        <div style={styles.stat}><span style={styles.statNum}>{reviews.length}</span><span style={styles.statLabel}>Reviews</span></div>
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {filtered.map(group => {
          const course = getCourse(group.course_id);
          const groupReviews = getGroupReviews(group.study_group_id);
          const avg = getAvg(group.study_group_id);

          return (
            <div key={group.study_group_id} style={styles.card}>
              {/* Course Banner */}
              {course && (
                <div style={styles.courseBanner}>
                  <span style={styles.courseLabel}>📚 {course.course_name}</span>
                </div>
              )}

              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{group.name}</h3>
                {group.subject && <span style={styles.subjectTag}>{group.subject}</span>}
                {group.description && <p style={styles.cardDesc}>{group.description}</p>}

                {/* Rating Summary */}
                <div style={styles.ratingRow}>
                  {avg ? (
                    <>
                      <span style={styles.stars}>{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</span>
                      <span style={styles.ratingText}>{avg} · {groupReviews.length} review{groupReviews.length !== 1 ? "s" : ""}</span>
                    </>
                  ) : (
                    <span style={styles.noRating}>No reviews yet</span>
                  )}
                </div>

                {/* Actions */}
                <div style={styles.actions}>
                  {user && (
                    <Link to="/memberships/new" style={styles.joinBtn}>Join Group</Link>
                  )}
                  <button
                    style={styles.ghostBtn}
                    onClick={() => setExpandedReviews(
                      expandedReviews === group.study_group_id ? null : group.study_group_id
                    )}
                  >
                    {expandedReviews === group.study_group_id ? "Hide Reviews" : `Reviews (${groupReviews.length})`}
                  </button>
                  {user && (
                    <button
                      style={styles.ghostBtn}
                      onClick={() => setReviewForm(prev => ({
                        ...prev,
                        studyGroupId: prev.studyGroupId === group.study_group_id ? null : group.study_group_id,
                      }))}
                    >
                      {reviewForm.studyGroupId === group.study_group_id ? "Cancel" : "✏️ Review"}
                    </button>
                  )}
                </div>

                {/* Reviews List */}
                {expandedReviews === group.study_group_id && (
                  <div style={styles.reviewsSection}>
                    {groupReviews.length === 0 ? (
                      <p style={styles.emptyReviews}>Be the first to leave a review!</p>
                    ) : (
                      groupReviews.map(r => (
                        <div key={r.review_id} style={styles.reviewCard}>
                          <div style={styles.reviewStars}>
                            {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
                          </div>
                          {r.comment && <p style={styles.reviewComment}>{r.comment}</p>}
                          <p style={styles.reviewDate}>{new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Review Form */}
                {reviewForm.studyGroupId === group.study_group_id && (
                  <form onSubmit={e => handleReviewSubmit(e, group.study_group_id)} style={styles.reviewForm}>
                    <label style={styles.formLabel}>Your Rating</label>
                    <select
                      value={reviewForm.stars}
                      onChange={e => setReviewForm({ ...reviewForm, stars: parseInt(e.target.value) })}
                      style={styles.select}
                    >
                      {[5, 4, 3, 2, 1].map(n => (
                        <option key={n} value={n}>{"★".repeat(n)} {n === 5 ? "— Excellent" : n === 4 ? "— Good" : n === 3 ? "— Average" : n === 2 ? "— Poor" : "— Terrible"}</option>
                      ))}
                    </select>
                    <label style={styles.formLabel}>Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      style={styles.textarea}
                      placeholder="Share your experience with this group..."
                    />
                    <button type="submit" style={styles.submitBtn}>Submit Review</button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" },
  pageHeader: { marginBottom: "32px" },
  pageTitle: { fontSize: "40px", color: "#2E4057", marginBottom: "8px" },
  pageSubtitle: { fontSize: "16px", color: "#7A7670" },
  filterBar: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", flexWrap: "wrap" },
  filterLabel: { fontSize: "13px", color: "#7A7670", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" },
  filters: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterBtn: { padding: "6px 16px", borderRadius: "20px", border: "1px solid #E8E4DD", backgroundColor: "white", cursor: "pointer", fontSize: "13px", color: "#2C2C2C" },
  filterActive: { padding: "6px 16px", borderRadius: "20px", border: "1px solid #048A81", backgroundColor: "#048A81", cursor: "pointer", fontSize: "13px", color: "white", fontWeight: "600" },
  toast: { backgroundColor: "#048A81", color: "white", padding: "12px 20px", borderRadius: "8px", marginBottom: "24px", fontWeight: "500" },
  statsRow: { display: "flex", gap: "24px", marginBottom: "40px" },
  stat: { display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "white", padding: "20px 32px", borderRadius: "10px", border: "1px solid #E8E4DD" },
  statNum: { fontSize: "32px", fontWeight: "700", color: "#2E4057", fontFamily: "'Playfair Display', serif" },
  statLabel: { fontSize: "12px", color: "#7A7670", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" },
  card: { backgroundColor: "white", borderRadius: "12px", border: "1px solid #E8E4DD", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  courseBanner: { backgroundColor: "#2E4057", padding: "10px 20px" },
  courseLabel: { color: "rgba(255,255,255,0.9)", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" },
  cardBody: { padding: "20px" },
  cardTitle: { fontSize: "20px", color: "#2E4057", marginBottom: "8px" },
  subjectTag: { display: "inline-block", backgroundColor: "#E8F4F0", color: "#048A81", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" },
  cardDesc: { fontSize: "14px", color: "#7A7670", lineHeight: "1.6", marginBottom: "16px" },
  ratingRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" },
  stars: { color: "#E8A838", fontSize: "16px", letterSpacing: "2px" },
  ratingText: { fontSize: "13px", color: "#7A7670" },
  noRating: { fontSize: "13px", color: "#bbb" },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" },
  joinBtn: { padding: "8px 16px", backgroundColor: "#2E4057", color: "white", borderRadius: "6px", textDecoration: "none", fontSize: "13px", fontWeight: "600" },
  ghostBtn: { padding: "8px 14px", backgroundColor: "transparent", color: "#2E4057", border: "1px solid #E8E4DD", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  reviewsSection: { marginTop: "16px", borderTop: "1px solid #E8E4DD", paddingTop: "16px" },
  reviewCard: { backgroundColor: "#FAF8F5", borderRadius: "8px", padding: "12px", marginBottom: "8px" },
  reviewStars: { color: "#E8A838", fontSize: "14px", marginBottom: "4px" },
  reviewComment: { fontSize: "13px", color: "#555", lineHeight: "1.5", marginBottom: "4px" },
  reviewDate: { fontSize: "11px", color: "#bbb" },
  emptyReviews: { fontSize: "13px", color: "#bbb", textAlign: "center", padding: "12px" },
  reviewForm: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px", borderTop: "1px solid #E8E4DD", paddingTop: "16px" },
  formLabel: { fontSize: "12px", fontWeight: "600", color: "#7A7670", textTransform: "uppercase", letterSpacing: "0.5px" },
  select: { padding: "10px", borderRadius: "6px", border: "1px solid #E8E4DD", fontSize: "14px", backgroundColor: "white" },
  textarea: { padding: "10px", borderRadius: "6px", border: "1px solid #E8E4DD", fontSize: "14px", minHeight: "90px", resize: "vertical", fontFamily: "'DM Sans', sans-serif" },
  submitBtn: { padding: "10px", backgroundColor: "#048A81", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
};

export default StudyGroups;