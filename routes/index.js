const express = require("express");
const { registerUser, loginUser, getProfile } = require("../controllers/user.controller");
const { createPost, updatePost, deletePost, getPosts, getPost, getPostsOfUser } = require("../controllers/post.controller");

const router = new express.Router();

// user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
// router.post("/logout", logoutUser);
//posts
router.post("/post", createPost);
router.put("/post/:postId", updatePost);
router.delete("/post/:postId", deletePost);
router.get("/post/:postId", getPost);
router.get("/posts", getPosts);
router.get("/posts/:userId", getPostsOfUser);


module.exports = router;
