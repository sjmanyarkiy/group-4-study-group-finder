import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import Navbar from "./Navbar";
import MembershipForm from "./MembershipForm";
import Memberships from "./Memberships";
import StudyGroups from "./StudyGroups";
import Courses from "./Courses";
import CreateGroupForm from './CreateGroupForm'

// const mockCourses = [
//   { courseId: 1, courseName: 'Intro to Algorithms' },
//   { courseId: 2, courseName: 'Databases 101' },
// ];

function App() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`/check_session`).then((res) => {
      if (res.ok) res.json().then((data) => setUser(data));
    });
    fetch(`/courses`)
    .then((r) => r.json())
    .then(setCourses);
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => {
    fetch(`/logout`, { method: "DELETE" }).then(() => setUser(null));
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <Switch>
        <Route exact path="/">
          <Home user={user} courses={courses} />
        </Route>
        <Route path="/login">
          <Login onLogin={handleLogin} />
        </Route>
        <Route path="/register">
          <Register onLogin={handleLogin} />
        </Route>
        <Route path="/memberships/new">
          <MembershipForm user={user} />
        </Route>
        <Route path="/memberships">
          <Memberships user={user} />
        </Route>
        <Route path="/groups/new">
          <CreateGroupForm user={user} courses={courses} />
        </Route>
        <Route path="/groups">
          <StudyGroups user={user} />
        </Route>
        <Route path="/courses">
          <Courses user={user} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;