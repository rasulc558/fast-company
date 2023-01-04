import axios from "axios";
import configFile from "../config.json";

const request = axios.create({ baseURL: configFile.FIRE_BASE_URL });

request.interceptors.request.use(
  function (config) {
    if (configFile.isFireBase) {
      const containSlash = /\/$/.test(config.url);
      config.url =
        (containSlash ? config.url.slice(0, -1) : config.url) + ".json";
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function transformData(data) {
  return data
    ? Object.keys(data).map((key) => {
        return { ...data[key] };
      })
    : [];
}

request.interceptors.response.use(
  (res) => {
    if (configFile.isFireBase) {
      res.data = { content: transformData(res.data) };
    }
    return res;
  },
  (error) => {
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedErrors) {
      // console.log(error);
    }

    return Promise.reject(error);
  }
);

const httpService = {
  get: request.get,
  put: request.put,
  post: request.post,
  delete: request.delete
};

export default httpService;
