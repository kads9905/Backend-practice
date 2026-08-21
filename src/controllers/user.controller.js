import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// separate methods for ACCESS AND REFRESH TOKEN - call as per need

const generateAccessAndRefreshTokens = async( userId ) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // refresh token we save in db to not ask user for pw again and again
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})

        return { accessToken, refreshToken }
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}
// asyncHandler is a higher order function which accepts a function

// this is a method to register user

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - check if data given by user is in correct format - not empty
    // check if user already exists : username, email
    // check for files - images, check for avatar
    // if available, upload them to cloudinary - take url from response
    // on cloudinary, check if avatar was uploaded successfully
    // first user gave it - then check if multer uploaded it properly and then check on cloudinary
    // flow : user gave data -> take the image -> upload on cloudinary -> the img came back to use from cloudinary
    // create a user object - create entry in db
    // remove password and refresh token field from response 
    // ^- we get the response of as it is that was created including pw tho it is encrypted
    //    but we dont wanna give encrypted pw to the user cuz whatever response comes we
    //    need to send it in frontend as well
    // check for user creation - null response or if user is created
    // return response



    // req.body -> we get the user details from the request which comes from body
    // not necessary data can come from body, can also come from URLA, form & json -> u can get thru body

    // we can extract the data coming from req.body...destructure it
    const { fullName, email, username, password } = req.body
    // console.log("body: ", req.body)
    // console.log("email: ", email);


    // we didnt do anything for file handling yet....all was for data handling
    // for file handling we will go to routes and tell userRoutes - configure middleware in it refer that file

    // validation to check if each field is empty or not
    // if (fullName === ""){
    //     throw new apiError(400, "fullname is required")
    // }
    // can use this but we have to do this for each field
    
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
        // field.trim() -> if the field is there, then trim it 
        // even after trimming it is empty then automatically return true -> meaning field was null
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // now we need to check if user already exists or not
    // the user in models that we exported can directly contact the db bcuz created thru mongoose
    // user will now call mongodb on our behalf how much ever times we want to call it
    // findOne -> here it returns whichevr 1st user it finds
    // but what if email is there but username has already been take by someone else 
    // here we use operators $or -> create array and whatever values we want to check
    // put it as an object
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    // if there is an existed, we dont want to  proceed -> we throw an error to user
    if( existedUser ){
        throw new ApiError(409, "User with email or username already exists")
    }

    // we need to check for images
    // as far as we know, we get all the data in req.body,
    // but in routes we have added middleware -> it adds more fields inside the request
    // just like express by default gives req.body, multer gives req.files
    // we can or cannot have access to files thats why files?
    // avatar[0] -> we need its first property...cuz inside first we get an object
    // if we take it optionally avatar[0]? then we can write path here
    // we can get its proper path that is uploaded by multer
    // multer has already taken file on his server cuz we told it to - created destination
    // keep the file in that path and give files original name
    // localpath cuz its on our server not yet on cloudinary
    // localpath can or cannot be there but we need atleast 1 path -> we need avatar image
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // check for avatar
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    // upload both of them to cloudinary
    // good for us we already wrote the method in cloudinary.js
    // this step of uploading with take time
    const avatar = await uploadOnCloudinary(avatarLocalPath); 
    // if we r not getting coverimagelocalpath here, cloudinary simply returns empty string
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // check again for avatr if it has gone properly or not since its a required field
    if(!avatar) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    // create an object and creating an entry in db
    // to do entry in db, we have only think interacting with it that is the User
    // create field that takes object - pass the fields in it
    const user = await User.create({
        fullName,
        // we gave avatar on uploadcloudinary, so cloudinary sends us the whole response
        // but we only want to store the url in db 
        avatar: avatar.url,
        // a problem occurs here cuz we didnt check here if coverImage has properly uploaded or not
        // and also we didnt compulsorily check if coverImages local path came or not - we mainly did checks for avatar
        // maybe user didnt give it only - so put an optional here
        // if the coverimage is there, take out the url from it, if not let it be empty - for safety measures
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    // while talking to db - 2 things to remember - > potentially we will get errors
    // db is always in another continent
    // even if we get an error no problem cuz we already created a file aynchandler and promises
    // so even if we get error catch will handle it but it will take time so use await

    // check if user is actually created or its empty
    // if the user is successfully created, not only the data given by user is created
    // mongodb with every entry add an underscore id field in it
    // so if we find the user, means it was created, if not then error
    // we called the api, asked the id and we can remove the password and token field
    // we can simply do it it above in user by making fields undefined for pw and token
    // but here the benefit is we can chain using select method
    // we pass it as strings and select the fields we dont want since by default
    // everything is selected
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // now we can check if user has come or not

    if (!createdUser){
        throw new ApiError(500, " Something went wrong while registering the user");        
    }

    // we need to craft the response of the user and all is created
    // we want a structured organised response - we need help of ApiResponse
    // for apiresponse we created a class of all the data so we can just create an object
    // 

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )


})
// method will run when a url is hit


// LOGIN USER
// req body -> data
    // check username or email
    // find the user
    // password check
    // access and refresh token generate and send user
    // send the tokens in secure cookies
    // send response that successfully logged in
const loginUser = asyncHandler( async (req,res) => {

    const { email, username, password } = req.body
    console.log(email);
    
    if ( !username && !email ){
        throw new ApiError(400, "username or email is required")
    }
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
    // }

    const user = await User.findOne({
        $or: [{ username },, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    // User is mongodb mongooses object
    // and the methods we created ispwcorrect , generate token is avaialble in our user
    // which is user
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // now send the acces and refreshtken in cookies
    // now what info we need to send to user
    
    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken")

    // whenever we want to send cookies, we have to design some options
    // it means by default any one can modify our cookies in the frontend
    // but when we apply httpOnly and secure -> true, then it can only be modifiable by thru server
    // we cant modify thru frontend we can see it here but not modify
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        // but we did set these acess and refres in cookies
        // so why send them separately here?
        // we r handling the case here where the user is saving the acces and refresh
        // from his side - if he wants to save in local storage or if hes building a mobile app
        // not good practice to save these from users side but good practice to send these to user if they need it depending on situation

        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )   
    
})


// LOGOUT USER
// we need to clear the cookies cuz we can manage it thru
// server httponly
// we also need to reset the refresh token in user model
const logoutUser = asyncHandler( async (req, res) => {
    // u were logged in, on that basis we did a query on db and added a req.user
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        },
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

export { 
    registerUser,
    loginUser,
    logoutUser
};