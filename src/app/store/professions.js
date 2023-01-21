import { createSlice } from "@reduxjs/toolkit";
import professionServices from "../services/profession.services";
import { isOutdated } from "../utils/isOutdated";

const initialState = {
  entities: null,
  isLoading: true,
  error: null,
  lastFetch: null
};

const professionsSlice = createSlice({
  name: "professions",
  initialState: initialState,
  reducers: {
    professionsRequested(state) {
      state.isLoading = true;
    },
    professionsRecieved(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
      state.lastFetch = Date.now();
    },
    professionsRequestFailed(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

const { actions, reducer: professionsReducer } = professionsSlice;
const { professionsRecieved, professionsRequestFailed, professionsRequested } =
  actions;

export const loadProfessionsList = () => async (dispatch, getState) => {
  const { lastFetch } = getState().professions;

  if (isOutdated(lastFetch)) {
    dispatch(professionsRequested());
    try {
      const { content } = await professionServices.get();
      dispatch(professionsRecieved(content));
    } catch (error) {
      dispatch(professionsRequestFailed(error.message));
    }
  }
};

// selectors
export const getProfessions = () => (state) => state.professions.entities;

export const getProfessionsLoadingStatus = () => (state) =>
  state.professions.isLoading;

export const getProfessionById = (id) => (state) => {
  if (state.professions.entities) {
    for (const prof of state.professions.entities) {
      if (id === prof._id) {
        return prof;
      }
    }
  }
};

export default professionsReducer;
