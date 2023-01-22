import React from "react";
import PropTypes from "prop-types";
import Quality from "./qualitiy";
import { useDispatch, useSelector } from "react-redux";
import {
  getQualitiesById,
  loadQualitiesList,
  getQualitiesLoadingStatus
} from "../../../store/qualities";

const QualitiesList = ({ qualities }) => {
  const isLoading = useSelector(getQualitiesLoadingStatus());
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadQualitiesList());
  }, []);

  const qualitiesList = useSelector(getQualitiesById(qualities));

  if (isLoading) return "loading";

  return (
    <>
      {qualitiesList.map((qual) => (
        <Quality {...qual} key={qual._id} />
      ))}
    </>
  );
};

QualitiesList.propTypes = {
  qualities: PropTypes.array
};

export default QualitiesList;
