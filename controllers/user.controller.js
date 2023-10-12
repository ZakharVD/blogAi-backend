const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

async function registerUser(req, res) {
  const { username, authorname, password } = req.body;
  try {
    const userDoc = await UserModel.create({
      username,
      authorname,
      password: bcrypt.hashSync(password, salt),
    });
    return res.status(200).json({
      message: "Account have been created.",
      username: userDoc.username,
      id: userDoc._id,
      authorname: userDoc.authorname,
    });
  } catch (error) {
    res.status(400).json({ message: "Error during registration." });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (userDoc !== null) {
      const isPasswordValid = bcrypt.compareSync(password, userDoc.password);
      if (isPasswordValid === true) {
        jwt.sign({ username, id: userDoc._id }, secret, (error, token) => {
          if (error) throw error;
          res.status(200).json({
            token: token,
            message: "User have been logged in successfully",
            id: userDoc._id,
            username,
            authorname: userDoc.authorname,
          });
        });
      } else {
        return res
          .status(400)
          .json({ message: "User with such credential does not exist" });
      }
    }
  } catch (error) {
    return res.status(400).json({ message: "Error during login" });
  }
}

function getProfile(req, res) {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    if (token) {
      jwt.verify(token, secret, {}, (error, info) => {
        if (error) throw error;
        return res.status(200).json(info);
      });
    } else {
      return res.status(400).json({ message: "No token provided" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error occured" });
  }
}

// function logoutUser(req, res) {
//   res.cookie("token", "").status(200).json("logout ok");
// }

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
//{domain: "blogai-web.netlify.app", secure: true, sameSite: "none"}