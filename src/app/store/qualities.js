import { createSlice } from "@reduxjs/toolkit";
import qualityServices from "../services/quality.services";
import { isOutdated } from "../utils/isOutdated";

const initialState = {
  entities: null,
  isLoading: true,
  error: null,
  lastFetch: null
};

const qualitiesSlice = createSlice({
  name: "qualities",
  initialState: initialState,
  reducers: {
    qualitiesRequested(state) {
      state.isLoading = true;
    },
    qualitiesRecieved(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
      state.lastFetch = Date.now();
    },
    qualitiesRequestFailed(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

const { actions, reducer: qualitiesReducer } = qualitiesSlice;
const { qualitiesRecieved, qualitiesRequestFailed, qualitiesRequested } =
  actions;

export const loadQualitiesList = () => async (dispatch, getState) => {
  const { lastFetch } = getState().qualities;

  if (isOutdated(lastFetch)) {
    dispatch(qualitiesRequested());
    try {
      const { content } = await qualityServices.fetchAll();
      dispatch(qualitiesRecieved(content));
    } catch (error) {
      dispatch(qualitiesRequestFailed(error.message));
    }
  }
};

// selectors
export const getQualities = () => (state) => {
  return state.qualities.entities;
};

export const getQualitiesLoadingStatus = () => (state) => {
  return state.qualities.isLoading;
};

export const getQualitiesById = (qualitiesIds) => (state) => {
  if (state.qualities.entities) {
    const newArray = [];
    for (const qualId of qualitiesIds) {
      for (const qual of state.qualities.entities) {
        if (qualId === qual._id) {
          newArray.push(qual);
          break;
        }
      }
    }

    return newArray;
  }
  return [];
};

export default qualitiesReducer;
