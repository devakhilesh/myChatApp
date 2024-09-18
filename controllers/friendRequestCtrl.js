const RequestModel = require("../models/requestModel");
const ConversationModel = require("../models/conversationModel");

// Send Request
exports.sendRequest = async (req, res) => {
  try {
    let userId = req.user._id;
    let receiverId = req.params.receiverId;
    let data = req.body;
    data.senderId = userId;
    data.receiverId = receiverId;

    const existingRequest = await RequestModel.findOne({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ status: false, message: "Request already exists" });
    }

    const requestdata = await RequestModel.create(data);
    if (!requestdata) {
      return res.status(400).json({ status: false, message: "Request failed" });
    }

    return res.status(201).json({
      status: true,
      message: "Request sent successfully",
      data: requestdata,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
// get All Request
exports.getAllRequests = async (req, res) => {
  try {
    let userId = req.user._id;
    let filter = req.query;

    let query = {};

    if (filter.sent) {
      query.senderId = userId;
    }

    if (filter.received) {
      query.receiverId = userId;
    }

    if (filter.friends) {
      query.status = "accepted";
    }

    let requests = await RequestModel.find(query)
      .populate("senderId receiverId", "name email")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
// accept request
exports.acceptRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const requestId = req.params.requestId;

    const request = await RequestModel.findById(requestId);

    if (!request || request.receiverId.toString() !== userId.toString()) {
      return res
        .status(404)
        .json({ status: false, message: "Request not found" });
    }

    request.status = "accepted";

    const checkConversation = await ConversationModel.findOne({
      $or: [
        { senderId: request.senderId, receiverId: request.receiverId },
        { senderId: request.receiverId, receiverId: request.senderId },
      ],
    });

    // If no conversation exists, create a new one
    if (!checkConversation) {
      const newConversation = new ConversationModel({
        senderId: request.senderId,
        receiverId: request.receiverId,
      });

      await newConversation.save();
    }

    await request.save();

    return res.status(200).json({
      status: true,
      message: "Request accepted successfully",
      data: request,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
// reject Request
exports.rejectRequest = async (req, res) => {
  try {
    let requestId = req.params.requestId;

    let request = await RequestModel.findById(requestId);
    if (!request || request.receiverId.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ status: false, message: "Request not found" });
    }

    await RequestModel.findByIdAndDelete(requestId);

    return res.status(200).json({
      status: true,
      message: "Request rejected and removed successfully",
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// need to modify the logic
exports.blockRequest = async (req, res) => {
  try {
    let requestId = req.params.requestId;

    let request = await RequestModel.findById(requestId);
    if (!request || request.receiverId.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ status: false, message: "Request not found" });
    }

    request.status = "blocked";
    await request.save();

    return res.status(200).json({
      status: true,
      message: "Request blocked successfully",
      data: request,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// need to modify the logic
exports.unblockRequest = async (req, res) => {
  try {
    let requestId = req.params.requestId;

    let request = await RequestModel.findById(requestId);
    if (!request || request.receiverId.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ status: false, message: "Request not found" });
    }
    
    if (request.status !== "blocked") {
      return res.status(400).json({
        status: false,
        message: "Request is not blocked",
      });
    }

    request.status = "unblocked";
    await request.save();

    return res.status(200).json({
      status: true,
      message: "Request unblocked successfully",
      data: request,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
