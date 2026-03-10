import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home"
import Register from "./Register";
import Login from "./Login";
import Navbar from "./Navbar"


function App() {
  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <Switch>
        <Route>
          <Home user={user}/>
        </Route>
        <Route>
          <Login onLogin={handleLogin}/>
        </Route>
        <Route>
          <Register onLogout={handleLogin}/>
        </Route>
      </Switch>
    </div>
  )
}

export default App;
