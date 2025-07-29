import cloudinary from "../lib/cloudinary";
import Message from "../models/message.model";
import User from "../models/user.model";

export const getSidebarUsers = async(req,res)=>{
    try {
        const currentUser = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:currentUser}}).select("-password");
        res.status(200).json(filteredUsers);

    } catch (error) {
       console.log("Error in messafe controller: ",error);
       res.status(500).json({message:"Internal Server Error"}); 
    }
}

export const getMessages = async(req,res) =>{
    try {
       const {id:userToChat} = req.params;
       const myId = req.user._id;
       const messages = await Message.find({
        $or:[
            {senderId:myId,receiverId:userToChat},
            {senderId:userToChat,senderId:myId},
        ]
       })
       res.status(200).json(messages);
    } catch (error) {
       console.log("Error in message controller: ",error) 
       res.status(500).json({message:"Internal Server Error..."}); 
    }
}

export const sendMessage = async (req,res)=>{
    try {
        const {image,text} = req.body; 
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,

        });
        await newMessage.save();
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage function: ",error)
        res.send(500).json({message:"Internal Server Error..."}); 
        
    }
}