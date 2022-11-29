import React from "react";
import PropTypes from "prop-types";
import UserComment from "./UserComment";

const UsersCommentsComponent = ({ commentForUser, handleCommentDelete }) => {
  if (commentForUser) {
    return commentForUser.map((comment) => (
      <UserComment
        key={comment._id}
        commentId={comment._id}
        content={comment.content}
        date={comment.created_at}
        userId={comment.userId}
        deleteComment={handleCommentDelete}
      />
    ));
  }
};

UsersCommentsComponent.propTypes = {
  commentForUser: PropTypes.array.isRequired,
  handleCommentDelete: PropTypes.func
};

export default React.memo(UsersCommentsComponent);
