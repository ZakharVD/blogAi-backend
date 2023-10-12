require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require("./routes/index");

const app = express();

const PORT = 4000;

app.use(cors({
    credentials: true,
    origin: "https://blogai-web.netlify.app",
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

async function onServerStart() {
  await mongoose.connect(process.env.MONGODB_URL);
  app.listen(PORT, () => console.log("SERVER STARTED"));
}
onServerStart();
