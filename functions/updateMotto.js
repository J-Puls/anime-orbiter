const { db } = require("./util/admin");
const firebase = require("firebase");
const config = require("./util/config");
const { fResponse } = require("./util/fResponse");
const fbAuth = require("./util/fbAuth");
const rr = require("rainbow-road");
const { reduceMotto } = require("./util/validators");

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async (req, res) => {
  if (req.headers.uid === process.env.REACT_APP_PUBLIC_USER_UID) {
    rr.err("Cannot Modify Public Account.");
    return fResponse(403, {
      type: "danger",
      error:
        "Sorry, modifications are not allowed to the 'Public User' account!",
    });
  }

  const isAuthenticated = await fbAuth(req);

  if (!isAuthenticated) {
    rr.err("Authentication Failed.");
    return fResponse(403, { type: "danger", error: "Authentication Failed" });
  }

  const requestBody = JSON.parse(req.body);

  const newMotto = reduceMotto(requestBody.newMotto);
  if (!newMotto)
    return fResponse(500, {
      type: "danger",
      error: "New motto missing from request body!",
    });

  if (requestBody.newMotto === requestBody.currentMotto) {
    rr.err("New motto cannot be the same as current motto!");
    return fResponse(400, {
      type: "danger",
      error: "New motto cannot be the same as current motto!",
    });
  }

  if (requestBody.newMotto.length <= 5) {
    rr.err("New motto too short!");
    return fResponse(500, {
      type: "danger",
      error: "New motto must be at least 5 characters long!",
    });
  }

  const response = db
    .doc(`/users/${req.headers.uid}`)
    .update({ motto: newMotto })
    .then(() => {
      rr.succ(`Motto Changed Successfully!
          old: ${requestBody.currentMotto}
          new: ${newMotto}
          `);
      return fResponse(200, {
        type: "success",
        message: "Motto updated successfully.",
        motto: newMotto,
      });
    })
    .catch((err) => {
      rr.err(`${err}`);
      return fResponse(500, {
        type: "danger",
        error: err,
      });
    });
  return response;
};
