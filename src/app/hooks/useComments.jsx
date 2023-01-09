import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useAuth } from "./useAuth";
import { nanoid } from "nanoid";
import commentService from "../services/comment.services";
import { toast } from "react-toastify";

const CommentContext = React.createContext();

export const useComment = () => {
  return React.useContext(CommentContext);
};

export const CommentProvider = ({ children }) => {
  const [isLoading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [error, setError] = React.useState(null);
  const { userId } = useParams();
  const { currentUser } = useAuth();

  async function createComment(data) {
    const comment = {
      ...data,
      _id: nanoid(),
      pageId: userId,
      created_at: Date.now(),
      userId: currentUser._id
    };

    try {
      const { content } = await commentService.create(comment);
      setComments((p) => [...p, content]);
    } catch (error) {
      errorCatcher(error);
    } finally {
      setLoading(false);
    }
  }

  async function getComments() {
    try {
      const { content } = await commentService.getComments(userId);
      setComments(content);
    } catch (error) {
      errorCatcher(error);
    } finally {
      setLoading(false);
    }
  }

  function errorCatcher(error) {
    const { message } = error.response.data;
    setError(message);
  }

  async function removeComment(id) {
    try {
      const { content } = await commentService.removeComment(id);
      if (content === null) {
        setComments((prevState) => prevState.filter((com) => com._id !== id));
      }
    } catch (error) {
      errorCatcher(error);
    }
  }

  React.useEffect(() => {
    getComments();
  }, [userId]);

  React.useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  return (
    <CommentContext.Provider
      value={{ comments, createComment, isLoading, removeComment }}
    >
      {children}
    </CommentContext.Provider>
  );
};

CommentProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};
