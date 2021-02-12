import rr from "rainbow-road";

export const makeRequest = (url, options) => {
  return fetch(url, options)
    .then((response) => response.json())
    .catch((err) => rr.err(`${err}`));
};
export default makeRequest;
