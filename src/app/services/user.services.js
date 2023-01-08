import httpService from "./http.services";
import localsStorageService from "./localStorage.services";

const userEndpoint = "user/";

const userServices = {
  get: async () => {
    const { data } = await httpService.get(userEndpoint);

    return data;
  },

  create: async (payload) => {
    const { data } = await httpService.put(userEndpoint + payload._id, payload);
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await httpService.get(
      userEndpoint + localsStorageService.getUserId()
    );
    return data;
  }
};

export default userServices;
