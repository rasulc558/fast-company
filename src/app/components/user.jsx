import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import API from "../api";
import QualitiesList from "./qualitiesList";

const User = () => {
  const [user, setUser] = useState();

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    API.users.getById(id).then((data) => setUser(data));
  }, []);

  const handleSave = () => {
    history.push("/users");
  };

  return (
    user && (
      <>
        <h1 style={{ color: "red" }}>{user.name} </h1>
        <h2>{"Профессия: " + user.profession.name} </h2>
        <QualitiesList qualities={user.qualities} />
        <h2>{"встретился раз: " + user.completedMeetings} </h2>
        <h3>{"рейтинг: " + user.rate} </h3>
        <button onClick={() => handleSave()}> Все пользователи</button>
      </>
    )
  );
};

export default User;

/*
bookmark: false
completedMeetings: 72
name: "Говард Воловиц"
profession: {_id: '67rdca3eeb7f6fgeed471822', name: 'Инженер'}
qualities: (2) [{…}, {…}]
rate: 3.5
*/
