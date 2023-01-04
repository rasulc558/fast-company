import httpService from "./http.services";

const userEndpoint = "user/";

const userServices = {
  get: async () => {
    const { data } = await httpService.get(userEndpoint);

    return data;
  }
};

export default userServices;
