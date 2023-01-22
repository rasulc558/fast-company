import { createAction, createSlice } from "@reduxjs/toolkit";
import authServices from "../services/auth.services";
import localsStorageService from "../services/localStorage.services";
import userServices from "../services/user.services";
import { generateAuthError } from "../utils/generateAuthErrors";
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
    usersRequested: (state) => {
      state.isLoading = true;
    },
    usersRecieved: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
      state.dataLoaded = true;
    },
    usersRequestFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    authRequestSuccess: (state, action) => {
      // state.push(action.payload);
      state.auth = action.payload;
      state.isLoggedIn = true;
    },
    authRequested: (state) => {
      state.error = null;
    },
    authRequestFailed: (state, action) => {
      state.error = action.payload;
    },
    userCreated: (state, action) => {
      if (!Array.isArray(state.entities)) {
        state.entities = [];
      }
      state.entities.push(action.payload);
    },
    userLogedOut: (state) => {
      state.entities = null;
      state.isLoggedIn = false;
      state.auth = null;
    },
    userUpdateSuccessed: (state, action) => {
      state.entities[
        state.entities.findIndex((u) => u._id === action.payload._id)
      ] = action.payload;
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
  userLogedOut,
  userUpdateSuccessed,
  authRequested
} = actions;

// auth block
const userCreateRequested = createAction("users/userCreateRequested");
const createUserFailed = createAction("users/createUserFailed");
const userUpdateFailed = createAction("users/userUpdateFailed");
const userUpdateRequested = createAction("users/userUpdateRequested");

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
      const { code, message } = error.response.data.error;
      if (code === 400) {
        const errorMessage = generateAuthError(message);
        dispatch(authRequestFailed(errorMessage));
      } else {
        dispatch(authRequestFailed(error.message));
      }
    }
  };

export const logOut = () => (dispatch) => {
  localsStorageService.removeAuthData();
  dispatch(userLogedOut());

  history.push("/");
};

export const updateUserData = (data) => async (dispatch) => {
  dispatch(userUpdateRequested());
  try {
    const { content } = await userServices.update(data);
    dispatch(userUpdateSuccessed(content));
    history.push(`/users/${content._id}`);
  } catch (error) {
    dispatch(userUpdateFailed());
  }
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
export const getAuthErrors = () => (store) => store.users.error;

export default usersReducer;
