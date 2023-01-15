import React, { useState, useEffect } from "react";
import TextField from "../../form/textField";
import SelectField from "../../form/selectField";
import MultiSelectField from "../../form/multiSelectField";
import RadioField from "../../form/radioField";
import BackHistoryButton from "../../BackButton";
import { validator } from "../../../../utils/validator";
import { useAuth } from "../../../../hooks/useAuth";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getQualities,
  getQualitiesLoadingStatus
} from "../../../../store/qualities";
import {
  getProfessions,
  getProfessionsLoadingStatus
} from "../../../../store/professions";

const EditUserPage = () => {
  const [isLoading, setLoading] = useState(true);
  const history = useHistory();

  const [data, setData] = useState();
  const { currentUser, updateUserData } = useAuth();

  const professions = useSelector(getProfessions());
  const professionLoading = useSelector(getProfessionsLoadingStatus());

  const [errors, setErrors] = useState({});

  const qualities = useSelector(getQualities());
  const qualityLoading = useSelector(getQualitiesLoadingStatus());

  React.useEffect(
    () => {
      if (!professionLoading && !qualityLoading && currentUser && !data) {
        setData(() => ({
          ...currentUser,
          qualities: transformData(currentUser.qualities)
        }));
      }
    },
    [professionLoading, qualityLoading],
    currentUser,
    data
  );

  useEffect(() => {
    if (data && isLoading) {
      setLoading(false);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    const newData = { ...data, qualities: data.qualities.map((q) => q.value) };

    await updateUserData(newData);
    history.push(`/users/${currentUser._id}`);
  };

  const qualitiesList = qualities.map((el) => ({
    label: el.name,
    value: el._id,
    color: el.color
  }));

  const professionList = professions.map((p) => ({
    label: p.name,
    value: p._id
  }));

  function getQualitiesListByIds(qualitiesIds) {
    const qualitiesArray = [];
    for (const qualId of qualitiesIds) {
      for (const quality of qualities) {
        if (qualId === quality._id) {
          qualitiesArray.push(quality);
          break;
        }
      }
    }
    return qualitiesArray;
  }

  function transformData(data) {
    return getQualitiesListByIds(data).map((qual) => ({
      label: qual.name,
      value: qual._id,
      color: qual.color
    }));
  }

  const validatorConfig = {
    email: {
      isRequired: {
        message: "Электронная почта обязательна для заполнения"
      },
      isEmail: {
        message: "Email введен некорректно"
      }
    },
    name: {
      isRequired: {
        message: "Введите ваше имя"
      }
    }
  };

  useEffect(() => {
    validate();
  }, [data]);

  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }));
  };

  const validate = () => {
    const errors = validator(data, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValid = Object.keys(errors).length === 0;

  return (
    <div className="container mt-5">
      <BackHistoryButton />
      <div className="row">
        <div className="col-md-6 offset-md-3 shadow p-4">
          {!isLoading && Object.keys(professions).length > 0 ? (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Имя"
                name="name"
                value={data.name}
                onChange={handleChange}
                error={errors.name}
              />
              <TextField
                label="Электронная почта"
                name="email"
                value={data.email}
                onChange={handleChange}
                error={errors.email}
              />
              <SelectField
                label="Выбери свою профессию"
                defaultOption="Choose..."
                options={professionList}
                name="profession"
                onChange={handleChange}
                value={data.profession}
                error={errors.profession}
              />
              <RadioField
                options={[
                  { name: "Male", value: "male" },
                  { name: "Female", value: "female" },
                  { name: "Other", value: "other" }
                ]}
                value={data.sex}
                name="sex"
                onChange={handleChange}
                label="Выберите ваш пол"
              />
              <MultiSelectField
                defaultValue={data.qualities}
                options={qualitiesList}
                onChange={handleChange}
                name="qualities"
                label="Выберите ваши качества"
              />
              <button
                type="submit"
                disabled={!isValid}
                className="btn btn-primary w-100 mx-auto"
              >
                Обновить
              </button>
            </form>
          ) : (
            "Loading..."
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
