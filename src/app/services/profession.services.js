import httpService from "./http.services";

const professionEndpoint = "profession/";

const professionServices = {
  get: async () => {
    const { data } = await httpService.get(professionEndpoint);

    return data;
  }
};

export default professionServices;
