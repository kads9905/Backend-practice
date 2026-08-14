import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// injecting middleware - whatever method is executing usse just pehle use it
router.route("/register").post(
    // fields accepts array
    upload.fields([
        // we are accepting 2 files
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
// now when /register is hit registerUser method is called - go to controllers.js
// but now we r confused we have to go to /register 
// or /user in app js



export default router;