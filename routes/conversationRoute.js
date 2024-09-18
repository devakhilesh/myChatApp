const express = require('express');
const { authentication } = require('../middi/auth');
const { createConversation, getAllConversations } = require('../controllers/conversationCtrl');
const router = express.Router();
// /user/conversation
router.route("/createConversation/:receiverId").put(authentication,createConversation)

router.route("/getAllCoversation").get(authentication,getAllConversations)

module.exports = router


