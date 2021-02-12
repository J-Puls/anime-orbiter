import makeRequest from "../general/makeRequest";

export const addTitle = async (data) => {
  // fetch the related images for this title, since the tvmaze API
  // only returns the poster when searching
  const imgUrl = `http://api.tvmaze.com/shows/${data.title.id}/images`;
  const images = await fetch(imgUrl)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));

  // sort the images and structure them into a nicer format
  const sortedImages = {};
  for (const image of images) {
    sortedImages[image.type] = { ...image.resolutions };
  }

  // we don't need all the data tvmaze gives us, so just grab
  // the relevant stuff and build our own title object
  const { name, genres, id, language, summary } = data.title;
  const titleData = {
    name,
    genres,
    id,
    language,
    summary,
    image: sortedImages,
    favorite: false,
  };

  // tell our API to interact with Firebase and add the title
  // accordingly
  const url = "/api/addTitleToListByOwner";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
      uid: data.uid,
    },
    body: JSON.stringify({
      title: titleData,
      uid: data.uid,
    }),
  };

  return await makeRequest(url, options);
};

export default addTitle;
