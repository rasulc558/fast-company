import React from "react";
import PropTypes from "prop-types";
import Quality from "./qualities";
import { useQuality } from "../../../hooks/useQuality";

const QualitiesList = ({ qualities }) => {
  const { getQualityByIds, isLoading } = useQuality();

  const qualitiesList = getQualityByIds(qualities);

  return (
    <>
      {!isLoading &&
        qualitiesList.map((qual) => <Quality {...qual} key={qual._id} />)}
    </>
  );
};

QualitiesList.propTypes = {
  qualities: PropTypes.array
};
export default QualitiesList;
