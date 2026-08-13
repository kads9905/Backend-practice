import { asyncHandler } from "../utils/asyncHandler.js";

// asyncHandler is a higher order function which accepts a function
// this is a method to register user
const registerUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message: "kads u gon win dw :)"
    })
})


// method will run when a url is hit

export { registerUser };