export function validator(data, config) {
  const errors = {};

  function validate(validateMethod, data, config) {
    let statusValidate;
    switch (validateMethod) {
      case "isRequared": {
        if (typeof data === "boolean") {
          statusValidate = !data;
        } else {
          statusValidate = data.trim() === "";
        }
        break;
      }
      case "isEmail": {
        const emailRegExp = /^\S+@\S+\.\S+$/g;
        statusValidate = !emailRegExp.test(data);
        break;
      }
      case "isCapitalSymbol": {
        const isCapitalRegExp = /[A-Z]+/g;
        statusValidate = !isCapitalRegExp.test(data);
        break;
      }
      case "isContainDigit": {
        const isDigitRegExt = /\d+/g;
        statusValidate = !isDigitRegExt.test(data);
        break;
      }
      case "min": {
        statusValidate = data.length <= config.value;
        break;
      }
      default:
        break;
    }

    if (statusValidate) return config.message;
  }

  for (const fieldName in data) {
    for (const validateMethod in config[fieldName]) {
      const error = validate(
        validateMethod,
        data[fieldName],
        config[fieldName][validateMethod]
      );

      if (error && !errors[fieldName]) {
        errors[fieldName] = error;
      }
    }
  }

  return errors;
}
