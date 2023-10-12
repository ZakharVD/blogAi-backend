const PostModel = require("../models/post.model");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const secret = process.env.JWT_SECRET;

async function createPost(req, res) {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    if (token) {
      jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error;
        const { title, content } = req.body;
        const postData = await PostModel.create({
          title: title,
          content: content,
          author: info.id,
        });
        return res.status(200).json({
          message: "Post have been created",
          postData: postData,
        });
      });
    } else {
      return res.status(400).json({ message: "No token provided" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error creating a post" });
  }
}

async function updatePost(req, res) {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    if (token) {
      jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error;
        const { postId } = req.params;
        const { title, content } = req.body;
        await PostModel.findByIdAndUpdate(postId, {
          title,
          content,
        });
        return res.status(200).json({ message: "Post have been updated." });
      });
    } else {
      return res.status(400).json({ message: "No token provided" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error updating a post" });
  }
}

async function deletePost(req, res) {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    if (token) {
      jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error;
        const { postId } = req.params;
        await PostModel.findByIdAndRemove(postId);
        return res.status(200).json({ message: "Post have been deleted" });
      });
    } else {
      return res.status(400).json({ message: "No token provided" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error deleting post" });
  }
}

async function getPosts(req, res) {
  try {
    const postsData = await PostModel.find()
      .populate("author", ["authorname"])
      .sort({ createdAt: -1 });
    return res.status(200).json(postsData);
  } catch (error) {
    return res.status(400).json({ message: "Error getting posts" });
  }
}

async function getPost(req, res) {
  try {
    const { postId } = req.params;
    const postData = await PostModel.findById(postId).populate("author", [
      "authorname",
    ]);
    return res.status(200).json(postData);
  } catch (error) {
    return res.status(500).json({ message: "Error getting the post" });
  }
}

async function getPostsOfUser(req, res) {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    const { userId } = req.params;
    if (token) {
      jwt.verify(token, secret, {}, async (error, info) => {
        if (error) throw error;
        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const posts = await PostModel.find({ author: user._id }).populate("author", [
          "authorname",
        ]);
        return res.json(posts);
      });
    } else {
      return res.status(400).json({ message: "No token provided" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPost,
  getPostsOfUser,
};