import express from 'express';
import dotenv from "dotenv"
import authRoutes from './routes/auth.route.js'

dotenv.config()

const app = express();
const PORT = process.env.PORT;
m
app.use("/api/auth",authRoutes);
app.get("/",(req,res)=>{
    res.send("this is home")
})
app.listen(PORT,()=>{
    console.log("server chalgya")
})