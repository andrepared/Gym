const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
    // Setting an instance in this file. 
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'SacaGym',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});


module.exports = {
    cloudinary, 
    storage
}