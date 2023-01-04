import React from "react";
import qualityServices from "../services/quality.services";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const QualityContext = React.createContext();

export const useQuality = () => {
  return React.useContext(QualityContext);
};

export const QualityProvider = ({ children }) => {
  const [quality, setQuality] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  async function getQuality() {
    try {
      const { content } = await qualityServices.fetchAll();
      setQuality(content);
      setLoading(false);
    } catch (error) {
      errorCatcher(error);
    }
  }

  function errorCatcher(error) {
    const { message } = error.response.data;
    setError(message);
  }

  function getQualityByIds(ids) {
    return quality.filter((q) => {
      return ids.includes(q._id);
    });
  }

  React.useEffect(() => {
    getQuality();
  }, []);

  React.useEffect(() => {
    if (error !== null) {
      toast(error);
      setError(null);
    }
  }, [error]);

  return (
    <QualityContext.Provider value={{ quality, isLoading, getQualityByIds }}>
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
