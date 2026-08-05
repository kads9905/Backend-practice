import mongoose from "mongoose"

const connectDB = async () => {
    console.log(process.env.MONGODB_URI)
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/videotube?appName=Cluster0`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }

}

export default connectDB;