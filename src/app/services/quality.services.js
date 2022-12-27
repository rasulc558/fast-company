import httpService from "./http.services";

const qualityEndPoint = "quality/";

const qualityServices = {
  get: httpService.get(qualityEndPoint)
};

export default qualityServices;
