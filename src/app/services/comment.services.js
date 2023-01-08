import httpService from "./http.services";

const commentEndpoint = "comments/";

const commentService = {
  create: async (dataComment) => {
    const { data } = await httpService.put(
      commentEndpoint + dataComment._id,
      dataComment
    );

    return data;
  },
  getComments: async (pageId) => {
    const { data } = await httpService.get(commentEndpoint, {
      params: {
        orderBy: `"pageId"`,
        equalTo: `"${pageId}"`
      }
    });
    return data;
  },
  removeComment: async (id) => {
    const { data } = await httpService.delete(commentEndpoint + id);
    return data;
  }
};

export default commentService;
