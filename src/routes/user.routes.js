import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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

router.route("/login").post(
    loginUser
)

// secured routes
router.route("/logout").post(
    verifyJWT,
    logoutUser
)

// in this route we didnt need any verifyJWT cuz we 
// did all decoded token stuff in this conroller
// thats why we didnt apply the verifyjwt middleware here , can be used if required

router.route("/refresh-token").post(
    refreshAccessToken
)
export default router;