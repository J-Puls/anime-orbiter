const { db } = require("./util/admin");
const firebase = require("firebase");
const config = require("./util/config");
const { fResponse } = require("./util/fResponse");
const fbAuth = require("./util/fbAuth");
const rr = require("rainbow-road");

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async (req, res) => {
  const isAuthenticated = await fbAuth(req);
  if (!isAuthenticated) {
    return fResponse(403, { type: "danger", error: "Authentication Failed" });
  }
  const { titleId, uid } = JSON.parse(req.body);

  const response = db
    .collection("user_lists")
    .where("owner", "==", uid)
    .get()
    .then((data) => {
      const currentList = data.docs[0].data().contents;
      let newList;
      currentList.forEach((item) => {
        if (item.id === titleId) {
          newList = currentList.filter((value) => value !== item);
          db.collection("user_lists")
            .doc(data.docs[0].id)
            .update({
              contents: newList,
              last_modified: new Date().toISOString(),
            })
            .then(() => rr.succ("List updated successfully!"))
            .catch((err) => rr.err(`${err}`));
        }
      });
      return fResponse(200, {
        type: "success",
        message: "List updated successfully.",
        list: newList,
      });
    })
    .catch((err) => {
      rr.err(`${err}`);
      return fResponse(500, { type: "danger", error: err });
    });
  return await response;
};
