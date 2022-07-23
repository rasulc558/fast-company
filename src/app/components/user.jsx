import React, { useState } from "react";
import Qualities from "./qualities";

const User = ({ user, onDelete, onToggleBookMark }) => {
  return (
    <tr key={user._id}>
      <td>{user.name}</td>
      <Qualities userQualities={user.qualities} />
      <td>{user.profession.name}</td>
      <td>{user.completedMeetings}</td>
      <td>
        <i
          className={user.bookmark ? "bi bi-bookmark-fill" : "bi bi-bookmark"}
          onClick={() => onToggleBookMark(user._id)}
          style={{ cursor: "pointer" }}
        ></i>
      </td>
      <td>{user.rate} /5</td>
      <td>
        <button onClick={() => onDelete(user._id)} className="btn btn-danger">
          delete
        </button>
      </td>
    </tr>
  );
};

export default User;
