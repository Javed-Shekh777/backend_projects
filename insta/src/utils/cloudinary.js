const cloudinary  = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
 
 

const uploadCloudinary = async (localFilePaths, folderName) => {
    
    
    try {

        if (localFilePaths.length <= 0) {
            return null;
        }

        const uploadPromises = localFilePaths.map(file => {
            return cloudinary.uploader.upload(file, {
                resource_type: "auto",
                folder: folderName,
                overwrite: true,
            }, (error, result) => {
               
                if (error) return Promise.reject(error);
                fs.unlinkSync(file);
                return result;
            })
        });

        const results = await Promise.all(uploadPromises);

       

        return results;

    } catch (error) {

        localFilePaths.map((file) => {
            fs.unlinkSync(file);
        });
        return null;
    }
}



const deleteCloudinary = async (publicIds, resourceType = "image") => {
    

    if(publicIds.length <= 0){
        return null;
    }
    try {
        console.log("public Id  : ",publicIds);

        if(publicIds.length == 1){
           return cloudinary.uploader.destroy(publicIds[0], {
                resource_type:resourceType || "image"
            });
        }
 

        const deletePromises = publicIds.map((item)=>{
            return cloudinary.uploader.destroy(item.public_id, {
                resource_type:item.resource_type || resourceType
            });
        })
       

       

        // Wait for all promises to resolve
        const results = await Promise.all(deletePromises);

        // Log final results, not circular references
        console.log("Delete cloudinary results:", results);

        return results ;

    } catch (error) {
        console.log(error);
        return null;

    }
}


module.exports =  { uploadCloudinary, deleteCloudinary };