const messageModel = require("../models/Messages");
const RequestModel = require("../models/requestModel");
const ConversationModel = require("../models/conversationModel");

exports.createMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req.body;
    const conversationId = req.params.conversationId;

    // const delMessage = await messageModel.deleteMany(ObjectId(req.body.conversationId))
    // console.log(delMessage)
    // return res.json(delMessage)

    let { senderId, message } = data;
    data.senderId = userId;
    data.conversationId = conversationId;

    if (!conversationId) {
      return res
        .status(400)
        .json({ status: false, message: "Conversation id is required" });
    }

    const checkConversation = await ConversationModel.findById(conversationId);

    if (!checkConversation) {
      return res
        .status(404)
        .json({ status: false, message: "Conversation not found" });
    }

    if (!message || message === "") {
      return res
        .status(400)
        .json({ status: false, message: "Message is required" });
    }
    const checkFriendStatus = await RequestModel.findOne({
      $or: [
        {
          senderId: checkConversation.senderId,
          receiverId: checkConversation.receiverId,
        },
        {
          senderId: checkConversation.receiverId,
          receiverId: checkConversation.senderId,
        },
      ],
    });

    if (!checkFriendStatus) {
      return res
        .status(403)
        .json({ status: false, message: "You are not a friend of this user" });
    }

    if (checkFriendStatus.status !== "accepted") {
      return res
        .status(403)
        .json({
          status: false,
          message: "Friend request is not accepted yet so you cant talk ",
        });
    }

    const saveMessage = await messageModel.create(data);
    // Emit the message to the specific conversation room using socket.io

    if (req.io) {
      req.io.to(conversationId).emit("new message", saveMessage);
      //   console.log( req.io.to(conversationId).emit("new message", saveMessage))
    }
    
    res.status(201).json({
      status: true,
      message: "message send successfully",
      // data: saveMessage,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

exports.getMessagesByConversationId = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    if (!conversationId) {
      return res
        .status(400)
        .json({ status: false, message: "Conversation ID is required" });
    }

    const messages = await messageModel
      .find({ conversationId })
      .populate("senderId", "name email"); // Adjust populate fields as needed

    //   if (messages.length === 0) {
    //     return res
    //       .status(404)
    //       .json({ status: false, message: "No messages found for this conversation" });
    //   }

    res.status(200).json({
      status: true,
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
