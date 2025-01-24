import dotenv from 'dotenv';

dotenv.config({ path: "./src/.env" });

export const config = {
    port: Number(process.env.PORT),
    origin: String(process.env.ORIGIN),
    dbName: String(process.env.DB_NAME),
    mongodbUrl: String(process.env.MONGODB_URL),
    tokenSecret: String(process.env.TOKEN_SECRET),
    tokenExpiryTime: String(process.env.TOKEN_EXPIRY),
    cloudinaryCloudName: String(process.env.CLOUDINARY_CLOUD_NAME),
    cloudinarySecret: String(process.env.CLOUDINARY_API_SECRET),
    cloudinaryApiKey: String(process.env.CLOUDINARY_API_KEY)
}