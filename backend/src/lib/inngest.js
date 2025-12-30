import { Inngest } from "inngest"
import { connectDB } from "./db.js"
import User from "../models/User.js"
import { deleteStreamUser, upsertStreamUser } from "./streams.js";

export const inngest = new Inngest({id: "TalentIQ"});

//this is how things work
//--------------------------------------------------------------------------------------------
/* // Ye Inngest Library ka internal hidden code hai
constructor(options) {
   this.id = options.id;
   
   // 👇 LIBRARY KHUD DHOONDTI HAI!
   // Agar user ne key nahi di, toh main khud .env check karunga
   this.eventKey = options.eventKey || process.env.INNGEST_EVENT_KEY;
   this.signingKey = options.signingKey || process.env.INNGEST_SIGNING_KEY;
} */


// INNGEST_EVENT_KEY these types of variable speilling s are very imp because if you misspell even by a single character it will not work
//--

const syncUser =  inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async ({event})=>{
        await connectDB()

        const {id,email_addresses,first_name,last_name,image_url} = event.data
        const newUser = {
            clerkId: id,
            email : email_addresses[0]?.email_address,
            name: `${first_name || ""}${last_name || ""}`,
            profileImage: image_url
        }
        await User.create(newUser)
        await upsertStreamUser({
            id:newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profileImage
        })
    }
)

//challenge: send a welcome email when user is created

const deleteUserFromDB = inngest.createFunction(
    {id:"delete-user-from-db"},
    {event: "clerk/user.deleted"},
    async({event}) => {

    const { id } = event.data;
    await User.deleteOne({clerkId:id})
    await deleteStreamUser(id.toString())
    }
)

export const functions = [syncUser,deleteUserFromDB]