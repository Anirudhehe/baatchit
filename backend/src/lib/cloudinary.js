import {v2 as cloudinary } from "cloudinary"; 
import {config} from 'dotenv'
config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.envCLOUDINARY_KEY,
cloud_secret : process.env.CLOUDINARY_SECRET,

});

export default cloudinary;