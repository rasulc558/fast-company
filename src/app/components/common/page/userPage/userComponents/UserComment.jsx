// Комментарий стороннего юзера

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import API from "../../../../../api";

const UserComment = ({ content, date, userId, deleteComment, commentId }) => {
  const [userName, setUserName] = useState();

  function getDate() {
    const delta = +Date.now() - +date;
    const commentDate = new Date(+date);

    if (delta < 1000 * 60) {
      return "1 минуту назад";
    }

    if (delta < 1000 * 60 * 5) {
      return "5 минуту назад";
    }

    if (delta < 1000 * 60 * 30) {
      return "30 минуту назад";
    }

    if (delta < 1000 * 60 * 60) {
      return `${
        commentDate.getHour() < 10
          ? "0" + commentDate.getHour()
          : commentDate.getHour()
      } ${commentDate.getMinutes()}`;
    }

    if (delta < 1000 * 60 * 60 * 24) {
      return `${commentDate.getDay()} ${commentDate.toLocaleString("en-us", {
        month: "long"
      })}`;
    }

    return `${commentDate.getDay()} ${commentDate.toLocaleString("en-us", {
      month: "long"
    })} ${commentDate.getFullYear()}`;
  }

  //
  useEffect(() => {
    API.users.getById(userId).then((data) => setUserName(data.name));
    console.log("userId", userId);
  }, []);

  if (userName) {
    return (
      <div className="card">
        <div className="bg-light card-body  mb-3">
          <div className="row">
            <div className="col">
              <div className="d-flex flex-start ">
                <img
                  src={`https://avatars.dicebear.com/api/avataaars/${(
                    Math.random() + 1
                  )
                    .toString(36)
                    .substring(7)}.svg`}
                  className="rounded-circle shadow-1-strong me-3"
                  alt="avatar"
                  width="65"
                  height="65"
                />
                <div className="flex-grow-1 flex-shrink-1">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="mb-1 ">
                        {userName}
                        <span className="small">{` -   ${getDate()}`}</span>
                      </p>
                      <button
                        className="btn btn-sm text-primary d-flex align-items-center"
                        onClick={() => deleteComment(commentId)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                    <p className="small mb-0">{content}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

UserComment.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  content: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userId: PropTypes.string,
  commentId: PropTypes.string
};

export default React.memo(UserComment);
