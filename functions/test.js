const { db } = require("./util/admin");
const firebase = require("firebase");
const config = require("./util/config");
const { fResponse } = require("./util/fResponse");
const rr = require("rainbow-road");

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async (req, res) => {
  const request = JSON.parse(req.body);
  const nameValid = await db
    .collection("users")
    .where("username", "==", request.username)
    .get()
    .then((data) => {
      console.log(data.docs[0].data());
      return data.docs[0].data();
    })
    .catch((err) => rr.err(`${err}`));

  return fResponse(200, { data: nameValid || "no data found" });
};
