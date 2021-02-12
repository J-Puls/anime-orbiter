import makeRequest from "../general/makeRequest";

export const authenticateAndLogin = async (data) => {
  const url = "/api/loginUser/";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return await makeRequest(url, options);
};

export default authenticateAndLogin;
