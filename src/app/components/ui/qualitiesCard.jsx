import React from "react";
import Qualities from "./qualities";
import PropTypes from "prop-types";
import { useQuality } from "../../hooks/useQuality";

const QualitiesCard = ({ data }) => {
  const { getQualityByIds, isLoading } = useQuality();

  const qualitiesList = getQualityByIds(data);

  return (
    <div className="card mb-3">
      <div className="card-body d-flex flex-column justify-content-center text-center">
        <h5 className="card-title">
          <span>Qualities</span>
        </h5>
        <p className="card-text">
          {!isLoading && <Qualities qualities={qualitiesList} />}
        </p>
      </div>
    </div>
  );
};
QualitiesCard.propTypes = {
  data: PropTypes.array
};

export default QualitiesCard;
