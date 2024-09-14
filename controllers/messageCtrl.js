const messageModel = require("../models/Messages")

let messages = []
exports.createMessage = async (req,res)=>{
    try{
const userId = req.user._id
const data = req.body
const conversationId = req.params.conversationId
// const delMessage = await messageModel.deleteMany(ObjectId(req.body.conversationId))
// console.log(delMessage)
// return res.json(delMessage)
let {senderId, message} = data
data.senderId = userId
data.conversationId = conversationId
if(!conversationId){
    return res.status(400).json({status:false , message:"Conversation id is required"});
}
if(!message || message === ""){
    return res.status(400).json({status:false , message:"Message is required"});
}

const saveMessage = await messageModel.create(data)
// Emit the message to the specific conversation room using socket.io
console.log(req.io)
messages.push({ message, conversationId });
if (req.io) {
    req.io.emit("new message", messages);
  }
res.status(201).json({status:true, message:"message send successfully", data:saveMessage})

    }catch(err){
        res.status(500).json({status:false , message:err.message});
    }
}


exports.getMessagesByConversationId = async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
  
      if (!conversationId) {
        return res
          .status(400)
          .json({ status: false, message: "Conversation ID is required" });
      }
  
      const messages = await messageModel.find({ conversationId }).populate('senderId', 'name email'); // Adjust populate fields as needed
  
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