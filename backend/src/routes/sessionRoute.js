import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import {
    createSession,
    getActiveSessions,
    getMyRecentSessions,
    getSessionById,
    joinSession,
    endSession
} from "../controllers/sessionController.js"

const sessionRoute = express.Router()
sessionRoute.post("/",protectRoute,createSession)
sessionRoute.get("/active",protectRoute,getActiveSessions)
sessionRoute.get("/my-recent",protectRoute,getMyRecentSessions)

sessionRoute.get("/:id",protectRoute,getSessionById) // :id -> when you put colon in route, it means its value is dynamic
sessionRoute.post("/:id/join",protectRoute,joinSession)
sessionRoute.post("/:id/end",protectRoute,endSession)
export default sessionRoute