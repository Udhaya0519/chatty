import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../config/socket.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const updateProfilePic = async (req, res) => {
   try {
      const profilePic = req.file;
      const { userId } = req;

      if (!profilePic) {
         return res
            .status(400)
            .json({ success: false, message: "Upload an image" });
      }

      const uploadResponse = await cloudinary.uploader.upload(profilePic.path);

      const user = await User.findByIdAndUpdate(
         userId,
         { profilePic: uploadResponse.secure_url },
         { new: true }
      ).select("-password");

      res.status(200).json({
         success: true,
         message: "Profile picture changed",
         user,
      });
   } catch (err) {
      console.log("Error uploading Profile pic", err);
      res.status(500).json({ success: false, message: "Server Error" });
   }
};

export const getUsersForSidebar = async (req, res) => {
   try {
      const loggedInUserId = req.userId;

      const filteredUsers = await User.find({
         _id: { $ne: loggedInUserId },
      }).select("-password");

      res.status(200).json({ success: true, users: filteredUsers });
   } catch (err) {
      console.log("Error in getting sidebar users", err);
      res.status(500).json({ success: false, message: "Server Error" });
   }
};

export const getMessages = async (req, res) => {
   try {
      const { id: userToChatId } = req.params;
      const myId = req.userId;

      const messages = await Message.find({
         $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
         ],
      });

      res.status(200).json({ success: true, messages: messages });
   } catch (err) {
      console.log("Error in getting messages", err);
      res.status(500).json({ success: false, message: "Server Error" });
   }
};

export const sendMessage = async (req, res) => {
   try {
      const { text } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.userId;

      let imageUrl;
      if (req.file) {
         const uploadResponse = await cloudinary.uploader.upload(req.file.path);
         imageUrl = uploadResponse.secure_url;
      }

      const newMessage = new Message({
         senderId,
         receiverId,
         text,
         image: imageUrl,
      });

      await newMessage.save();

      //realtime functionality goes here => socket.io
      const receiverSocketId = getReceiverSocketId(receiverId)

      if(receiverSocketId){
         io.to(receiverSocketId).emit("newMessage", newMessage)
      }

      res.status(201).json({ success: true, messages: newMessage });
   } catch (err) {
      console.log("Error in send message", err);
      res.status(500).json({ success: false, message: "Server Error" });
   }
};
