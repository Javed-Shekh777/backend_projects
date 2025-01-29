const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  api_secret: process.env.CLOUD_API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
});

 
 
const uploadCloudinary = async (images, folderName) => {
  try {
    
    if (images.length <= 0) {
      return null;
    }

    const promises = images.map(async (image) => {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: folderName,
          resource_type: "auto",
          overwrite: true,
        });
        fs.unlinkSync(image);
        return result;
      } catch (error) {
        console.error(`Error uploading image ${image}:`, error);
        return Promise.reject(error);
        // throw error; // Rethrow the error to be caught in the outer try-catch
      }
    });

    const responses = await Promise.all(promises);

    return responses; // Return the responses if needed
  } catch (error) {
    console.error("Error in uploadCloudinary:", error);
    images.forEach((image) => {
      try {
        fs.unlinkSync(image); // Delete the image if it exists
      } catch (unlinkError) {
        console.error(`Error deleting image ${image}:`, unlinkError);
      }
    });
    return null;
  }
};

const deleteCloudinary = async (publicIds) => {
  try {
    if (publicIds.length <= 0) {
      return null;
    }

    const deletePromises = publicIds.map((item) => {
      return cloudinary.uploader.destroy(item, {
        resource_type: "image",
      });
    });

    // Wait for all promises to resolve
    const results = await Promise.all(deletePromises);

    console.log("Delete cloudinary results:", results);
    return results;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { uploadCloudinary, deleteCloudinary };
