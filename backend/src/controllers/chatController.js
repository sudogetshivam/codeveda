import { chatClient } from "../lib/streams.js";

export async function getStreamToken(req,res){
try {
    //use clerkId for Stream, not mongoDb id it should match with id wehave in stream dashboard
    const token = chatClient.createToken(req.user.clerkId)
    res.status(200).json({
        token,
        userId : req.user.clerkId,
        userName :  req.user.name
    })
} catch (error) {
    res.status(500).json({msg:"Internal Server Error"})
}
    
}