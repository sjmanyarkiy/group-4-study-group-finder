import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home"
import Register from "./Register";
import Login from "./Login";


function App() {
  return (
    <div>
      <Navbar  />
      <Switch>
        <Route>
          <Home />
        </Route>
        <Route>
          <Login />
        </Route>
        <Route>
          <Register />
        </Route>
      </Switch>
    </div>
  )
}

export default App;
