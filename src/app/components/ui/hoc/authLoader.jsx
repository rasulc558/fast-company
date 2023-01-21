import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { loadQualitiesList } from "../../../store/qualities";
import { loadProfessionsList } from "../../../store/professions";
import {
  getIsLoggedIn,
  getUsersLoadingStatus,
  loadUsersList
} from "../../../store/users";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(getIsLoggedIn());
  const userStatusLoading = useSelector(getUsersLoadingStatus());

  React.useEffect(() => {
    dispatch(loadQualitiesList());
    dispatch(loadProfessionsList());
    if (isLoggedIn) {
      dispatch(loadUsersList());
    }
  }, [isLoggedIn]);

  if (userStatusLoading) return "Loading...";

  return children;
};

AuthLoader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default AuthLoader;
