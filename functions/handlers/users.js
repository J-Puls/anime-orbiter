const { db, admin } = require("../util/admin");
const firebase = require("firebase");
const config = require("../util/config");
const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require("../util/validators");
firebase.initializeApp(config);

exports.getAllUsers = (req, res) => {
  db.collection("users")
    .get()
    .then((data) => {
      let users = [];
      data.forEach((doc) => {
        users.push({
          userID: doc.id,
          username: doc.data().username,
          email: doc.data().email,
          date_created: doc.data().date_created,
        });
      });
      return res.json(users);
    })
    .catch((err) => console.error(err));
};

exports.getUserById = (req, res) => {
  const requestedId = req.query.id;
  db.collection("users")
    .doc(requestedId)
    .get()
    .then((data) => {
      const userInfo = {
        userId: data.id,
        username: data.data().username,
        email: data.data().email,
      };
      return res.json(userInfo);
    })
    .catch((err) => console.error(err));
};

exports.signup = (req, res) => {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };
  const result = validateSignupData(newUser);
  if (!result.valid) return res.status(400).json({ error: result.error });

  const noImage = "no-img.png";

  let token, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({
          error: "This username is already taken, please try a different one.",
        });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        date_created: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
        userId,
      };
      db.doc(`/users/${newUser.username}`).set(userCredentials);
      return {
        id: userCredentials.userId,
        token,
      };
    })
    .then((data) => {
      const newList = {
        owner: data.id,
        contents: [],
        date_created: new Date().toISOString(),
      };
      db.collection("user_lists")
        .add(newList)
        .then(() => {
          return null;
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
      return res.status(201).json({
        message: `User and list created successfully!`,
        token: data.token,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({
          error: "An account already exists with this email.",
        });
      } else {
        return res.status(500).json({
          error: err.code,
        });
      }
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({
        token,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password")
        return res.status(403).json({
          error: "Wrong password. Please try again.",
        });
      else if (err.code === "auth/user-not-found") {
        return res.status(403).json({
          error: "No account found for that email. Please try again.",
        });
      } else if (err.code === "auth/too-many-requests") {
        return res.status(403).json({
          error:
            "Too many failed login attempts. Please wait a moment before trying again.",
        });
      } else return res.status(500).json({ error: err.code });
    });
};

exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const busboy = new BusBoy({
    headers: req.headers,
  });
  let imageFileName;
  let imageToBeUploaded;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({
        message: "Image must be JPEG or PNG",
      });
    }
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    imageFileName = `${Math.round(
      Math.random() * 10000000000
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = {
      filepath,
      mimetype,
    };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.username}`).update({
          imageUrl,
        });
      })
      .then(() => {
        return res.json({
          message: "Image uploaded successfully",
          imageUrl,
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          error: err.code,
        });
      });
  });
  busboy.end(req.rawBody);
};

exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.username}`)
    .update(userDetails)
    .then(() => {
      return res.json({
        message: "User details updated successfully",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  let userId = req.user.uid;
  db.doc(`/users/${req.user.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("user_lists")
          .where("owner", "==", userId)
          .orderBy("date_created", "desc")
          .get()
          .then((data) => {
            let listData = data.docs[0].data().contents;
            if (listData !== undefined) userData.list = listData;
            else userData.list = [];
            return res.json(userData);
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).json({
              error: err.code,
            });
          });
      }
      return null;
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};

exports.deleteAccount = (req, res) => {
  const user = req.user;
  admin
    .auth()
    .deleteUser(user.uid)
    .catch((err) => {
      console.error(err);
      return res.json({
        message: "Account deleted successfully.",
      });
    });
  db.collection("user_lists")
    .where("owner", "==", user.uid)
    .get()
    .then((data) => {
      db.collection("user_lists")
        .doc(data.docs[0].id)
        .delete()
        .catch((err) => {
          console.error(err);
          return res.status(500).json({
            error: err,
          });
        });
      return null;
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err,
      });
    });
  db.collection("users")
    .doc(user.username)
    .delete()
    .then(() => {
      return res.json({
        message: "Profile and list deleted successfully.",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err,
      });
    });
};
