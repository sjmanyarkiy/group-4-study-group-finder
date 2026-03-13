import React from 'react';
import PropTypes from 'prop-types';
import CourseCard from './CourseCard';

const CourseList = ({ courses = [] }) => (
  <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
    {courses.map((c) => (
      <CourseCard key={c.course_id || c.courseId} {...c} />
    ))}
  </section>
);

CourseList.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.object),
};

export default CourseList;
