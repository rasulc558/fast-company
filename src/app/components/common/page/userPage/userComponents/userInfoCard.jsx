import React from "react";
import PropTypes from "prop-types";

const UserInfoCard = ({ userName, profession, rate, onClick }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <button
          className="position-absolute top-0 end-0 btn btn-light btn-sm"
          onClick={onClick}
        >
          <i className="bi bi-gear"></i>
        </button>

        <div className="d-flex flex-column align-items-center text-center position-relative">
          <img
            src={`https://avatars.dicebear.com/api/avataaars/${(
              Math.random() + 1
            )
              .toString(36)
              .substring(7)}.svg`}
            className="rounded-circle shadow-1-strong me-3"
            alt="avatar"
            width="65"
            height="65"
          />

          <div className="mt-3">
            <h4>{userName}</h4>
            <p className="text-secondary mb-1">{profession}</p>

            <div className="text-muted">
              <i
                className="bi bi-caret-down-fill text-primary"
                role="button"
              ></i>

              <i className="bi bi-caret-up text-secondary" role="button"></i>

              <span className="ms-2">{rate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserInfoCard.propTypes = {
  userName: PropTypes.string.isRequired,
  profession: PropTypes.string.isRequired,
  rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func.isRequired
};

export default React.memo(UserInfoCard);
