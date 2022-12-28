// new

import React from "react";

import PropTypes from "prop-types";
const UserCardsWrapper = ({ children }) => {
  return (
    <div className="card my-2 text-center">
      <div className="card-body">{children}</div>
    </div>
  );
};

UserCardsWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default UserCardsWrapper;
