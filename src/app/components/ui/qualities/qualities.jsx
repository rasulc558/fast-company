import React from "react";
import PropTypes from "prop-types";
import { useQuality } from "../../../hooks/useQuality";

const Quality = ({ id }) => {
  const { getQualityById } = useQuality();
  const { color, name } = getQualityById(id);

  return <span className={"badge m-1 bg-" + color}>{name}</span>;
};
Quality.propTypes = {
  id: PropTypes.string.isRequired
};

export default Quality;
