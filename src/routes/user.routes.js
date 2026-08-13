import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser)
// now when /register is hit registerUser method is called - go to controllers.js
// but now we r confused we have to go to /register 
// or /user in app js

export default router;