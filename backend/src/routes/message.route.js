import express from 'express'
import { protectRoute } from '../middleware/auth.middleware';
import { getSidebarUsers,getMessages } from '../controllers/message.contoller';

const router = express.Router()

router.get("/users",protectRoute,getSidebarUsers);
router.get("/:id",protectRoute,getMessages)

router.post("/send/:id",protectRoute,sendMessage);

export default router;