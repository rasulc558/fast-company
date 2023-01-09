import React from "react";
import { useAuth } from "../hooks/useAuth";

const LogOut = () => {
  const { logOut } = useAuth();

  React.useEffect(() => {
    logOut();
  }, []);

  return <h1>loading</h1>;
};

export default LogOut;