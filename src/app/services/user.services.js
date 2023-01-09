import httpService from "./http.services";

const userEndpoint = "user/";

const userServices = {
  get: async () => {
    const { data } = await httpService.get(userEndpoint);

    return data;
  },

  create: async (payload) => {
    const { data } = await httpService.put(userEndpoint + payload._id, payload);
    return data;
  }
};

export default userServices;
