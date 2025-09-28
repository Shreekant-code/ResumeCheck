import express from "express";
import dbconnect from "./Database/dbconnect.js";
import router from "./Router/router.js";
import dotenv from 'dotenv'


const app=express();

dotenv.config();
app.use(express.json());


await dbconnect();
app.use("/",router);

app.listen(3000,()=>{
    console.log("The server is running on 3000");
})