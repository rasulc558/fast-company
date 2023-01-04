import httpService from "./http.services";

const qualityEndPoint = "quality/";

const qualityServices = {
  get: async (id) => {
    const { data } = await httpService.get(qualityEndPoint + id);
    return data;
  },

  fetchAll: async () => {
    const { data } = await httpService.get(qualityEndPoint);
    return data;
  }
};

export default qualityServices;
