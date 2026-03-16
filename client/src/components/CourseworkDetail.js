import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CourseworkDetail({ user }) {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [coursework, setCoursework] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", pdf_data: null, pdf_filename: "" });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const isLecturer = user?.user_category === "lecturer";

  useEffect(() => {
    fetch(`/study_groups`)
      .then((r) => r.json())
      .then((groups) => {
        const found = groups.find((g) => g.study_group_id === parseInt(groupId));
        setGroup(found);
      });

    fetch(`/study_groups/${groupId}/coursework`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCoursework(data);
      });
  }, [groupId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        pdf_data: reader.result, // base64 data URL
        pdf_filename: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    fetch(`/study_groups/${groupId}/coursework`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setCoursework((prev) => [...prev, data]);
          setForm({ title: "", description: "", pdf_data: null, pdf_filename: "" });
          setShowForm(false);
        }
      });
  };

  const handleDelete = (id) => {
    fetch(`/coursework/${id}`, { method: "DELETE" }).then((r) => {
      if (r.ok) setCoursework((prev) => prev.filter((c) => c.coursework_id !== id));
    });
  };

  const openPdf = (pdfData, filename) => {
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = filename || "document.pdf";
    link.click();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.heading}>{group?.name || "Study Group"}</h2>
          {group?.course_name && <p style={styles.coursePill}>📚 {group.course_name}</p>}
          {group?.description && <p style={styles.description}>{group.description}</p>}
        </div>
        {isLecturer && (
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Coursework"}
          </button>
        )}
      </div>

      {/* Add coursework form */}
      {isLecturer && showForm && (
        <div style={styles.form}>
          <h3 style={styles.formTitle}>New Coursework</h3>
          {error && <p style={styles.error}>{error}</p>}
          <input
            style={styles.input}
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            style={styles.textarea}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div style={styles.fileRow}>
            <label style={styles.fileLabel}>
              📎 {form.pdf_filename || "Attach PDF"}
              <input type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFileChange} />
            </label>
          </div>
          <button style={styles.submitBtn} onClick={handleSubmit}>Upload Coursework</button>
        </div>
      )}

      {/* Coursework list */}
      <div style={styles.list}>
        {coursework.length === 0 ? (
          <p style={styles.empty}>No coursework added yet.</p>
        ) : (
          coursework.map((cw) => (
            <div key={cw.coursework_id} style={styles.card}>
              <div style={styles.cardLeft}>
                <h3 style={styles.cardTitle}>{cw.title}</h3>
                {cw.description && <p style={styles.cardDesc}>{cw.description}</p>}
                <p style={styles.cardMeta}>Added {new Date(cw.created_at).toLocaleDateString()}</p>
              </div>
              <div style={styles.cardActions}>
                {cw.pdf_data && (
                  <button
                    style={styles.downloadBtn}
                    onClick={() => openPdf(cw.pdf_data, cw.pdf_filename)}
                  >
                    ⬇ Download PDF
                  </button>
                )}
                {isLecturer && (
                  <button style={styles.deleteBtn} onClick={() => handleDelete(cw.coursework_id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: "800px", margin: "0 auto", padding: "40px 24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" },
  heading: { fontSize: "32px", color: "#2E4057", marginBottom: "8px", fontFamily: "'Playfair Display', serif" },
  coursePill: { display: "inline-block", backgroundColor: "#E8F4F3", color: "#048A81", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", marginBottom: "8px" },
  description: { fontSize: "15px", color: "#7A7670", marginTop: "8px" },
  addBtn: { padding: "10px 20px", backgroundColor: "#048A81", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap" },
  form: { backgroundColor: "white", borderRadius: "12px", padding: "24px", border: "1px solid #E8E4DD", marginBottom: "32px", display: "flex", flexDirection: "column", gap: "14px" },
  formTitle: { fontSize: "18px", color: "#2E4057", margin: 0 },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px" },
  textarea: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", minHeight: "80px" },
  fileRow: { display: "flex", alignItems: "center" },
  fileLabel: { padding: "10px 16px", backgroundColor: "#F0F4F8", border: "1px dashed #ccc", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#2E4057" },
  submitBtn: { padding: "12px", backgroundColor: "#2E4057", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", cursor: "pointer", fontWeight: "600" },
  error: { color: "red", fontSize: "13px" },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  empty: { color: "#aaa", textAlign: "center", marginTop: "40px" },
  card: { backgroundColor: "white", borderRadius: "12px", padding: "20px 24px", border: "1px solid #E8E4DD", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" },
  cardLeft: { flex: 1 },
  cardTitle: { fontSize: "17px", color: "#2E4057", marginBottom: "6px", fontFamily: "'Playfair Display', serif" },
  cardDesc: { fontSize: "14px", color: "#7A7670", marginBottom: "6px" },
  cardMeta: { fontSize: "12px", color: "#aaa" },
  cardActions: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" },
  downloadBtn: { padding: "8px 16px", backgroundColor: "#048A81", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  deleteBtn: { padding: "8px 16px", backgroundColor: "transparent", color: "#C0392B", border: "1px solid #E8E4DD", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
};

export default CourseworkDetail;