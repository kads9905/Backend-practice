// this is using promises
const asyncHandler = (requestHandler) => {
    // return in the form of promises
    return (req, res, next) => { 
        Promise.resolve(requestHandler(req, res, next)).
        catch((err) => next(err))
    } 
}

// here we didnt return it...we created asyncHandler ...accpeted a method in it
// but we didnt return it 
// accepts as a function but also return it as a function
export { asyncHandler };

// this is a helper file


// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async() => {}

// this is using try and catch method
// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json ({
//             success: false,
//             message: err.message
//         })
//     }
// }