const { db } = require("./util/admin");
const firebase = require("firebase");
const config = require("./util/config");
const { fResponse } = require("./util/fResponse");
const rr = require("rainbow-road");

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async (req, res) => {
  const { uid } = JSON.parse(req.body);

  const response = await db
    .collection("user_lists")
    .where("owner", "==", uid)
    .orderBy("date_created", "desc")
    .get()
    .then((data) => {
      rr.succ("List Retrieved Successfully!");
      return fResponse(200, {
        type: "success",
        list: data.docs[0].data().contents,
        message: "List retrieved successfully.",
      });
    })
    .catch((err) => {
      rr.err(`${err}`);
      return fResponse(500, { type: "danger", error: err });
    });
  return response;
};
