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
  const dispatch = useDispatch();
  const isLoading = useSelector(getQualitiesLoadingStatus());

  React.useEffect(() => {
    dispatch(loadQualitiesList());
  }, []);

  if (isLoading) return "loading";

  const qualitiesList = useSelector(getQualitiesById(qualities));

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
