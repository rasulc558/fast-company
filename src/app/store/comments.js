import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.services";
import { nanoid } from "nanoid";

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    entities: null,
    isLoading: false,
    error: null
  },
  reducers: {
    commentsRequested(state) {
      state.isLoading = true;
    },
    commentsRecieved(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    commentsRequestFailed(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    commentCreated(state, action) {
      state.entities.push(action.payload);
    },
    commentCreateFailed(state, action) {
      state.error = action.payload;
    },
    commentRemove(state, action) {
      state.entities = state.entities.filter(
        (com) => com._id !== action.payload
      );
    }
  }
});

const { actions, reducer: commentsReducer } = commentSlice;
const {
  commentsRecieved,
  commentsRequestFailed,
  commentsRequested,
  commentCreated,
  commentCreateFailed,
  commentRemove
} = actions;

export const loadCommentsList = (userId) => async (dispatch) => {
  dispatch(commentsRequested());
  try {
    const { content } = await commentService.getComments(userId);

    dispatch(commentsRecieved(content));
  } catch (error) {
    dispatch(commentsRequestFailed(error.message));
  }
};
//
export const createComment =
  (data, userId, currentUserId) => async (dispatch) => {
    const comment = {
      ...data,
      _id: nanoid(),
      pageId: userId,
      created_at: Date.now(),
      userId: currentUserId
    };

    try {
      const { content } = await commentService.create(comment);
      dispatch(commentCreated(content));
    } catch (error) {
      dispatch(commentCreateFailed(error.message));
    }
  };

export const removeComment = (id) => async (dispatch) => {
  try {
    const { content } = await commentService.removeComment(id);
    if (content === null) {
      dispatch(commentRemove(id));
    }
  } catch (error) {
    dispatch(commentCreateFailed(error.message));
  }
};

// selectors

export const getComments = () => (store) => store.comments.entities;
export const getCommentsLoadingStatus = () => (store) =>
  store.comments.isLoading;

export default commentsReducer;
