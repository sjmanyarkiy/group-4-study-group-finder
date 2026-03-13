import React from 'react';
import PropTypes from 'prop-types';

const CourseCard = ({ courseName, course_name }) => (
  <article style={styles.card}>
    <h3 style={styles.title}>{courseName || course_name}</h3>
  </article>
);

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px 24px",
    border: "1px solid #E8E4DD",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  title: {
    fontSize: "16px",
    color: "#2E4057",
    margin: 0,
    fontFamily: "'Playfair Display', serif",
  },
};

CourseCard.propTypes = {
  courseName: PropTypes.string,
  course_name: PropTypes.string,
};

export default CourseCard;