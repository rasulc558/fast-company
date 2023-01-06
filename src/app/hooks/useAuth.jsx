import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import userServices from "../services/user.services";
import { toast } from "react-toastify";
import { setToken } from "../services/localStorage.services";

const httpAuth = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/",
  params: {
    key: process.env.REACT_APP_FIREBASE_KEY
  }
});

const AuthContext = React.createContext();

export const useAuth = () => {
  return React.useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState({});
  const [error, setError] = React.useState(null);

  async function signIn({ email, password }) {
    try {
      const { data } = await httpAuth.post("accounts:signInWithPassword", {
        email,
        password,
        returnSecureToken: true
      });

      setToken(data);
      console.log("signIn", data);
    } catch (error) {
      errorCatcher(error);

      const { code, message } = error.response.data.error;

      if (code === 400) {
        switch (message) {
          case "INVALID_PASSWORD":
            throw new Error("Email или пароль введены некорректно");
          default:
            throw new Error("Слишком много попыток входа. Попробуйте позже");
        }
      }
    }
  }

  async function signUp({ email, password, ...rest }) {
    try {
      const { data } = await httpAuth.post("accounts:signUp", {
        email,
        password,
        returnSecureToken: true
      });

      setToken(data);
      await createUser({ _id: data.localId, email, ...rest });
      console.log("useAuth", data);
    } catch (error) {
      errorCatcher(error);

      const { code, message } = error.response.data.error;

      if (code === 400) {
        if (message === "EMAIL_EXISTS") {
          const errorObjest = { email: "Email c таким именем уже существует" };
          throw errorObjest;
        }
      }
    }
  }

  async function createUser(data) {
    try {
      const { content } = await userServices.create(data);
      setCurrentUser(content);
    } catch (error) {
      errorCatcher(error);
    }
  }

  function errorCatcher(error) {
    const { message } = error.response.data;
    setError(message);
  }

  React.useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  return (
    <AuthContext.Provider value={{ signIn, signUp, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default AuthProvider;
