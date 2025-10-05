import express from "express";
import dbconnect from "./Database/dbconnect.js";
import router from "./Router/router.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const PORT=process.env.PORT;

const app = express();


app.use(cors({
  origin: true,          
  credentials: true,    
}));

app.use(express.json());
app.use(cookieParser());

await dbconnect();
app.use("/", router);

app.listen(PORT, () => {
    console.log("The server is running on 3000");
});
