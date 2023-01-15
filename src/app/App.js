import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import Users from "./layouts/users";
import Login from "./layouts/login";
import Main from "./layouts/main";
import NavBar from "./components/ui/navBar";
import AuthProvider from "./hooks/useAuth";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/common/protectedRoute";
import LogOut from "./layouts/logOut";
import { loadQualitiesList } from "./store/qualities";
import { useDispatch } from "react-redux";
import { loadProfessionsList } from "./store/professions";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadQualitiesList());
    dispatch(loadProfessionsList());
  }, []);

  return (
    <div>
      <AuthProvider>
        <NavBar />
        <Switch>
          <ProtectedRoute path="/users/:userId?/:edit?" component={Users} />
          <Route path="/login/:type?" component={Login} />
          <Route path="/logout" component={LogOut} />
          <Route path="/" exact component={Main} />
          <Redirect to="/" />
        </Switch>
      </AuthProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
