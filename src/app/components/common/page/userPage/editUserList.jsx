import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../../../../api";
import { useHistory, useParams } from "react-router-dom";
import TextField from "../../form/textField";
import SelectField from "../../form/selectField";
import MultiSelectField from "../../form/multiSelectField";
import RadioField from "../../form/radioField";
import { validator } from "../../../../utils/validator";

const EditUserList = () => {
  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
    sex: "",
    profession: "",
    qualities: [],
    completedMeetings: "",
    rate: "",
    bookmark: ""
  });

  const [professions, setProfessions] = useState([]);
  const [qualities, setQualities] = useState([]);
  const { userId } = useParams();
  const history = useHistory();
  const [errors, setErrors] = useState({});

  const validatorConfig = {
    email: {
      isRequared: { message: "Электронная почта обязательна для заполнения" },
      isEmail: { message: "Email введен некорректно" }
    },
    // profession: { isRequared: { message: "Введите профессию" } }
    name: {
      isRequared: {
        message: "Введите имя"
      }
    }
  };

  useEffect(() => {
    api.users.getById(userId).then((data) => {
      setUser({
        ...data,
        qualities: transformQualities(data.qualities),
        profession: data.profession._id
      });
    });

    api.professions.fetchAll().then((data) => {
      const professionsList = Object.keys(data).map((professionName) => ({
        label: data[professionName].name,
        value: data[professionName]._id
      }));
      setProfessions(professionsList);
    });

    api.qualities.fetchAll().then((data) => {
      const qualitiesList = Object.keys(data).map((optionName) => ({
        label: data[optionName].name,
        value: data[optionName]._id,
        color: data[optionName].color
      }));
      setQualities(qualitiesList);
    });
  }, []);

  const handleChange = (target) => {
    setUser((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }));
  };

  useEffect(() => {
    validate();
  }, [user]);

  const validate = () => {
    const errors = validator(user, validatorConfig);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const isValid = Object.keys(errors).length === 0;

  const getProfessionById = (id) => {
    for (const prof of professions) {
      if (prof.value === id) {
        return { _id: prof.value, name: prof.label };
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;
    const { profession, qualities } = user;

    const updateUser = {
      ...user,
      profession: getProfessionById(profession),
      qualities: reTransformQualities(qualities)
    };

    api.users.update(userId, updateUser);
    history.goBack();
  };

  // меняет формат объектов quolities для первоначального добавления в стейт
  function transformQualities(qualities) {
    return qualities.map((quality) => ({
      color: quality?.color,
      value: quality?._id,
      label: quality?.name
    }));
  }

  // Меняем формат qualities из стей для корректного внесения изменеий
  function reTransformQualities(qualities) {
    return qualities.map((quality) => ({
      color: quality?.color,
      _id: quality?.value,
      name: quality?.label
    }));
  }

  return (
    <div className="row">
      <div className="mt-5 col-md-6 offset-md-3 shadow p-4">
        <form onSubmit={handleSubmit}>
          <TextField
            label="Имя"
            name="name"
            value={user.name}
            onChange={handleChange}
            error={errors.name}
          />

          <TextField
            label="Электронная почта"
            name="email"
            value={user.email}
            onChange={handleChange}
            error={errors.email}
          />

          <SelectField
            options={professions}
            name="profession"
            value={user.profession}
            onChange={handleChange}
            label="Выбери свою профессию"
            defaultOption="Choose.."
            error={errors.profession}
          />

          <RadioField
            options={[
              { name: "male", value: "male" },
              { name: "female", value: "female" },
              { name: "other", value: "other" }
            ]}
            value={user.sex}
            label="Ваш пол"
            name="sex"
            onChange={handleChange}
          />

          <MultiSelectField
            onChange={handleChange}
            defaultValue={user.qualities}
            options={qualities}
            name="qualities"
            label="Выберите ваши качества"
          />

          <button
            type="submit"
            disabled={!isValid}
            className="btn btn-primary w-100 mx-auto"
          >
            обновить
          </button>
        </form>
      </div>
    </div>
  );
};

EditUserList.propTypes = {
  userId: PropTypes.object
};

export default EditUserList;
