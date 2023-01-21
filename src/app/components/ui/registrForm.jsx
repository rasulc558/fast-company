import React, { useState, useEffect } from "react";
import TextField from "../common/form/textField";
import { validator } from "../../utils/validator";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/multiSelectField";
import CheckBoxField from "../common/form/checkBoxField";
import { getQualities } from "../../store/qualities";
import { useDispatch, useSelector } from "react-redux";
import { getProfessions } from "../../store/professions";
import { signUp } from "../../store/users";

const RegistrForm = () => {
  const dispatch = useDispatch();

  const qualities = useSelector(getQualities());

  const qualitiesList = qualities.map((el) => ({
    label: el.name,
    value: el._id,
    color: el.color
  }));

  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
    profession: "",
    sex: "male",
    qualities: [],
    licence: false
  });

  const [errors, setErrors] = useState({});

  const professions = useSelector(getProfessions());

  const professionList = professions.map((p) => ({
    label: p.name,
    value: p._id
  }));

  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }));
  };

  const validatorConfig = {
    email: {
      isRequared: { message: "Электронная почта обязательна для заполнения" },
      isEmail: { message: "Email введен некорректно" }
    },
    name: {
      isRequared: { message: "Имя обязательна для заполнения" },
      min: {
        message: "Имя должно состоять минимум из 3 символов",
        value: 3
      }
    },
    profession: { isRequared: { message: "Введите профессию" } },
    licence: {
      isRequared: {
        message:
          "Вы не можете использовать наш сервис без лицензионного соглашения"
      }
    },
    password: {
      isRequared: { message: "Пароль обязательна для заполнения" },
      isCapitalSymbol: {
        message: "Пароль должен содержать хотя бы один заглавный символ"
      },
      isContainDigit: {
        message: "Пароль должен содержать хотя бы одну цифру"
      },
      min: {
        message: "Пароль должен состоять минимум из 8 символов",
        value: 8
      }
    }
  };

  useEffect(() => {
    validate();
  }, [data]);

  const validate = () => {
    const errors = validator(data, validatorConfig);

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;

    const newData = { ...data, qualities: data.qualities.map((q) => q.value) };

    //  signUp(newData);
    dispatch(signUp(newData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Электронная почта"
        name="email"
        value={data.email}
        onChange={handleChange}
        error={errors.email}
      />

      <TextField
        label="Имя"
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
      />

      <TextField
        label="Пароль"
        type="password"
        name="password"
        value={data.password}
        onChange={handleChange}
        error={errors.password}
      />

      <SelectField
        options={professionList}
        name="profession"
        value={data.profession}
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
        value={data.sex}
        label="Ваш пол"
        name="sex"
        onChange={handleChange}
      />

      <MultiSelectField
        onChange={handleChange}
        defaultValue={data.qualities}
        options={qualitiesList}
        name="qualities"
        label="Выберите ваши качества"
      />

      <CheckBoxField
        value={data.licence}
        onChange={handleChange}
        name="licence"
        error={errors.licence}
      >
        Подтвердить <a> лицензионно соглашение</a>
      </CheckBoxField>

      <button
        type="submit"
        disabled={!isValid}
        className="btn btn-primary w-100 mx-auto"
      >
        Submit
      </button>
    </form>
  );
};

export default RegistrForm;
