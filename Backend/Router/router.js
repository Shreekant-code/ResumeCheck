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



router.post("/refresh-token", (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; 
    if (!refreshToken) return res.sendStatus(401); 

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); 

      const accessToken = generateAccessToken({ id: user.id });
      res.json({ accessToken });
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



export default router;