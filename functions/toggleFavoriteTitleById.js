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
  rr.info(`${titleId} ${uid}`);

  const response = db
    .collection("user_lists")
    .where("owner", "==", uid)
    .orderBy("date_created", "desc")
    .get()
    .then(async (data) => {
      const userList = data.docs[0];
      const list = data.docs[0].data().contents;
      const toUpdate = list.find((item) => item.id === titleId);
      if (!toUpdate) throw Error("Title not found in list.");
      const newList = Array.from(list);

      newList[list.indexOf(toUpdate)] = {
        ...toUpdate,
        favorite: !toUpdate.favorite,
      };

      const updateResult = await db
        .collection("user_lists")
        .doc(userList.id)
        .update({ contents: newList })
        .then(() => {
          return fResponse(200, {
            type: "success",
            message: "Title updated successfully!",
            list: newList,
          });
        })
        .catch((err) => {
          rr.err(`${err}`);
          return fResponse(400, {
            type: "danger",
            message: "Title update failed",
          });
        });
      return updateResult;
    })
    .catch((err) => {
      rr.err(`${err}`);
      return fResponse(500, { type: "danger", error: err });
    });
  return await response;
};
