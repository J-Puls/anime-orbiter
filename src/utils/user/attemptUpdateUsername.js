import makeRequest from "../general/makeRequest";

export const attemptUpdateUsername = async (data) => {
  const url = "/api/updateUsername";
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
      uid: data.uid,
    },
    body: JSON.stringify({
      currentUsername: data.currentUsername,
      newUsername: data.newUsername,
    }),
  };

  return await makeRequest(url, options);
};

export default attemptUpdateUsername;
