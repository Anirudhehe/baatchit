import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"

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

export const login = (req,res)=>{
    res.send("this is a login route");
}
export const logout = (req,res)=>{
    res.send("this is a logout route");
}
