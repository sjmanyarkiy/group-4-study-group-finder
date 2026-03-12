import React from 'react';
import { Link } from 'react-router-dom';
import CourseList from './CourseList';
import Header from './Header';
import Footer from './Footer';

function Home({ user, courses }) {
  return (
    <div style={styles.container}>
      {user ? (
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome back, {user.name}!</h1>
          <p style={styles.subtitle}>
            You are logged in as a <strong>{user.user_category}</strong>
          </p>
          <p style={styles.description}>
            Browse and join study groups, access course content, and connect with
            fellow {user.user_category === "lecturer" ? "students" : "learners"}.
          </p>
          <Link to="/groups" style={styles.primaryButton}>
            Browse Study Groups →
          </Link>
          <div style={styles.courseSection}>
            <Header title="Available Courses" subtitle="Find study groups by course" />
            <CourseList courses={courses} />
          </div>
        </div>
      ) : (
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome to LetsStudy! 📚</h1>
          <p style={styles.description}>
            A platform for students and lecturers to connect, collaborate, and
            learn together. Join study groups, access course content, and track
            your progress.
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.icon}>🎓</span>
              <p>Join study groups for Python, JavaScript and more</p>
            </div>
            <div style={styles.feature}>
              <span style={styles.icon}>⭐️</span>
              <p>Rate and review your learning experience in each group</p>
            </div>
            <div style={styles.feature}>
              <span style={styles.icon}>🏫</span>
              <p>Connect with institutions and fellow students</p>
            </div>
          </div>
          <div style={styles.buttons}>
            <Link to="/register" style={styles.primaryButton}>
              Get Started
            </Link>
            <Link to="/login" style={styles.secondaryButton}>
              Login
            </Link>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    padding: "20px",
    backgroundColor: "#f5f7fa",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "48px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    color: "#2E4057",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "16px",
  },
  description: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "32px",
  },
  features: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "32px",
  },
  feature: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    borderRadius: "8px",
    padding: "16px",
    fontSize: "14px",
    color: "#444",
  },
  icon: {
    fontSize: "28px",
    display: "block",
    marginBottom: "8px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
  },
  primaryButton: {
    display: "inline-block",
    padding: "12px 28px",
    backgroundColor: "#2E4057",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
  },
  secondaryButton: {
    display: "inline-block",
    padding: "12px 28px",
    backgroundColor: "transparent",
    color: "#2E4057",
    border: "2px solid #2E4057",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
  },
  courseSection: {
    marginTop: "32px",
    textAlign: "left",
  },
};

export default Home;