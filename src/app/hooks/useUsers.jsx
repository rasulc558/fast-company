import React, { useState } from "react";
import PropTypes from "prop-types";
import userServices from "../services/user.services";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  async function getUsers() {
    try {
      const { content } = await userServices.get();
      setUsers(content);
      setLoading(false);
    } catch (error) {
      errorCatcher(error);
    }
  }

  function errorCatcher(error) {
    const { message } = error.response.data;
    setError(message);
  }

  React.useEffect(() => {
    if (!isLoading) {
      const newUsers = [...users];
      const indexUser = newUsers.findIndex((u) => u._id === currentUser._id);
      newUsers[indexUser] = currentUser;
      setUsers(newUsers);
    }
  }, [currentUser]);

  React.useEffect(() => {
    getUsers();
  }, []);

  React.useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  function getUserById(userId) {
    return users.find((user) => user._id === userId);
  }

  return (
    <UserContext.Provider value={{ users, getUserById }}>
      {!isLoading ? children : "loading"}
    </UserContext.Provider>
  );
};

export const useUsers = () => React.useContext(UserContext);

UserProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default UserProvider;
