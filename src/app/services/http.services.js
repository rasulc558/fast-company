import axios from "axios";
import { config } from "../config";

const request = axios.create({ baseURL: config.API_BASE_URL });

request.interceptors.response.use(
  (res) => res,
  (error) => {
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedErrors) {
      console.log(error);
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
