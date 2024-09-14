const express = require('express');
const { authentication } = require('../middi/auth');
const { createMessage, getMessagesByConversationId } = require('../controllers/messageCtrl');
const router = express.Router();

// /user/message

router.route("/creeateMesssage/:conversationId").post(authentication, createMessage)
router.route("/getAllMessages/:conversationId").get(authentication, getMessagesByConversationId)

module.exports = router