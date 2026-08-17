// require(`dotenv`).config({path: './env'});
import dotenv from "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import dns from "node:dns";



dns.setServers(["8.8.8.8", "8.8.4.4"]);

connectDB()
.then(() => {
    const server =  app.listen(process.env.PORT || 8000, () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
    server.on("error", (err) => {
        console.log("Server Error:", err);
    });

})
.catch((err) => {
    console.log("MONGODB db connection failed !!!", err);
})


// whenever asynchronouse method from index.js/db get completed,
// it returns a promise...now that database has connected successfully
// .then -> keep sumthin successful
// .catch -> handle errors

// here we use app.listen only then can our server start
// till now only our mogodb connected but our application had not 
// started listening using that database at the port 






/*
// approach 1
import express from "express";
const app = express();

( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERRR: ", error);
            throw error
        })
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()

*/