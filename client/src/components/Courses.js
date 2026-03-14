import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Courses({ user }) {
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courseGroups, setCourseGroups] = useState({});

  useEffect(() => {
    fetch(`/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const handleExpand = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }
    setExpandedCourse(courseId);
    if (!courseGroups[courseId]) {
      fetch(`/courses/${courseId}/study-groups`)
        .then((res) => res.json())
        .then((data) => setCourseGroups((prev) => ({ ...prev, [courseId]: data })));
    }
  };

  if (!courses.length) return <p style={styles.empty}>No courses found.</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Courses</h2>
      <div style={styles.list}>
        {courses.map((course) => (
          <div key={course.course_id} style={styles.card}>
            <div style={styles.courseRow}>
              <h3 style={styles.courseName}>{course.course_name}</h3>
              <button
                style={styles.expandButton}
                onClick={() => handleExpand(course.course_id)}
              >
                {expandedCourse === course.course_id ? "Hide Groups ▲" : "View Groups ▼"}
              </button>
            </div>

            {expandedCourse === course.course_id && (
              <div style={styles.groups}>
                {courseGroups[course.course_id] ? (
                  courseGroups[course.course_id].length === 0 ? (
                    <p style={styles.noGroups}>No study groups for this course yet.</p>
                  ) : (
                    courseGroups[course.course_id].map((group) => (
                      <div key={group.study_group_id} style={styles.groupItem}>
                        <span>{group.name}</span>
                        {user && (
                          <Link to="/memberships/new" style={styles.joinLink}>
                            Join
                          </Link>
                        )}
                      </div>
                    ))
                  )
                ) : (
                  <p style={styles.noGroups}>Loading...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "800px", margin: "0 auto", padding: "40px 24px" },
  heading: { fontSize: "28px", color: "#2E4057", marginBottom: "24px" },
  empty: { textAlign: "center", color: "#888", marginTop: "40px" },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: { backgroundColor: "white", borderRadius: "10px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
  courseRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  courseName: { fontSize: "18px", color: "#2E4057", margin: 0 },
  expandButton: { backgroundColor: "transparent", border: "1px solid #2E4057", color: "#2E4057", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  groups: { marginTop: "16px", borderTop: "1px solid #eee", paddingTop: "16px" },
  groupItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "#f5f7fa", borderRadius: "6px", marginBottom: "8px" },
  joinLink: { padding: "6px 14px", backgroundColor: "#048A81", color: "white", borderRadius: "6px", textDecoration: "none", fontSize: "13px" },
  noGroups: { color: "#888", fontSize: "14px" },
};

export default Courses;