import Session from "../models/Session.js"
import { chatClient, streamClient } from "../lib/streams.js"

export async function createSession(req,res){
     try {
        const {problem, difficulty} = req.body
        const hostId = req.user._id
        const clerkId = req.user.clerkId
   
        if(!problem || !difficulty){
           return res.status(400).json({message:"Problem and Difficulty are required"})
        }
        //generate unique call id
        const callId = `session_${crypto.randomUUID()}`

        const session = await Session.create({problem,difficulty,host : hostId,callId})

      //create stream video call
      await streamClient.video.call("default",callId).getOrCreate({
         data:{
            created_by_id:clerkId,
            custom:{
               problem,
               difficulty,
               sessionId:session._id.toString()
            }
         }
      })

      //create chat
      const channel = chatClient.channel("messaging",callId,{
         name:`${problem} session`,
         created_by_id: clerkId,
         members: [clerkId]
      })

      await channel.create()

      res.status(201).json({session})
     } catch (error) {  
        console.log("Error in createSession controller: ",error.message)
        return res.status(500).json({message: "Internal server error"})
     }

}

export async function getActiveSessions(req,res){ // here req is not being used you can put underscore there

   try {
       const sessions =await  Session.find({status:"active"}) // look for now it is only checking active sessions, what if any session is not active, think about that scenario also
       sessions.populate("host","name profileImage email clerkId").
       sort({createdAt:-1}).limit(20)

       res.status(200).json({sessions})
   } catch (error) {
       console.log("Error in getActiveSessions controller: ",error.message)
       return res.status(500).json({message: "Internal server error"})
   }
}

export async function getMyRecentSessions(req,res){

   try {
      const userId =   req.user._id
      //get sesssions where either user is a host or participant
      const sessions = await Session.find({status:"completed",
         $or:[{host:userId},{participant:userId}],
   }).sort({createdAt:-1}).limit(20);

   return res.status(200).json(sessions)
      
   } catch (error) {
      console.log("Error in getMyRecentSessions controller: ",error.message)
        res.status(500).json({message: "Internal server error"})
   }
}


export async function getSessionById(req,res){
try {
   const {id} = req.params // jo router main pass kiye ho variable wahi karna hain, sessionRoute.get("/:id",protectRoute,getSessionById
   
   
   /*
   OLD SCHOOL WAY
   const params = req.params; // Pehle pura object lo
const id = params.id;      // Phir usme se id nikalo
   */

   const session = await Session.findById(id).populate("host","name profileImage email clerkId").
   populate("participant","name profileImage email clerkId")

   if(!session) res.status(404).json({message:"Session not Found"})
   res.status(200).json(message)
} catch (error) {
   console.log("Error in getSessionById controller: ",error.message)
  return res.status(500).json({message: "Internal server error"})
}

}


export async function joinSession(req,res){
   try {
      const {id} = req.params
      const userId = req.user._id
      const clerkId = req.user.clerkId

      const session = await Session.findById(id)
      //only to members are allowed so check it
         if(!session) return res.status(404).json({message:"Session not Found"})
         if(session.host.toString() === userId.toString()) return res.status(400).json({message:"Host cannot join as participant"})

      if(session.participant) return res.status(400).json({message:"Session is Full"})  
      session.participant = userId
      await session.save()
      
      const channel = chatClient.channel("messaging",session.callId)
      await channel.addMembers([clerkId])
      /**
      
      Summary:

      [] kyu? Kyunki function hamesha List maangta hai (future-proof rehne ke liye).

      Multiple log? Bas comma laga ke aur ID daal do [id1, id2, id3].

      Kaam kya hai? User ko us specific room ka Official Member banana taaki wo chat/call kar paye. ✅

       */
   return res.status(200).json(message)

   } catch (error) {
         console.log("Error in joinSession controller: ",error.message)
   return res.status(500).json({message: "Internal server error"})
   }
}


export async function endSession(req,res){
   try {
      const {id} = req.params
      const userId =  req.user._id

      const session = await Session.findById(id)
      if(!session) return res.status(404).json({message:"Session doesnt exist"})

      //check if user is host   
      if(session.host.toString()!= userId.toString()){ // hence  type: mongoose.Schema.Types.ObjectId means that moongose id, not that normal id
         return res.status(403).json({message:"Only host can end session"})
      }

      if(session.status==="completed"){
         return res.status(403).json({message:"Session already completed"})
      }

      //now delete video call

      //first grab the videocall by id
      const call = chatClient.channel("default",session.callId);
      await call.delete({hard:true})

      //now delete chat
      const channel = chatClient.channel("messaging",session.callId);
      await channel.delete();

      session.status = "completed"
      await session.save()

     return res.status(200).json({session,message:"Session ended successfully"})


   } catch (error) {
      console.log("Error in endSession controller: ",error.message)
      return res.status(500).json({message: "Internal server error"})
   }
}
