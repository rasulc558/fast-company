import React from "react";
import PropTypes from "prop-types";

const RadioField = ({ options, name, onChange, value, label }) => {
  const handleChange = ({ target }) => {
    onChange({ name: target.name, value: target.value });
  };
  return (
    <div className="mb-4 ">
      <p className="form-label pr-4">{label}</p>

      {options.map((option) => (
        <div
          key={option.name + "_" + option.value}
          className="form-check form-check-inline"
        >
          <input
            className="form-check-input"
            type="checkbox"
            id={option.name + "_" + option.value}
            value={option.value}
            name={name}
            checked={option.value === value}
            onChange={handleChange}
          />

          <label
            className="form-check-label"
            htmlFor={option.name + "_" + option.value}
          >
            {option.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioField;

RadioField.propTypes = {
  options: PropTypes.array,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  label: PropTypes.string
};
