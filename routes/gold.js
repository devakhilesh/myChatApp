const express = require('express')
const { goldSilverRate } = require('../goldSilver')
const router = express.Router()



router.route('/goldSilverRate').get(goldSilverRate)

module.exports = router

