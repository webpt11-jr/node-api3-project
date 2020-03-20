const express = require("express");
const userDB = require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

// /api/users
///////////////////////////////GET ROUTES//////////////////////////////////////////
router.get("/", async (req, res) => {
  try {
    const posts = await userDB.get();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




router.get("/:id", validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userDB.getById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




router.get("/:id/posts", validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    const userPosts = await userDB.getUserPosts(id);
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




////////////////////////////////POST ROUTES////////////////////////////////////////
router.post("/", validateUser, async (req, res) => {
  try {
    const newUser = await userDB.insert(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  const { id } = req.params;
  try {
    const payload = { ...req.body, user_id: id };
    const newPost = await postDB.insert(payload);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




///////////////////////////////////PUT ROUTES//////////////////////////////////////
router.put("/:id", validateUserId, validateUser, async (req, res) => {
  const {
    body,
    params: { id }
  } = req;
  await userDB.update(id, body);
  const updatedUser = await userDB.getById(id);
  res.status(201).json(updatedUser);
  try {
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




////////////////////////////////DELETE ROUTES//////////////////////////////////////
router.delete("/:id", validateUserId, async (req, res) => {
  const { id } = req.params;
  try {
    await userDB.remove(id);
    res.status(200).send("successfully deleted user.");
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




/////////////////////////////////MIDDLEWARE////////////////////////////////////////
async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
    const user = await userDB.getById(id);
    if (!user) {
      res.status(400).json({ message: "invalid user id" });
    } else {
      req.user = user;
    }
  } catch (error) {
    console.error(error);
  }
  next();
}

function validateUser(req, res, next) {
  const { body } = req;
  if (!Object.keys(body).length) {
    res.status(400).json({ message: "missing user data" });
  } else if (!body.name) {
    res.status(400).json({ message: "missing required name field" });
  }
  next();
}

function validatePost(req, res, next) {
  const { body } = req;
  if (!Object.keys(body).length) {
    res.status(400).json({ message: "missing post data." });
  } else if (!body.text) {
    res.status(400).json({ message: "missing required text field." });
  }
  next();
}

module.exports = router;