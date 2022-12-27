import React from "react";
import PropTypes from "prop-types";
import professionServices from "../services/profession.services";
import { toast } from "react-toastify";

const ProfessionContext = React.createContext();

export const useProfession = () => {
  return React.useContext(ProfessionContext);
};

export const ProfessionProvider = ({ children }) => {
  const [isLoading, setLoading] = React.useState(true);
  const [professions, setProfessions] = React.useState([]);
  const [error, setError] = React.useState(null);

  async function getProfession() {
    try {
      const { content } = await professionServices.get();
      setProfessions(content);
      setLoading(false);
    } catch (error) {
      errorCatcher(error);
    }
  }

  function getProfessionById(id) {
    return professions.find((prof) => prof._id === id);
  }

  function errorCatcher(error) {
    const { message } = error.response.data;
    setError(message);
  }

  React.useEffect(() => {
    getProfession();
  }, []);

  React.useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  return (
    <ProfessionContext.Provider
      value={{ professions, isLoading, getProfessionById }}
    >
      {children}
    </ProfessionContext.Provider>
  );
};

ProfessionProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};
