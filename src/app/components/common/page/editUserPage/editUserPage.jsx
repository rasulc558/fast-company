import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TextField from "../../form/textField";
import SelectField from "../../form/selectField";
import MultiSelectField from "../../form/multiSelectField";
import RadioField from "../../form/radioField";
import BackHistoryButton from "../../BackButton";
import { validator } from "../../../../utils/validator";
import { useProfession } from "../../../../hooks/useProfession";
import { useQuality } from "../../../../hooks/useQuality";
import { useAuth } from "../../../../hooks/useAuth";
import { useUsers } from "../../../../hooks/useUsers";

const EditUserPage = () => {
  const { userId } = useParams();
  const { currentUser, updateUser } = useAuth();
  const { getUserById } = useUsers();

  const [isLoading, setLoading] = useState(true);

  const [data, setData] = useState({
    name: "",
    email: "",
    profession: "",
    sex: "male",
    qualities: []
  });

  const { professions: professionInitial, isLoading: professionLoading } =
    useProfession();

  const {
    getQualityById,
    qualities: qualitiesInitial,
    isLoading: qualityLoading
  } = useQuality();

  const [errors, setErrors] = useState({});

  const professions = React.useMemo(() => {
    return transformData(professionInitial);
  }, [isLoading]);

  const qualities = React.useMemo(() => {
    return transformData(qualitiesInitial);
  }, [isLoading]);

  const user = React.useMemo(() => {
    return getUserById(userId);
  }, [userId]);

  React.useEffect(() => {
    if (!professionLoading && !qualityLoading) {
      setLoading(false);
    }
  }, [professionLoading, qualityLoading]);

  React.useEffect(() => {
    // console.log("professionLoading", professionLoading);
    // console.log("qualityLoading", qualityLoading);
    // console.log(users);
  });

  React.useEffect(() => {
    if (!isLoading) {
      const qualitiesArray = user.qualities.map((qual) => getQualityById(qual));

      const transformQualities = transformData(qualitiesArray);

      setData(() => ({
        name: user.name,
        email: user.email,
        profession: user.profession,
        sex: user.sex,
        qualities: transformQualities
      }));
    }
  }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    const newData = { ...data, qualities: data.qualities.map((q) => q.value) };

    updateUser({
      ...currentUser,
      ...newData
    });
  };

  function transformData(data) {
    // transform initial Array of quality and profession
    return data.map((qual) => {
      const data = {
        label: qual.name,
        value: qual._id
      };

      if (qual.color) {
        data.color = qual.color;
      }

      return data;
    });
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
          {!isLoading ? (
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
                options={professions}
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
                options={qualities}
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
