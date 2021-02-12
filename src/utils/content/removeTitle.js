import makeRequest from "../general/makeRequest";

export const removeTitle = async (data) => {
  // tell our API to have Firebase remove the selected title
  // from the current user's list
  const url = "/api/removeTitleFromListByOwner";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
      uid: data.uid,
    },
    body: JSON.stringify({ titleId: data.titleId, uid: data.uid }),
  };

  return await makeRequest(url, options);
};

export default removeTitle;
