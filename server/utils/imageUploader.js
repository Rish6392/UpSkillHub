const cloudinary = require('cloudinary').v2

exports.uploadImageToCloudinary = async(file,folder,height,quality)=>{
    const options = {folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality= quality;
    }
    options.resourse_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}



exports.uploadVideoToCloudinary = async (file, folder) => {
    try {
        console.log("Starting video upload to Cloudinary...");
        console.log("File details:", {
            name: file.name,
            size: file.size,
            mimetype: file.mimetype,
            tempFilePath: file.tempFilePath
        });

        const options = {
            resource_type: "video",
            folder: folder,
            chunk_size: 6000000, // 6MB chunks for large files
            timeout: 120000, // 2 minutes timeout
        };

        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        
        console.log("Video upload successful:", {
            public_id: result.public_id,
            secure_url: result.secure_url,
            duration: result.duration,
            format: result.format
        });

        return result;
    } catch (error) {
        console.error("Cloudinary video upload error:", error);
        throw new Error(`Video upload failed: ${error.message}`);
    }
};
