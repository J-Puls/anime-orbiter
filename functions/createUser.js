const { db } = require("./util/admin");
const firebase = require("firebase");
const config = require("./util/config");
const { validateSignupData } = require("./util/validators");
const { fResponse } = require("./util/fResponse");
const rr = require("rainbow-road");

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async (req, res) => {
  const data = JSON.parse(req.body);
  const noImage = "no-img.png";
  const userInfo = {
    username: data.username,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
  };

  const accountExists = await db
    .collection("users")
    .where("username", "==", data.username)
    .get()
    .then((data) => {
      if (!data.empty) throw Error("This username is already taken!");
      return false;
    })
    .catch((err) => {
      rr.err(`${err}`);
      return true;
    });

  if (accountExists)
    return fResponse(400, {
      type: "danger",
      error: "This username is already taken!",
    });
  rr.succ(`Username is available!`);

  // Create a new Firebase Authentication entry
  const credentials = await firebase
    .auth()
    .createUserWithEmailAndPassword(data.email, data.password)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      rr.err(err);
      return err;
    });

  // If account creation fails, return failure response
  if (!credentials.user.uid)
    return fResponse(400, {
      type: "danger",
      error: "Failed to validate credentials.",
    });

  rr.info(`${credentials.user}`);
  rr.succ(`Account created successfully with the above credentials`);

  // Validate user signup credentials
  const validation = validateSignupData(userInfo);
  if (!validation.valid)
    return fResponse(400, { type: "danger", error: validation.error });
  rr.succ("Credentials Validated Successfully!");

  const profileInfo = {
    username: userInfo.username,
    email: userInfo.email,
    date_created: new Date().toISOString(),
    image_url: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
    uid: credentials.user.uid,
  };

  // Create profile and list with validated credentials
  const response = db
    .doc(`/users/${credentials.user.uid}`)
    .set(profileInfo)
    .then(async () => {
      rr.succ("User Profile Created Successfully!");

      const newList = {
        owner: credentials.user.uid,
        contents: [],
        date_created: new Date().toISOString(),
      };

      await db
        .collection("user_lists")
        .add(newList)
        .then(() => {
          rr.succ(`User List Created Successfully!`);
        })
        .catch((err) => {
          rr.err(`${err}`);
          return fResponse(500, { type: "danger", error: err });
        });

      const token = await credentials.user.getIdToken();

      return fResponse(201, {
        type: "success",
        message: "User and list created successfully!",
        credentials: profileInfo,
        token,
      });
    });

  return response;
};
