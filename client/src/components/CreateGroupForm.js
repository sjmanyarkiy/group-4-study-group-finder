import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function CreateGroupForm({ user, courses }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject: "",
    course_id: "",
  });
  const [error, setError] = useState(null);

  // Redirect non-lecturers away
  useEffect(() => {
    if (!user || user.user_category !== "lecturer") {
      history.push("/");
    }
  }, [user, history]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/study_groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, course_id: parseInt(formData.course_id) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          history.push("/groups");
        }
      });
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Create a Study Group</h2>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.form}>
        <input style={styles.input} name="name" placeholder="Group name" value={formData.name} onChange={handleChange} />
        <input style={styles.input} name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} />
        <textarea style={styles.textarea} name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <select style={styles.input} name="course_id" value={formData.course_id} onChange={handleChange}>
          <option value="">Select a course</option>
          {courses.map((c) => (
            <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
          ))}
        </select>
        <button style={styles.button} onClick={handleSubmit}>Create Group</button>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "600px", margin: "0 auto", padding: "40px 24px" },
  heading: { fontSize: "28px", color: "#2E4057", marginBottom: "24px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px" },
  textarea: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", minHeight: "100px" },
  button: { padding: "12px", backgroundColor: "#048A81", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", cursor: "pointer" },
  error: { color: "red", fontSize: "14px" },
};

export default CreateGroupForm;