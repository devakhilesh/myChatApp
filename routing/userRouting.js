const express = require('express');
const userRoute = express();

const userAuth = require("../routes/userAuthRoute")
const conversation = require("../routes/conversationRoute");
const message = require("../routes/messageRoute");
userRoute.use("/user/auth", userAuth);
userRoute.use("/user/conversation", conversation);
userRoute.use("/user/message", message);

module.exports = userRoute