import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/config.js";

cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinarySecret
});

const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteFileOnCloudinary = async (url) => {
    try {
        if (!url) return null;

        const urlParts = url.split("/");
        const imagePublicId = urlParts[urlParts.length - 1].slice(0, -4);

        const response = await cloudinary.uploader.destroy(imagePublicId);
        return response;
    } catch (error) {
        return null;
    }
};

export { uploadFileOnCloudinary, deleteFileOnCloudinary };