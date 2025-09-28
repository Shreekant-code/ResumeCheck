import express from "express"
import { Fileupload, Login, RegisterLogic } from "../Controllers/userlogic.js";

const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 5 * 1024 * 1024 } 
});

import multer from "multer";

const router = express.Router();

router.post("/register",RegisterLogic);
router.post("/login",Login)


router.post('/profile', upload.single('myfile'),Fileupload  );



export default router;