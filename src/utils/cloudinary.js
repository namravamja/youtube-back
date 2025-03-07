import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("file path : ", response.url);
    // after file upload, we would like to delete it from server
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    try {
      fs.unlinkSync(localFilePath); // remove file from server
    } catch (unlinkError) {
      console.error("Error deleting local file:", unlinkError);
    }
    return null;
  }
};

export { uploadOnCloudinary };
