import React from "react";
import PropTypes from "prop-types";

function TextAreaField({ label, name, value, onChange, error }) {
  const handleChange = ({ target }) => {
    // console.log(target);
    onChange({ name: target.name, value: target.value });
  };

  // const getInputClasses = () => {
  //   return "form-control" + (error ? " is-invalid" : "");
  // };

  return (
    <div className="mb-4">
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder="Leave a comment here"
          id="floatingTextarea2"
          style={{ height: "100px" }}
          name={name}
          value={value}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="floatingTextarea2">{label}</label>
      </div>
    </div>
  );
}

TextAreaField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string
};

export default React.memo(TextAreaField);
