import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config()

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
    
   
async function uploadOnCloudinary(localFilePath) {
  try {
    if (!localFilePath) return null;
    const uploadResult = await cloudinary.uploader.upload(
      localFilePath, {
        resource_type: "auto"
      }
    )
    console.log("File uploaded on cloudinary. File src: " + uploadResult.url);
    // once the file is uploaded, we would like to delete it from our server.
    fs.unlinkSync(localFilePath);

    return uploadResult;
      
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
}

async function deleteFromCloudinary(publicId){
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from cloudinary. public id: ", publicId);
  } catch (error) {
    console.log("Error deleting from cloudinary: ", error);
    return null;
  }
}


export { uploadOnCloudinary, deleteFromCloudinary }