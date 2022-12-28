import React from "react";
import QualitiesList from "../../../../ui/qualities/qualitiesList";
import PropTypes from "prop-types";

const UserQualityCard = ({ qualities }) => {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex flex-column justify-content-center text-center">
        <h5 className="card-title">
          <span>Qualities</span>
        </h5>
        <p className="card-text">
          <QualitiesList qualities={qualities} />
        </p>
      </div>
    </div>
  );
};

UserQualityCard.propTypes = {
  qualities: PropTypes.array
};

export default React.memo(UserQualityCard);
