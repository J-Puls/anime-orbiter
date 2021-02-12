const { db } = require("./util/admin");
const { validateLoginData } = require("./util/validators");
const firebase = require("firebase");
const config = require("./util/config");
const { fResponse } = require("./util/fResponse");
const rr = require("rainbow-road");

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = (req, res) => {
  const { email, password } = JSON.parse(req.body);
  const credentials = { email, password };

  const { valid, errors } = validateLoginData(credentials);
  if (!valid) return fResponse(400, { type: "danger", error: errors });

  const response = firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((data) => data.user.getIdToken())
    .then(async (token) => {
      rr.succ("Login Successful!");
      const user = await db
        .collection("users")
        .where("email", "==", email)
        .get()
        .then((data) => {
          return {
            username: data.docs[0].data().username,
            uid: data.docs[0].data().uid,
          };
        });
      rr.succ("Username Found Successfully!");
      return fResponse(200, {
        type: "success",
        message: "login successful",
        token,
        ...user,
      });
    })
    .catch((err) => {
      rr.err(`${err}`);
      if (err.code === "auth/wrong-password")
        return fResponse(403, {
          type: "danger",
          error: "Wrong password. Please try again.",
        });
      else if (err.code === "auth/user-not-found") {
        return fResponse(403, {
          type: "danger",
          error: "No account found for that email. Please try again.",
        });
      } else if (err.code === "auth/too-many-requests") {
        return fResponse(403, {
          type: "danger",
          error:
            "Too many failed login attempts. Please wait a moment before trying again.",
        });
      } else
        return fResponse(500, {
          type: "danger",
          error: err,
        });
    });
  return response;
};
