const express = require('express');
const { authentication } = require('../middi/auth');
const { createMessage } = require('../controllers/messageCtrl');
const router = express.Router();

router.route("/creeateMesssage/:conversationId").post(authentication, createMessage)

module.exports = router