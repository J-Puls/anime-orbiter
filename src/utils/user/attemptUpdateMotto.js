import makeRequest from "../general/makeRequest";

export const attemptUpdateMotto = async (data) => {
  const url = "/api/updateMotto";
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
      currentMotto: data.currentMotto,
      newMotto: data.newMotto,
    }),
  };

  return await makeRequest(url, options);
};

export default attemptUpdateMotto;
