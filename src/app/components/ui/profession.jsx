import React from "react";
import PropTypes from "prop-types";
import { useProfession } from "../../hooks/useProfession";

const Profession = ({ id }) => {
  const { isLoading, getProfessionById } = useProfession();
  const prof = getProfessionById(id);

  if (!isLoading) {
    return <p> {prof.name}</p>;
  } else {
    return "loading";
  }
};

Profession.propTypes = {
  id: PropTypes.string
};

export default Profession;
