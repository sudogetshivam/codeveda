import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    problem: {
        type:String,
        required: true
    },
    difficulty : {
        type : String,
        enum : ["Easy","Medium","Hard"],
        required: true
    },
    host : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    participant : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    status: {
        type: String,
        enum: ["active","completed"],
        default:"active"
    } ,
    //stream video call id
    callId: {
        type:"String",
        default:""
    },
    roomKey:{
        type:String,
        required:true,
        unique:true,
        length:8,
    },
},{timestamps:true})

const sesssion = mongoose.model("Session",sessionSchema)

export default sesssion