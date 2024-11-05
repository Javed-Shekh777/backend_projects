const cloudinary = require("cloudinary").v2;
const fs = require("fs");


cloudinary.config({
    api_secret: process.env.CLOUD_API_SECRET,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY
});

const uploadCloudinary = async (images, folderName) => {

    try {

        if (images.length <= 0) {
            return null;
        }

        const promises = images.map((image) => {
            return cloudinary.uploader.upload(image, {
                folder: folderName,
                resource_type: "auto",
                overwrite: true
            }, (error, result) => {
                if (error) {
                    if (error) return Promise.reject(error);
                    fs.unlinkSync(image);
                    return result;
                }
            });
        });

        // Wait for all promises to resolve
        const responses = await new Promise.all(promises);

        return responses;

    } catch (error) {
        images.map((image) => {
            fs.unlinkSync(image);
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
            })
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