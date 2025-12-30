import { protectRoute } from "../middleware/protectRoute.js"
import express from "express"
import { getStreamToken } from "../controllers/chatController.js"

const chatRouter = express.Router() 

chatRouter.get("/token",protectRoute,getStreamToken)
export default chatRouter