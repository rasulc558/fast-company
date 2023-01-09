import React from "react";
import qualityServices from "../services/quality.services";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const QualityContext = React.createContext();

export const useQuality = () => {
  return React.useContext(QualityContext);
};

export const QualityProvider = ({ children }) => {
  const [qualities, setQualities] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  async function getQualities() {
    try {
      const { content } = await qualityServices.fetchAll();
      setQualities(content);
      setLoading(false);
    } catch (error) {
      errorCatcher(error);
    }
  }

  function errorCatcher(error) {
    const { message } = error.response.data;
    setError(message);
  }

  function getQualityById(id) {
    return qualities.find((q) => {
      return q._id === id;
    });
  }

  React.useEffect(() => {
    getQualities();
  }, []);

  React.useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  return (
    <QualityContext.Provider value={{ qualities, isLoading, getQualityById }}>
      {children}
    </QualityContext.Provider>
  );
};

QualityProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};
