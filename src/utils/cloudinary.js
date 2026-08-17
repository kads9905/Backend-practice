import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// we can create a method and in parameter pass the local file path
// and uppload it, if successfully uploaded we will simple unlink it
// a lot of problems arise here as well so use try and catch

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // if not the file path either return null 
        // or pass an error message
        if (!localFilePath) return null
        // upload the file on cloudinary
        // we can give multiple options besdies just the usual
        // local file path url - refer cloudinary docs
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        // console.log("Cloudinary response:", response);
        // console.log("file is uploaded on cloudinary!", response.url);
        // after uploading we can get the public url from response.url
        fs.unlinkSync(localFilePath); //file has been uploaded so no we can unlink it
        return response;
        // now we return the whole response to the user
        // whatever data the user needs it can take it from the response
      } catch (error) {
        // error 1 - if files is not uploaded successfully
        // error 2 - and if theres any mistake in local file path
        // but if using cloudinary we know the file is there on the server
        // meaning local file path has come but its not uploaded thats the problem
        // for safe cleaning purpose - remove the file from the server
        // or else malicious or corrupted file will be on ther server
        fs.unlinkSync(localFilePath)
        // removes the locally saved temporary file as
        // as the upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary };