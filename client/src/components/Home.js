import React from 'react';
import { Link } from 'react-router-dom';
import CourseList from './CourseList';
import Footer from './Footer';

function Home({ user, courses }) {
  const isLecturer = user?.user_category === 'lecturer';
  const isStudent = user?.user_category === 'student';

  return (
    <div style={styles.page}>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          {isLecturer && (
            <>
              <p style={styles.heroEyebrow}>Lecturer Dashboard</p>
              <h1 style={styles.heroTitle}>Welcome, {user.name.split(" ")[0]} 👋</h1>
              <p style={styles.heroSub}>
                Manage your study groups, track memberships, and support your students.
              </p>
              <div style={styles.heroButtons}>
                <Link to="/groups/new" style={styles.primaryBtn}>+ Create Study Group</Link>
                <Link to="/groups" style={styles.ghostBtn}>View All Groups</Link>
              </div>
            </>
          )}

          {isStudent && (
            <>
              <p style={styles.heroEyebrow}>Welcome back 👋</p>
              <h1 style={styles.heroTitle}>{user.name}</h1>
              <p style={styles.heroSub}>
                Ready to keep learning? Browse groups and connect with fellow students.
              </p>
              <div style={styles.heroButtons}>
                <Link to="/groups" style={styles.primaryBtn}>Browse Study Groups</Link>
                <Link to="/memberships" style={styles.ghostBtn}>My Memberships</Link>
              </div>
            </>
          )}

          {!user && (
            <>
              <p style={styles.heroEyebrow}>Your study community</p>
              <h1 style={styles.heroTitle}>Learn better,<br />together.</h1>
              <p style={styles.heroSub}>
                LetsStudy connects students and lecturers through focused study groups — find yours today.
              </p>
              <div style={styles.heroButtons}>
                <Link to="/register" style={styles.primaryBtn}>Get Started</Link>
                <Link to="/login" style={styles.ghostBtn}>Log In</Link>
              </div>
            </>
          )}
        </div>

        <div style={styles.statRow}>
          <div style={styles.statPill}>📚 Multiple Courses</div>
          <div style={styles.statPill}>👥 Active Study Groups</div>
          <div style={styles.statPill}>⭐ Peer Reviews</div>
        </div>
      </div>

      {/* Lecturer quick actions */}
      {isLecturer && (
        <div style={styles.section}>
          <div style={styles.sectionInner}>
            <h2 style={styles.sectionTitle}>Quick Actions</h2>
            <div style={styles.featureGrid}>
              <Link to="/groups/new" style={styles.actionCard}>
                <span style={styles.featureIcon}>➕</span>
                <h3 style={styles.featureHeading}>Create a Group</h3>
                <p style={styles.featureText}>Start a new study group and link it to a course.</p>
              </Link>
              <Link to="/groups" style={styles.actionCard}>
                <span style={styles.featureIcon}>👥</span>
                <h3 style={styles.featureHeading}>View All Groups</h3>
                <p style={styles.featureText}>See all active study groups across courses.</p>
              </Link>
              <Link to="/courses" style={styles.actionCard}>
                <span style={styles.featureIcon}>📚</span>
                <h3 style={styles.featureHeading}>Browse Courses</h3>
                <p style={styles.featureText}>Explore available courses and their study groups.</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Student quick actions */}
      {isStudent && (
        <div style={styles.section}>
          <div style={styles.sectionInner}>
            <h2 style={styles.sectionTitle}>What would you like to do?</h2>
            <div style={styles.featureGrid}>
              <Link to="/groups" style={styles.actionCard}>
                <span style={styles.featureIcon}>🔍</span>
                <h3 style={styles.featureHeading}>Find a Group</h3>
                <p style={styles.featureText}>Browse all available study groups and join one that fits your goals.</p>
              </Link>
              <Link to="/memberships" style={styles.actionCard}>
                <span style={styles.featureIcon}>📋</span>
                <h3 style={styles.featureHeading}>My Memberships</h3>
                <p style={styles.featureText}>Track the groups you've joined and manage your memberships.</p>
              </Link>
              <Link to="/courses" style={styles.actionCard}>
                <span style={styles.featureIcon}>📚</span>
                <h3 style={styles.featureHeading}>Browse Courses</h3>
                <p style={styles.featureText}>Explore courses and find study groups by subject.</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Why LetsStudy (logged out only) */}
      {!user && (
        <div style={styles.section}>
          <div style={styles.sectionInner}>
            <h2 style={styles.sectionTitle}>Why LetsStudy?</h2>
            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>🎓</span>
                <h3 style={styles.featureHeading}>Join Study Groups</h3>
                <p style={styles.featureText}>Find groups for your course and connect with fellow learners.</p>
              </div>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>⭐</span>
                <h3 style={styles.featureHeading}>Rate & Review</h3>
                <p style={styles.featureText}>Share your experience and help others find the best groups.</p>
              </div>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>🏫</span>
                <h3 style={styles.featureHeading}>Connect Institutions</h3>
                <p style={styles.featureText}>Study groups linked to real institutions at your university.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <div style={styles.coursesSection}>
        <div style={styles.sectionInner}>
          <div style={styles.coursesSectionHeader}>
            <h2 style={styles.sectionTitle}>Available Courses</h2>
            <Link to="/courses" style={styles.viewAllLink}>View all courses →</Link>
          </div>
          <CourseList courses={courses} />
        </div>
      </div>

      {/* CTA (logged out only) */}
      {!user && (
        <div style={styles.cta}>
          <h2 style={styles.ctaTitle}>Ready to start learning?</h2>
          <p style={styles.ctaSub}>Join hundreds of students already studying smarter.</p>
          <Link to="/register" style={styles.ctaBtn}>Create a Free Account</Link>
        </div>
      )}

      <Footer />
    </div>
  );
}

const styles = {
  page: { backgroundColor: "#FAF8F5", minHeight: "100vh" },
  hero: { backgroundColor: "#2E4057", padding: "80px 24px 48px", textAlign: "center" },
  heroInner: { maxWidth: "680px", margin: "0 auto 48px" },
  heroEyebrow: { fontSize: "13px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", color: "#048A81", marginBottom: "16px" },
  heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: "52px", fontWeight: "700", color: "white", lineHeight: "1.15", marginBottom: "20px" },
  heroSub: { fontSize: "18px", color: "rgba(255,255,255,0.75)", lineHeight: "1.6", marginBottom: "36px" },
  heroButtons: { display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" },
  primaryBtn: { padding: "14px 32px", backgroundColor: "#048A81", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: "600" },
  ghostBtn: { padding: "14px 32px", backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "15px" },
  badge: { backgroundColor: "rgba(4,138,129,0.2)", color: "#48D1CC", padding: "2px 10px", borderRadius: "20px", fontSize: "14px", fontWeight: "600" },
  statRow: { display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", maxWidth: "680px", margin: "0 auto" },
  statPill: { backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", padding: "8px 20px", borderRadius: "20px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.12)" },
  section: { padding: "72px 24px", backgroundColor: "white" },
  coursesSection: { padding: "72px 24px", backgroundColor: "#FAF8F5" },
  sectionInner: { maxWidth: "1000px", margin: "0 auto" },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: "32px", color: "#2E4057", marginBottom: "40px" },
  coursesSectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  viewAllLink: { fontSize: "14px", color: "#048A81", textDecoration: "none", fontWeight: "600" },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" },
  featureCard: { backgroundColor: "#FAF8F5", borderRadius: "12px", padding: "32px 24px", border: "1px solid #E8E4DD" },
  actionCard: { backgroundColor: "#FAF8F5", borderRadius: "12px", padding: "32px 24px", border: "1px solid #E8E4DD", textDecoration: "none", display: "block", transition: "border-color 0.2s" },
  featureIcon: { fontSize: "32px", display: "block", marginBottom: "16px" },
  featureHeading: { fontSize: "18px", color: "#2E4057", marginBottom: "10px", fontFamily: "'Playfair Display', serif" },
  featureText: { fontSize: "14px", color: "#7A7670", lineHeight: "1.7" },
  cta: { backgroundColor: "#048A81", padding: "72px 24px", textAlign: "center" },
  ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "white", marginBottom: "12px" },
  ctaSub: { fontSize: "16px", color: "rgba(255,255,255,0.8)", marginBottom: "32px" },
  ctaBtn: { display: "inline-block", padding: "14px 36px", backgroundColor: "white", color: "#048A81", borderRadius: "8px", textDecoration: "none", fontSize: "15px", fontWeight: "700" },
};

export default Home;