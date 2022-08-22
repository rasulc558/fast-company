import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/navBar";
import User from "./components/user";
import Login from "./layouts/login";
import Main from "./layouts/main";
import Users from "./layouts/users";

function App() {
  return (
    <div>
      <Navbar />

      <Switch>
        <Route exact path="/users" component={Users} />
        <Route path="/users/:id?" component={User} />
        <Route path="/main" component={Main} />
        <Route path="/login" component={Login} />
      </Switch>
    </div>
  );
}

export default App;
