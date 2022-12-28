import React from "react";
import PropTypes from "prop-types";
import Quality from "./qualities";
import { useQuality } from "../../../hooks/useQuality";

const QualitiesList = ({ qualities }) => {
  const { isLoading } = useQuality();

  return (
    <>
      {isLoading
        ? "loading"
        : qualities.map((qual) => <Quality id={qual} key={qual} />)}
    </>
  );
};

QualitiesList.propTypes = {
  qualities: PropTypes.array
};
export default QualitiesList;
