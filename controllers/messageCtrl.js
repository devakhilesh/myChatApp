const messageModel = require("../models/Messages")


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

res.status(201).json({status:true, message:"message send successfully", data:saveMessage})

    }catch(err){
        res.status(500).json({status:false , message:err.message});
    }
}


