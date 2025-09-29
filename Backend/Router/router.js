import express from "express"
import { Fileupload, Getdetails, Login, RegisterLogic } from "../Controllers/userlogic.js";
import { verifyToken } from "../Auth/Verifytoken.js";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } 
});


const router = express.Router();

router.post("/register",RegisterLogic);
router.post("/login",Login)


router.post('/profile', verifyToken,upload.single('myfile'),Fileupload  );

router.get("/resume",verifyToken,Getdetails)



export default router;