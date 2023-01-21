import React from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../store/users";

const LogOut = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(logOut());
  }, []);

  return <h1>loading</h1>;
};

export default LogOut;
