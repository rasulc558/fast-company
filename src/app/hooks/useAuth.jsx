import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import userServices from "../services/user.services";
import { toast } from "react-toastify";
import { setToken } from "../services/localStorage.services";

const httpAuth = axios.create();

const AuthContext = React.createContext();

export const useAuth = () => {
  return React.useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  console.log(process.env.REACT_APP_FIREBASE_KEY);

  const [currentUser, setCurrentUser] = React.useState({});
  const [error, setError] = React.useState(null);

  async function signIn({ email, password }) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_KEY}`;

    try {
      const { data } = await httpAuth.post(url, {
        email,
        password,
        returnSecureToken: true
      });

      setToken(data);
      console.log("signIn", data);
    } catch (error) {
      errorCatcher(error);

      // const { code, message } = error.response.data.error;
      console.log("sign In error useAuth ", error);
    }
  }

  async function signUp({ email, password, ...rest }) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`;

    try {
      const { data } = await httpAuth.post(url, {
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
