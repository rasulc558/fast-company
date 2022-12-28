import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import api from "../../../../api";
import { useHistory } from "react-router-dom";
import UserInfoCard from "./userComponents/userInfoCard"; // 1
import UserQualityCard from "./userComponents/userQualityCard"; // 1
import UserMeetingsCard from "./userComponents/userMeetingsCard"; // 1
import UserCommentList from "./userComponents/userCommentsList";
import UsersCommentsComponent from "./userComponents/UsersCommentsComponent ";

const UserPage = ({ userId }) => {
  const history = useHistory();
  const [user, setUser] = useState();
  const [allUsers, setAllUsers] = useState(); // 1
  const [data, setData] = useState({}); //
  const [commentForUser, setCommentForUser] = useState(); //

  useEffect(() => {
    api.users.getById(userId).then((data) => setUser(data));

    // 1
    api.users
      .fetchAll()
      .then((users) =>
        setAllUsers(
          users.map((user) => ({ label: user.name, value: user._id }))
        )
      );

    api.comments
      .fetchCommentsForUser(userId)
      .then((comments) => setCommentForUser(comments));
  }, []);

  function updateComments() {
    api.comments
      .fetchCommentsForUser(userId)
      .then((comments) => setCommentForUser(comments));
  }

  const handleCommentDelete = useCallback((commentId) => {
    api.comments.remove(commentId).then(updateComments);
  }, []);

  const handleChange = useCallback((target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }));
  }, []);

  const handleClick = useCallback(() => {
    history.push(history.location.pathname + "/edit");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.comment && data.selectedUser) {
      const newComment = {
        userId: data.selectedUser,
        pageId: userId, // страница на которой оставили комментарий
        content: data.comment
      };

      // console.log("new", newComment);

      api.comments.add(newComment).then(() => {
        setData({});
        updateComments();
      });
    }
  };

  // useEffect(() => console.log("comment", commentForUser));

  const isValid = () => {
    if (data.selectedUser && data.comment) {
      return false;
    }
    return true;
  };

  if (user && allUsers) {
    return (
      <div className="container">
        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <UserInfoCard
              userName={user.name}
              profession={user.profession.name}
              rate={user.rate}
              onClick={handleClick}
            />

            <UserQualityCard qualities={user.qualities} />

            <UserMeetingsCard meetings={user.completedMeetings} />
          </div>

          <div className="col-md-8">
            <UserCommentList
              allUsers={allUsers}
              data={data}
              handleChange={handleChange}
              isValid={isValid}
              onSubmit={handleSubmit}
            />

            <button
              className="btn btn-primary"
              onClick={() => console.log("comment", commentForUser)}
            >
              console
            </button>

            {commentForUser && (
              <UsersCommentsComponent
                commentForUser={commentForUser}
                handleCommentDelete={handleCommentDelete}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Loading</h1>;
  }
};

UserPage.propTypes = {
  userId: PropTypes.string.isRequired
};

export default UserPage;
