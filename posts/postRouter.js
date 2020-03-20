const express = require("express");
const postDB = require("./postDb");
const router = express.Router();

// /api/posts
///////////////////////////////GET ROUTES//////////////////////////////////////////
router.get("/", async (req, res) => {
  try {
    const posts = await postDB.get();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




router.get("/:id", validatePostId, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postDB.getById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




///////////////////////////////////PUT ROUTES//////////////////////////////////////
router.put("/:id", validatePostId, validatePost, async (req, res) => {
  const {
    body,
    params: { id }
  } = req;
  try {
    const { user_id } = await postDB.getById(id);
    await postDB.update(id, { ...body, user_id });
    const updatedPost = await postDB.getById(id);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




////////////////////////////////DELETE ROUTES//////////////////////////////////////
router.delete("/:id", validatePostId, async (req, res) => {
  const { id } = req.params;
  try {
    await postDB.remove(id);
    res.status(200).send("Successfully deleted post.");
  } catch (error) {
    res.status(500).json({ error: "server error :(" });
  }
});




/////////////////////////////////MIDDLEWARE////////////////////////////////////////
async function validatePostId(req, res, next) {
  const { id } = req.params;
  try {
    const post = await postDB.getById(id);
    if (!post) {
      res.status(400).json({ message: "invalid post id" });
    } else {
      res.post = post;
    }
  } catch (error) {
    console.error(error);
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