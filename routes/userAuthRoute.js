const express = require('express');
const { register, login, getAllUsers } = require('../controllers/userAuthCtrl');
const { authentication } = require('../middi/auth');
const router = express.Router();

// /user/auth
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/getAllUser").get(authentication, getAllUsers)

module.exports = router