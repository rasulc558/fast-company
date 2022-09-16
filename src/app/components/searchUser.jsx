import React from "react";
import PropTypes from "prop-types";

const SearchUser = ({ onChange, value }) => {
  return (
    <input
      type="text"
      placeholder="Введите имя"
      value={value}
      onChange={onChange}
    />
  );
};

SearchUser.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default SearchUser;
