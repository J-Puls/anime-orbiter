const { db } = require("../util/admin");

exports.getAllLists = (req, res) => {
  db.collection("user_lists")
    .get()
    .then((data) => {
      let lists = [];
      data.forEach((doc) => {
        lists.push({
          listID: doc.id,
          owner: doc.data().owner,
          contents: doc.data().contents,
        });
      });
      return res.json(lists);
    })
    .catch((err) => console.error(err));
};

exports.addNewList = (req, res) => {
  const newList = {
    owner: req.user.user_id,
    contents: [],
    date_created: new Date().toISOString(),
  };
  db.collection("user_lists")
    .add(newList)
    .then((doc) => {
      return res.status(201).json({
        message: `document ${doc.id} created successfully!`,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

exports.getListByOwner = (req, res) => {
  const userId = req.user.uid;
  db.collection("user_lists")
    .where("owner", "==", userId)
    .orderBy("date_created", "desc")
    .get()
    .then((data) => {
      return res.status(200).json(data.docs[0].data().contents);
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

exports.addTitleToList = (req, res) => {
  const newTitle = req.body;
  const userId = req.user.uid;
  db.collection("user_lists")
    .where("owner", "==", userId)
    .orderBy("date_created", "desc")
    .get()
    .then((data) => {
      let newList = new Set(data.docs[0].data().contents);
      newList.add(newTitle);
      newList = Array.from(newList);
      db.collection("user_lists")
        .doc(data.docs[0].id)
        .update({
          contents: newList,
          last_modified: new Date().toISOString(),
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({
            error: err.code,
          });
        });

      return "Title added successfully";
    })
    .then((message) => {
      db.collection("user_lists")
        .where("owner", "==", userId)
        .orderBy("date_created", "desc")
        .get()
        .then((data) => {
          return res
            .status(200)
            .json({ message, updated_list: data.docs[0].data().contents });
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};

exports.removeTitleById = (req, res) => {
  const id = req.body.idToRemove;
  const userId = req.user.uid;
  db.collection("user_lists")
    .where("owner", "==", userId)
    .limit(1)
    .get()
    .then((data) => {
      let currentList = data.docs[0].data().contents;
      let newList;
      currentList.forEach((item) => {
        if (item.mal_id === id) {
          newList = currentList.filter((value) => {
            return value !== item;
          });
          db.collection("user_lists")
            .doc(data.docs[0].id)
            .update({
              contents: newList,
              last_modified: new Date().toISOString(),
            })
            .catch((err) => {
              return res.status(500).json({
                error: err.code,
              });
            });
        }
      });
      return "Document updated successfully";
    })
    .then((message) => {
      db.collection("user_lists")
        .where("owner", "==", userId)
        .orderBy("date_created", "desc")
        .get()
        .then((data) => {
          return res
            .status(200)
            .json({ message, updated_list: data.docs[0].data().contents });
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};

exports.saveUserChanges = (req, res) => {
  const newData = req.body;
  const userId = req.user.uid;
  db.collection("user_lists")
    .where("owner", "==", userId)
    .limit(1)
    .get()
    .then((data) => {
      let currentList = data.docs[0].data().contents;
      let newList = Array.from(currentList);
      newList.forEach((item, index) => {
        if (item.mal_id === newData.mal_id) {
          newList[index].title = newData.title;
          newList[index].score = newData.score;
          newList[index].airing = newData.airing;
          newList[index].rated = newData.rated;
          newList[index].episodes = newData.episodes;
          newList[index].synopsis = newData.synopsis;
          db.collection("user_lists")
            .doc(data.docs[0].id)
            .update({
              contents: newList,
              last_modified: new Date().toISOString(),
            })
            .catch((err) => {
              return res.status(500).json({
                error: err.code,
              });
            });
        }
      });
      return res.json({
        message: "Document updated successfully",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};
