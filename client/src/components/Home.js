import React from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom'

function Home( { user }) {
  return (
    <div style={styles.container}>
      { user ? (
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome back, {user.name}!</h1>
          <p style={styles.subtitle}>
            You are logged in as a <strong>{ user.user_category}</strong>
          </p>
          <p style={styles.description}>
            Browse and join study groups, access course content, and connect with
            fellow {user.user_category === "lecturer" ? "students" : "learners"}.
          </p>
          <Link to="/groups" style={styles.primaryButton}>
            import React from 'react';
            import PropTypes from 'prop-types';
            import Header from './Header';
            import CourseList from './CourseList';
            import Footer from './Footer';
            import { Link } from 'react-router-dom';

            const Home = ({ user, courses }) => (
              <main className="home-page">
                <Header title="LetsStudy!" subtitle="Find study groups by course" />

                {user && (
                  <section className="welcome-banner">
                    <h2>Welcome back, {user.name}!</h2>
                    <p>
                      You are logged in as <strong>{user.user_category}</strong>. Browse and
                      join study groups, access course content, and connect with others.
                    </p>
                    <Link to="/memberships" className="primary-button">My Memberships</Link>
                  </section>
                )}

                <CourseList courses={courses} />
                <Footer />
              </main>
            );

            Home.propTypes = {
              user: PropTypes.object,
              courses: PropTypes.arrayOf(PropTypes.object),
            };

            Home.defaultProps = {
              user: null,
              courses: [],
            };

            export default Home;

