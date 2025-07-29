import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getSidebarUsers,getMessages,sendMessage } from '../controllers/message.contoller.js';

const router = express.Router()

router.get("/users",protectRoute,getSidebarUsers);
router.get("/:id",protectRoute,getMessages)

router.post("/send/:id",protectRoute,sendMessage);

export default router;