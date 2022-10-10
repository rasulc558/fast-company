import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Users from "./layouts/users";
import Login from "./layouts/login";
import Main from "./layouts/main";
import NavBar from "./components/ui/navBar";
import EditUserList from "./components/common/page/userPage/editUserList";

function App() {
  return (
    <div>
      <NavBar />
      <Switch>
        {/* ДЗ */}
        <Route exact path="/users/:userId?/edit" component={EditUserList} />

        <Route path="/users/:userId?" component={Users} />
        <Route path="/login/:type?" component={Login} />
        <Route path="/" exact component={Main} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
