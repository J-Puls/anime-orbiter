import makeRequest from "../general/makeRequest";

export const getUserInfo = async (data) => {
  const url = "/api/getUserDetails";
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
      uid: data.uid,
      username: data.username,
    },
  };

  return await makeRequest(url, options);
};

export default getUserInfo;
