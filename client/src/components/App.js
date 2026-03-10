import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home"
import Register from "./Register";
import Login from "./Login";
import Navbar from "./Navbar"


function App() {
  const [ user, setUser ] = useState(null);

  useEffect(() => {
    fetch("/check_session").then((res) => {
      if (res.ok) {
        res.json().then((data) => setUser(data));
      }
    });
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => {
    fetch("/logout", { method : "DELETE" })
    .then(() => setUser(null))
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <Switch>
        <Route exact path="/">
          <Home user={user}/>
        </Route>
        <Route path="/login">
          <Login onLogin={handleLogin}/>
        </Route>
        <Route path="/register">
          <Register onLogin={handleLogin}/>
        </Route>
      </Switch>
    </div>
  )
}

export default App;
