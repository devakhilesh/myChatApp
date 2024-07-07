const ConversationModel = require("../models/conversationModel");

exports.createConversation = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const receiverId = req.params.receiverId;

    // Ensure senderId is always the authenticated user
    const data = {
      senderId: userId,
      receiverId: receiverId,
    };

    // Check if a conversation already exists between these two users
    const checkConversation = await ConversationModel.findOne({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    });
    // need to handle message
    if (!checkConversation) {
      const conversation = await ConversationModel.create(data);
      return res.status(201).json({
        status: true,
        message: "Conversation created successfully",
        data: conversation,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Conversation already exists",
        data: checkConversation,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const allConversations = await ConversationModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).populate('senderId receiverId');
    res
      .status(200)
      .json({
        status: true,
        message: "allConversations returned",
        data: allConversations,
      });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};
