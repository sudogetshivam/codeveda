import express from "express";
import path from "path";
import { ENV } from "./lib/env.js"
import { connectDB } from "./lib/db.js";
import cors from "cors"
import {serve} from "inngest/express"
import { functions, inngest } from "./lib/inngest.js";

const app= express()

const __dirname = path.resolve() /* this maintains the right address for any OS
and dirname name is used to store the absolute path, deosnt matter from where you run the server, this si just a standarad variables */


app.use(express.json()) //converts coming json data to Javascript Object so that we can read in req.bodt
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials:true //allows cookies/tokens to enter or to come along with
}))
console.log(ENV.PORT)
app.get('/',(req,res)=>{
   return res.status(200).json({msg:"sucess from api"})
})

app.use('/api/inngest',serve({client:inngest, functions}))

app.get('/books',(req,res)=>{
   return res.status(200).json({msg:"This is the books endpoint"})
})

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    /* app.use() is the security gaurd if any request even a get request it will go though app.use 
    for example app.use(express.json()) -> checks the request has json data or not, so in this case
    if anything is present in frontend/dist static files like logo.png, style.css without even single thought
    give those requests answers, dont go to app.get 
    
    and this express.static is also a function something like this
    
    // Aisa code Express ke andar likha hua hai
function static(folderName) {
    
    // Ye function return karta hai ek naya function (Middleware)
    // Jisme req, res, next hote hain!
    return function(req, res, next) {
        
        const fileName = req.url; // e.g., "/style.css"
        const filePath = path.join(folderName, fileName);

        // 1. Check karta hai file hai ya nahi
        if (fileExists(filePath)) {
            // 2. Agar hai, toh bhej do (req, res yahan use hue!)
            res.sendFile(filePath);
        } else {
            // 3. Agar nahi hai, toh aage badho
            next();
        }
    };
}
    }*/

app.get('/{*any}',(req,res)=>{
    return(
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    )
})
}

const startServer = async()=>{
    try{
    await connectDB() //if u remove await then also it will work but buttom code will execute first
    app.listen(3000,()=>
        console.log(`Server is running at ${'https://talentiq-puhr.onrender.com'}`)
    )
    } catch(error){
        console.log("Error starting the server",error)
    }
}

startServer()
