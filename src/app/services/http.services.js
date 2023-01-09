import axios from "axios";
import configFile from "../config.json";
import { httpAuth } from "../hooks/useAuth";
import localsStorageService from "./localStorage.services";

const request = axios.create({ baseURL: configFile.FIRE_BASE_URL });

request.interceptors.request.use(
  async function (config) {
    if (configFile.isFireBase) {
      const containSlash = /\/$/.test(config.url);
      config.url =
        (containSlash ? config.url.slice(0, -1) : config.url) + ".json";
      // далее обновляем рефреш токен
      const expiresDate = localsStorageService.getTokenExpiresDate();
      const refreshToken = localsStorageService.getRefreshToken();

      if (refreshToken && expiresDate < Date.now()) {
        const { data } = await httpAuth.post("token", {
          grant_type: "refresh_token",
          refresh_token: refreshToken
        });

        localsStorageService.setToken({
          idToken: data.id_token,
          localId: data.user_id,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in
        });
      }

      const accessToken = localsStorageService.getAccessToken();
      if (accessToken) {
        config.params = {
          ...config.params,
          auth: accessToken
        };
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function transformData(data) {
  return data && !data._id
    ? Object.keys(data).map((key) => {
        return { ...data[key] };
      })
    : data;
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
