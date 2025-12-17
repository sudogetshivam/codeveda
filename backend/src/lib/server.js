import {StreamChat} from "stream-chat"
import { ENV } from "./env.js"

const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("Stream API Key or Stream Secret is missing")
    exit(1)
}

export const chatClient = StreamChat.getInstance(apiKey,apiSecret); //if connection is already made, then its fine else create a new one

export const upsertStreamUser = async(userData) =>{
    try {
        await chatClient.upsertUser(userData)
        return userData

    } catch (error) {
        console.error("Error Upserting Stream user",error)
    }
}

export const deleteStreamUser = async(userId) =>{
    try {
        await chatClient.deleteUser(userId)
        console.log("Stream User deleted Sucessfully",userId)
    } catch (error) {
        console.error("Error Deleting Stream user",error)
    }
}

