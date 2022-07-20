import React, { useState } from "react";
import api from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const Users = () => {
  // console.log(api.users.fetchAll())
  // !!!! почему-то консоль дважды вызывается

  const [users, setUsers] = useState(api.users.fetchAll());

  const handleDelete = (userId) => {
    // console.log(userId);
    setUsers((prevState) => prevState.filter((user) => user._id != userId));
  };

  const renderPhrase = (number) => {
    if (number == 0)
      return <span className="badge bg-danger">Никто с тобой не тусанет</span>;

    if (number > 1 && number < 5)
      return (
        <span className="badge bg-primary">
          {number} человека тусанут с тобой сегодня
        </span>
      );

    return (
      <span className="badge bg-primary">
        {number} человек тусанут с тобой сегодня
      </span>
    );
  };

  function renderBadge(badge) {
    return `badge m-1 bg-${badge}`;
  }

  const renderTableBody = () => {
    return users.map((user) => {
      return (
        <tr>
          <th scope="row">{user.name}</th>

          <td>
            {user.qualities.map((quality) => (
              <span className={renderBadge(quality.color)}>{quality.name}</span>
            ))}
          </td>

          <td>{user.profession.name}</td>
          <td>{user.completedMeetings}</td>
          <td>{user.rate}/5</td>

          <td>
            <span
              className="btn btn-danger"
              onClick={() => handleDelete(user._id)}
            >
              Удалить
            </span>
          </td>
        </tr>
      );
    });
  };

  const renderTable = () => {
    return users.length == 0 ? null : (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Имя</th>
            <th scope="col">Качества</th>
            <th scope="col">Профессия</th>
            <th scope="col">Встретился, раз</th>
            <th scope="col">Оценка</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </table>
    );
  };

  return (
    <>
      <h1> {renderPhrase(users.length)}</h1>

      {renderTable()}
    </>
  );
};

export default Users;
