import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import userServices from "../services/user.services";
import { toast } from "react-toastify";
import localsStorageService, {
  setToken
} from "../services/localStorage.services";
import { useHistory } from "react-router-dom";

export const httpAuth = axios.create({
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
  const [currentUser, setCurrentUser] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const history = useHistory();

  async function signIn({ email, password }) {
    try {
      const { data } = await httpAuth.post("accounts:signInWithPassword", {
        email,
        password,
        returnSecureToken: true
      });

      setToken(data);

      await getUserData();
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

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async function signUp({ email, password, ...rest }) {
    try {
      const { data } = await httpAuth.post("accounts:signUp", {
        email,
        password,
        returnSecureToken: true
      });

      setToken(data);

      await createUser({
        _id: data.localId,
        email,
        rate: randomInt(1, 5),
        completedMeetings: randomInt(0, 200),
        image: `https://avatars.dicebear.com/api/avataaars/${(Math.random() + 1)
          .toString(36)
          .substring(7)}.svg`,
        ...rest
      });

      getUserData();
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
      // setCurrentUser(content);
      console.log("createUser", content);
    } catch (error) {
      errorCatcher(error);
    }
  }

  function logOut() {
    localsStorageService.removeAuthData();
    setCurrentUser(null);
    history.push("/");
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

  async function getUserData() {
    try {
      const { content } = await userServices.getCurrentUser();
      setCurrentUser(content);
    } catch (error) {
      errorCatcher(error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (localsStorageService.getAccessToken()) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signUp, logOut, currentUser }}>
      {!isLoading ? children : "loading"}
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
