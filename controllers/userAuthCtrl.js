const UserModel = require("../models/userAuthModel");
const ConversationModel = require("../models/conversationModel");
const RequestModel = require("../models/requestModel");

const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");

// Register user
exports.register = async (req, res) => {
  try {
    const data = req.body;
    const { name, email, password } = data;

    // Simple validation

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter all fields" });
    }

    // Check for existing user
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }

    if (req.files && req.files.profilePic) {
      let image = req.files.profilePic;
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "BusImage",
      });

      data.profilePic = {
        public_Id: result.public_id,
        url: result.secure_url,
      };
    }

    // Create a new user
    const newUser = await UserModel.create(data);
    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
// route bnana h
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req.body;

    const check = await UserModel.findById(userId);
    if (!check) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    data.email = check.email;

    // Simple validation
    if (req.files && req.files.profilePic) {
      if (check.profilePic.public_Id && check.profilePic.url) {
        await cloudinary.uploader.destroy(check.profilePic.public_Id);
      }
      let image = req.files.profilePic;
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "BusImage",
      });

      data.profilePic = {
        public_Id: result.public_id,
        url: result.secure_url,
      };
    }
    // update profile
    const updatedata = await UserModel.findByIdAndUpdate(
      userId,
      { ...data },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "User created successfully",
      data: updatedata,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
////////////////////////////////
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter all fields" });
    }

    // Check for existing user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Validate password
    const checkUser = await UserModel.findOne({
      email: email,
      password: password,
    });

    if (!checkUser) {
      return res.status(404).json({ status: false, message: "user not found" });
    }
    const token = jwt.sign(
      { _id: checkUser.id, email: checkUser.email },
      process.env.JWT_SECRET_KEY
    );

    res
      .status(200)
      .json({ status: true, message: "login successful", token: token });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

//route bnana h
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res.status(200).json({ status: true, message: "user data", data: user });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

/* exports.getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const allUsers = await UserModel.find({ _id: { $ne: userId } });
    res
      .status(200)
      .json({ status: true, message: "All users", data: allUsers });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
}; */


exports.getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const allUsers = await UserModel.find({ _id: { $ne: userId } }, 'name email _id'); 

    const friendRequests = await RequestModel.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    const userRelationships = {};

    friendRequests.forEach(req => {
      const otherUserId = req.senderId.toString() === userId.toString() ? req.receiverId.toString() : req.senderId.toString();
      userRelationships[otherUserId] = req.status;
    });

    const usersWithStatus = allUsers.map(user => {
      const relationshipStatus = userRelationships[user._id.toString()] || 'none'; 
      return {
        ...user._doc, 
        relationshipStatus
      };
    });

    return res.status(200).json({
      status: true,
      message: "All users",
      data: usersWithStatus
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
