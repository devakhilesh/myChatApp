const express = require('express')
const { sendRequest, getAllRequests, acceptRequest, rejectRequest, blockRequest, unblockRequest } = require('../controllers/friendRequestCtrl')
const { authentication } = require('../middi/auth')
const router = express.Router()

router.route('/sendRequest/:receiverId').post(authentication ,sendRequest)
router.route('/allRequest').get(authentication ,getAllRequests)
router.route('/acceptRequest/:requestId').put(authentication ,acceptRequest)
router.route('/rejectRequest/:requestId').post(authentication ,rejectRequest)
router.route('/blocked/:requestId').post(authentication ,blockRequest)
router.route('/unblock/:requestId').post(authentication ,unblockRequest)

module.exports = router

