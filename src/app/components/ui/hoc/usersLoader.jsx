import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getDataStatus, loadUsersList } from "../../../store/users";

const UserLoader = ({ children }) => {
  const dataStatus = useSelector(getDataStatus());
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!dataStatus) {
      dispatch(loadUsersList());
    }
  }, []);

  if (!dataStatus) return "loading...";

  return children;
};

UserLoader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default UserLoader;
