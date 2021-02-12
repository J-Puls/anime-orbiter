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
    rr.err("Authentication Failed.".red);
    return fResponse(403, { type: "danger", error: "Authentication Failed" });
  }

  let responseData = {};
  const uid = req.headers.uid;
  const username = req.headers.username;
  let accountFound = false;
  let listFound = false;

  try {
    accountFound = await db
      .doc(`/users/${uid}`)
      .get()
      .then((doc) => {
        if (!doc.exists) throw Error("No account exists with that username.");
        else {
          rr.succ("Account Found Successfully!");
          responseData.credentials = doc.data();
          return true;
        }
      })
      .catch((err) => {
        rr.err(`${err}`);
        return false;
      });
  } catch (err) {
    rr.err(`${err}`);
  }

  if (!accountFound) {
    return fResponse(500, { type: "danger", error: "Account Not Found." });
  }

  try {
    listFound = await db
      .collection("user_lists")
      .where("owner", "==", uid)
      .orderBy("date_created", "desc")
      .get()
      .then((data) => {
        const list = data.docs[0].data().contents;
        if (!list) throw Error("No list exists for this account");
        rr.succ("List Found Successfully!");
        responseData.list = [...list];
        return true;
      })
      .catch((err) => {
        rr.err(`${err}`);
        return false;
      });
  } catch (err) {
    rr.err(`${err}`);
  }

  if (!listFound) {
    return fResponse(500, { type: "danger", error: "List Not Found." });
  }

  const response = fResponse(200, {
    type: "success",
    message: "Details retrieved successfully.",
    ...responseData,
  });

  rr.succ("All Data Found Successfully!");
  return response;
};
