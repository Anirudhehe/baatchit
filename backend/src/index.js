import express from 'express';
import dotenv from "dotenv"
import authRoutes from './routes/auth.route.js'
import {connectDB} from './lib/db.js'

dotenv.config()

const app = express();
app.use(express.json());
const PORT = process.env.PORT;
app.get("/",(req,res)=>{
    res.send("this is home")
})
app.use("/api/auth",authRoutes);

app.listen(PORT,()=>{
    console.log("server chalgya")
    connectDB();
})