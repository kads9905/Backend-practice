// this middleware will just verify if user is there or not

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// why verify jwt cuz when we logged in user, then we gave acess and refresh token
// and on this basis we verify user if he has correct token or not 
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // what u want to verify - token
        // secret key - only the one who has the key can decode it
        // Verify token using secret key
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        // Find user from database
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid access token"
        );
    }
});
