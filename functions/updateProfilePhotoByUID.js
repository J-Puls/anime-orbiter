const { db } = require("./util/admin");
const firebase = require("firebase");
const config = require("./util/config");
const { fResponse } = require("./util/fResponse");
const fbAuth = require("./util/fbAuth");
const rr = require("rainbow-road");
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

if (!firebase.apps.length) firebase.initializeApp(config);

exports.handler = async (req, res) => {
  const isAuthenticated = await fbAuth(req);
  if (!isAuthenticated) {
    rr.err("Authentication Failed.");
    return fResponse(403, { type: "danger", error: "Authentication Failed" });
  }

  const requestBody = JSON.parse(req.body);
  const uid = req.headers.uid;

  const busboy = new BusBoy({
    headers: req.headers,
  });
  let imageFileName;
  let imageToBeUploaded;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      rr.err(`Image not of type JPEG or PNG`);
      return fResponse(400, {
        type: "danger",
        error: "Image must be JPEG or PNG file type only!",
      });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 10000000000
    )}.${imageExtension}`;

    const filepath = path.join(os.tmpdir(), imageFileName);

    imageToBeUploaded = { filepath, mimetype };
    console.log(imageToBeUploaded);
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
      .then(async () => {
        const image_url = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return await db.doc(`/users/${uid}`).update({
          image_url,
        });
      })
      .then(() => {
        rr.succ(`Image Uploaded Successfully!`);
        fResponse(200, {
          type: "success",
          message: "Image uploaded successfully!",
        });
      })
      .catch((err) => {
        rr.err(`${err}`);
        return fResponse(500, {
          type: "danger",
          error: "Something went wrong.",
        });
      });
  });
  busboy.end(req.rawBody);
};
