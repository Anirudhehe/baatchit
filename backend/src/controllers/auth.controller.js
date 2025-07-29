import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req,res)=>{
    const {fullName,email,password} = req.body
       try {
       if(!fullName || !password || !email){
            return res.status(400).json({message:"All fields are required"});
 
       } 
        if(password.length < 6){
            return res.status(400).json({message:"Password must be atleast 6 characters long"});
        }
        const user = await User.findOne({email})
        if(user) return res.status(400).json({message:"User already exists with same email"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword,
        })

        if(newUser){
        // if user is created, generate the jwt tokens which you send via res
            generateToken(newUser._id,res)
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,


            })
        }else{
            res.status(400).json("Invalid user data");
        }
       } catch (error) {
        console.log("error in signup controller",error)
        res.status(500).json({message:'Internal Server error'},error)
        
       } 
        

}

export const login = async (req,res)=>{
   try {
    const {email,password} =req.body;

   const user = await User.findOne({email})
   if(!user) return res.status(400).json({message:"Invalid login credentials"});

   const isPassCorrect = bcrypt.compare(user.password,password);
   if(!isPassCorrect) return res.status(400).json({message:"Invalid login credentials"});

   generateToken(user._id,res); 
   res.status(200).json({
    _id: user._id,
    fullName:user.fullName,
    profilePic:user.profilePic,
    email:user.email,
   }); 

   
   } catch (error) {
    console.log("there was an error in login controller: ",error);    
    res.status(500).json({message:'Internal Server error'})
   }
    
}
export const logout = (req,res)=>{
    try {
       res.cookie("jwt","",{maxAge:0});
       res.status(200).json({message:"Logged out successfully"}); 
    } catch (error) {
        console.log("error in logout controller: ",error)
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const updateProfile = async(req,res) =>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic) return res.status(401).json({message:"Profile pic required"});
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json({message:"Profile picture changed succesfully"});
        
    } catch (error) {
       console.log("Error in update profile: ",error) 
       res.status(500).json({message:"Internal Server Error"}); 
    }



}

export const checkAuth = (req,res) => {
    try {
       res.status(200).json(req.user);  
    } catch (error) {
       console.log("Error in user authentication: ",error) 
       res.status(500).json({message:"Internal Server Error"});
    }
}