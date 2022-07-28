import React from "react";
import PropTypes from "prop-types";

const BookMark = ({ status, ...onClickToggle }) => {
  return (
    <button {...onClickToggle}>
      <i className={"bi bi-bookmark" + (status ? "-heart-fill" : "")}></i>
    </button>
  );
};

BookMark.propTypes = {
  status: PropTypes.bool.isRequired,
  onClickToggle: PropTypes.func
};

export default BookMark;
