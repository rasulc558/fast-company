import { createAction, createSlice } from "@reduxjs/toolkit";
import authServices from "../services/auth.services";
import localsStorageService from "../services/localStorage.services";
import userServices from "../services/user.services";
import randomInt from "../utils/getRandomInt";
import history from "../utils/history";

const initialState = localsStorageService.getAccessToken()
  ? {
      entities: null,
      isLoading: true,
      error: null,
      auth: { userId: localsStorageService.getUserId() },
      isLoggedIn: true,
      dataLoaded: false
    }
  : {
      entities: null,
      isLoading: false,
      error: null,
      auth: null,
      isLoggedIn: false,
      dataLoaded: false
    };

const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    usersRequested(state) {
      state.isLoading = true;
    },
    usersRecieved(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
      state.dataLoaded = true;
    },
    usersRequestFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    authRequestSuccess(state, action) {
      // state.push(action.payload);
      state.auth = action.payload;
      state.isLoggedIn = true;
    },
    authRequestFailed(state, action) {
      state.error = action.payload;
    },
    userCreated(state, action) {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      }
      state.entities.push(action.payload);
    },
    userLogedOut(state) {
      state.entities = null;
      state.isLoggedIn = false;
      state.auth = null;
    }
  }
});

const { actions, reducer: usersReducer } = usersSlice;
const {
  usersRecieved,
  usersRequestFailed,
  usersRequested,

  authRequestFailed,
  userCreated,
  authRequestSuccess,
  userLogedOut
} = actions;

// auth block
const authRequested = createAction("users/authRequested");
const userCreateRequested = createAction("users/userCreateRequested");
const createUserFailed = createAction("users/createUserFailed");

export const logIn =
  ({ data, redirect }) =>
  async (dispatch) => {
    const { email, password } = data;
    dispatch(authRequested());
    try {
      const data = await authServices.logIn({ email, password });

      dispatch(authRequestSuccess({ userId: data.localId }));
      localsStorageService.setToken(data);
      history.push(redirect);
    } catch (error) {
      dispatch(authRequestFailed(error.message));
    }
  };

export const logOut = () => (dispatch) => {
  localsStorageService.removeAuthData();
  dispatch(userLogedOut());

  history.push("/");
};

export const signUp =
  ({ email, password, ...rest }) =>
  async (dispatch) => {
    dispatch(authRequested());

    try {
      const data = await authServices.registr({ email, password });

      await localsStorageService.setToken(data);

      dispatch(
        authRequestSuccess({
          userId: data.localId
        })
      );

      dispatch(
        createUser({
          _id: data.localId,
          email,
          rate: randomInt(1, 5),
          completedMeetings: randomInt(0, 200),
          image: `https://avatars.dicebear.com/api/avataaars/${(
            Math.random() + 1
          )
            .toString(36)
            .substring(7)}.svg`,
          ...rest
        })
      );
    } catch (error) {
      dispatch(authRequestFailed(error.message));
    }
  };

function createUser(payload) {
  return async function (dispatch) {
    dispatch(userCreateRequested());
    try {
      const { content } = await userServices.create(payload);
      dispatch(userCreated(content));
      history.push("users");
    } catch (error) {
      dispatch(createUserFailed(error.message));
    }
  };
}

// Users
export const loadUsersList = () => async (dispatch) => {
  dispatch(usersRequested());
  try {
    const { content } = await userServices.get();
    dispatch(usersRecieved(content));
  } catch (error) {
    dispatch(usersRequestFailed(error.message));
  }
};

// selectors

export const getUserById = (userId) => (store) => {
  if (store.users.entities) {
    return store.users.entities.find((user) => user._id === userId);
  }
};

export const getUsers = () => (store) => {
  if (store.users.entities) {
    return store.users.entities;
  }
};

export const getIsLoggedIn = () => (store) => {
  return store.users.isLoggedIn;
};

export const getDataStatus = () => (store) => store.users.dataLoaded;

export const getCurrentUserData = () => (store) => {
  return store.users.entities
    ? store.users.entities.find((user) => user._id === store.users.auth.userId)
    : null;
};

export const getCurrentUserId = () => (store) => store.users.auth?.userId;
export const getUsersLoadingStatus = () => (store) => store.users.isLoading;

export default usersReducer;
