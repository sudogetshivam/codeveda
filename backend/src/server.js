import express from "express";
import { ENV } from "./lib/env.js"
const app= express()

console.log(ENV.PORT)
console.log(ENV.DB_URL)
app.get('/',(req,res)=>{
   return res.status(200).json({msg:"sucess from api"})
})

app.listen(3000,()=>{
    return(
        console.log("Server is running on port",ENV.PORT)
    )
})
