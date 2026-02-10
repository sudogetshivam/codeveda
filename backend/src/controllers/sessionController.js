import Session from "../models/Session.js"
import { chatClient, streamClient } from "../lib/streams.js"

// Session model enum expects "Easy" | "Medium" | "Hard" (capitalized)
function normalizeDifficulty(d) {
  if (!d || typeof d !== "string") return d;
  const lower = d.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export async function createSession(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { problem, difficulty: rawDifficulty } = req.body;
    const difficulty = normalizeDifficulty(rawDifficulty);
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }
    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({ message: "Difficulty must be Easy, Medium, or Hard" });
    }
        //generate unique call id
        const callId = `session_${crypto.randomUUID()}`

        const session = await Session.create({problem,difficulty,host : userId,callId})

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

      res.status(201).json({session}) //bina curly braces ke list type main jata [ { }, { } ], with curly braces main jata {session: { [], [] }}
     } catch (error) {  
        console.error("Error in createSession controller:", error);
    const message = error.message || "Internal Server Error";
    res.status(500).json({ message });
     }

}

export async function getActiveSessions(req,res){ // here req is not being used you can put underscore there

   try {
       const sessions =await  Session.find({status:"active"}).populate("host","name profileImage email clerkId").populate("host","name profileImage email clerkId"). // look for now it is only checking active sessions, what if any session is not active, think about that scenario also

       sort({createdAt:-1}).limit(20)

       res.status(200).json({sessions})
   } catch (error) {
       console.log("Error in getActiveSessions controller: ",error.message)
       return res.status(500).json({message: "Internal server error"})
   }
}

export async function getMyRecentSessions(req,res){

   if (!req.user) {
      return res.status(401).json({ message: "Authentication required in getMYSessioncontroller" });
    }

   try {
      const userId =   req.user._id
      //get sesssions where either user is a host or participant
      const sessions = await Session.find({status:"completed",
         $or:[{host:userId},{participant:userId}],
   }).sort({createdAt:-1}).limit(20);

   return res.status(200).json({sessions}) //bina curly braces
      
   } catch (error) {
      console.log("Error in getMyRecentSessions controller: ",error.message)
        res.status(500).json({message: "Internal server error"})
   }
}


export async function getSessionById(req,res){
try {
   const {id} = req.params // jo router main pass kiye ho variable wahi karna hain, sessionRoute.get("/:id",protectRoute,getSessionById
   console.log("Session ID from params: ", id)
   
   /*
   OLD SCHOOL WAY
   const params = req.params; // Pehle pura object lo
const id = params.id;      // Phir usme se id nikalo
   */

   const session = await Session.findById(id).populate("host","name profileImage email clerkId").
   populate("participant","name profileImage email clerkId")

   if(!session) res.status(404).json({message:"Session not Found"})
   res.status(200).json({session})
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

      Kaam kya hai? User ko us specific room ka Official Member banana taaki wo chat/call kar paye. 

       */
   return res.status(200).json({session,message:"Joined session successfully"})

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
      const call = streamClient.video.call("default",session.callId);
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
