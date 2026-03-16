import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Courses({ user }) {
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courseGroups, setCourseGroups] = useState({});
  const [memberships, setMemberships] = useState([]);
  const [coursework, setCoursework] = useState({});
  const [expandedCoursework, setExpandedCoursework] = useState(null);

  const isStudent = user?.user_category === "student";

  useEffect(() => {
    fetch(`/courses`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setCourses(data); });
  }, []);

  // Fetch student's memberships
  useEffect(() => {
    if (!isStudent) return;
    fetch(`/users/${user.user_id}/memberships`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setMemberships(data); });
  }, [user, isStudent]);

  const handleExpand = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }
    setExpandedCourse(courseId);
    if (!courseGroups[courseId]) {
      fetch(`/courses/${courseId}/study-groups`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data))
            setCourseGroups((prev) => ({ ...prev, [courseId]: data }));
        });
    }
  };

  const handleToggleCoursework = (groupId) => {
    if (expandedCoursework === groupId) {
      setExpandedCoursework(null);
      return;
    }
    setExpandedCoursework(groupId);
    if (!coursework[groupId]) {
      fetch(`/study_groups/${groupId}/coursework`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data))
            setCoursework((prev) => ({ ...prev, [groupId]: data }));
        });
    }
  };

  const openPdf = (pdfData, filename) => {
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = filename || "document.pdf";
    link.click();
  };

  const joinedGroupIds = new Set(memberships.map((m) => m.study_group_id));

  if (!courses.length) return <p style={styles.empty}>No courses found.</p>;

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h2 style={styles.heading}>Courses</h2>
        {isStudent && (
          <p style={styles.subtitle}>
            Your joined groups and their coursework are highlighted below.
          </p>
        )}
      </div>

      <div style={styles.list}>
        {courses.map((course) => {
          const groups = courseGroups[course.course_id] || [];
          const joinedInThisCourse = groups.filter((g) =>
            joinedGroupIds.has(g.study_group_id)
          );

          return (
            <div key={course.course_id} style={styles.card}>
              <div style={styles.courseRow}>
                <div>
                  <h3 style={styles.courseName}>{course.course_name}</h3>
                  {isStudent && expandedCourse === course.course_id && joinedInThisCourse.length > 0 && (
                    <span style={styles.joinedBadge}>
                      ✓ Joined {joinedInThisCourse.length} group{joinedInThisCourse.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <button
                  style={styles.expandButton}
                  onClick={() => handleExpand(course.course_id)}
                >
                  {expandedCourse === course.course_id ? "Hide Groups ▲" : "View Groups ▼"}
                </button>
              </div>

              {expandedCourse === course.course_id && (
                <div style={styles.groups}>
                  {!courseGroups[course.course_id] ? (
                    <p style={styles.noGroups}>Loading...</p>
                  ) : groups.length === 0 ? (
                    <p style={styles.noGroups}>No study groups for this course yet.</p>
                  ) : (
                    groups.map((group) => {
                      const isJoined = joinedGroupIds.has(group.study_group_id);
                      const cw = coursework[group.study_group_id] || [];

                      return (
                        <div
                          key={group.study_group_id}
                          style={{
                            ...styles.groupItem,
                            ...(isJoined ? styles.groupItemJoined : {}),
                          }}
                        >
                          <div style={styles.groupTop}>
                            <div style={styles.groupLeft}>
                              <span style={styles.groupName}>{group.name}</span>
                              {isJoined && (
                                <span style={styles.memberBadge}>✓ Joined</span>
                              )}
                            </div>

                            <div style={styles.groupActions}>
                              {/* Coursework toggle — only for joined students */}
                              {isStudent && isJoined && (
                                <button
                                  style={styles.cwBtn}
                                  onClick={() => handleToggleCoursework(group.study_group_id)}
                                >
                                  {expandedCoursework === group.study_group_id
                                    ? "Hide Coursework ▲"
                                    : "📄 View Coursework ▼"}
                                </button>
                              )}

                              {/* Join link — only for non-joined students */}
                              {isStudent && !isJoined && (
                                <Link to="/memberships/new" style={styles.joinLink}>
                                  Join
                                </Link>
                              )}

                              {/* Join link for logged-out users */}
                              {!user && (
                                <Link to="/memberships/new" style={styles.joinLink}>
                                  Join
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Coursework section */}
                          {isStudent && isJoined && expandedCoursework === group.study_group_id && (
                            <div style={styles.cwSection}>
                              {cw.length === 0 ? (
                                <p style={styles.noCw}>No coursework uploaded yet.</p>
                              ) : (
                                cw.map((item) => (
                                  <div key={item.coursework_id} style={styles.cwItem}>
                                    <div style={styles.cwLeft}>
                                      <span style={styles.cwTitle}>{item.title}</span>
                                      {item.description && (
                                        <span style={styles.cwDesc}>{item.description}</span>
                                      )}
                                      <span style={styles.cwDate}>
                                        Added {new Date(item.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    {item.pdf_data && (
                                      <button
                                        style={styles.downloadBtn}
                                        onClick={() => openPdf(item.pdf_data, item.pdf_filename)}
                                      >
                                        ⬇ Download
                                      </button>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "800px", margin: "0 auto", padding: "40px 24px" },
  pageHeader: { marginBottom: "28px" },
  heading: { fontSize: "32px", color: "#2E4057", marginBottom: "6px", fontFamily: "'Playfair Display', serif" },
  subtitle: { fontSize: "14px", color: "#7A7670" },
  empty: { textAlign: "center", color: "#888", marginTop: "40px" },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: { backgroundColor: "white", borderRadius: "10px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #E8E4DD" },
  courseRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  courseName: { fontSize: "18px", color: "#2E4057", margin: 0 },
  joinedBadge: { fontSize: "12px", color: "#048A81", fontWeight: "600", marginTop: "4px", display: "block" },
  expandButton: { backgroundColor: "transparent", border: "1px solid #2E4057", color: "#2E4057", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  groups: { marginTop: "16px", borderTop: "1px solid #eee", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" },
  groupItem: { padding: "12px 16px", backgroundColor: "#f5f7fa", borderRadius: "8px", border: "1px solid transparent" },
  groupItemJoined: { backgroundColor: "#EDF7F6", border: "1px solid #B2DFDB" },
  groupTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  groupLeft: { display: "flex", alignItems: "center", gap: "10px" },
  groupName: { fontSize: "14px", color: "#2E4057", fontWeight: "600" },
  memberBadge: { fontSize: "11px", backgroundColor: "#048A81", color: "white", padding: "2px 8px", borderRadius: "12px", fontWeight: "600" },
  groupActions: { display: "flex", gap: "8px", alignItems: "center" },
  joinLink: { padding: "6px 14px", backgroundColor: "#048A81", color: "white", borderRadius: "6px", textDecoration: "none", fontSize: "13px" },
  cwBtn: { padding: "6px 12px", backgroundColor: "transparent", border: "1px solid #048A81", color: "#048A81", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  cwSection: { marginTop: "12px", borderTop: "1px solid #C8E6E3", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" },
  cwItem: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", borderRadius: "6px", padding: "12px 14px", border: "1px solid #E8E4DD" },
  cwLeft: { display: "flex", flexDirection: "column", gap: "3px" },
  cwTitle: { fontSize: "14px", fontWeight: "600", color: "#2E4057" },
  cwDesc: { fontSize: "12px", color: "#7A7670" },
  cwDate: { fontSize: "11px", color: "#bbb" },
  downloadBtn: { padding: "7px 14px", backgroundColor: "#048A81", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" },
  noCw: { fontSize: "13px", color: "#aaa", textAlign: "center", padding: "8px" },
  noGroups: { color: "#888", fontSize: "14px" },
};

export default Courses;