import makeRequest from "../general/makeRequest";

export const attemptUpdateLocation = async (data) => {
  const url = "/api/updateLocation";
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
      currentLocation: data.currentLocation,
      newLocation: data.newLocation,
    }),
  };

  return await makeRequest(url, options);
};

export default attemptUpdateLocation;
