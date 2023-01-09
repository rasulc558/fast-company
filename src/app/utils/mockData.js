import React, { useEffect } from "react";
import profession from "../mockData/professions.json";
import qualities from "../mockData/qualities.json";
import users from "../mockData/users.json";
import httpService from "../services/http.services";

const useMockData = () => {
  const statusConst = {
    idle: "Not Started",
    pending: "In Process",
    successed: "Ready",
    error: "Error occured"
  };

  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState(statusConst.idle);
  const [progress, setProgress] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const summuryCount = profession.length + qualities.length + users.length;

  const incrementCount = () => {
    setCount((p) => p + 1);
  };

  const updateProgress = () => {
    if (count !== 0 && status === statusConst.idle) {
      setStatus(statusConst.pending);
    }

    const newProgress = Math.floor((count / summuryCount) * 100);
    if (progress < newProgress) {
      setProgress(() => newProgress);
    }

    if (newProgress === 100) {
      setStatus(statusConst.successed);
    }
  };

  useEffect(() => {
    updateProgress();
  }, [count]);

  async function initialize() {
    try {
      for (const prof of profession) {
        await httpService.put("profession/" + prof._id, prof);
        incrementCount();
      }

      for (const user of users) {
        await httpService.put("user/" + user._id, user);
        incrementCount();
      }

      for (const qual of qualities) {
        await httpService.put("quality/" + qual._id, qual);
        incrementCount();
      }
    } catch (error) {
      setStatus(statusConst.error);
      setError(error);
    }
  }

  return { error, initialize, progress, status };
};

export default useMockData;
