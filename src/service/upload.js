const multer = require("multer");
const cloudinary = require("cloudinary");
const { ErrorHandler } = require("../utils/errorHandler");

cloudinary.config({
  cloud_name: 'dxoblxypq',
  api_key: '948192272522128',
  api_secret: 'jms91MYN0ZKY4X7t9E2t8GgRrXM',
});

const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
});

const uploadToCloudinary = async (fileString, format) => {
  try {
    const { uploader } = cloudinary;

    const res = await uploader.upload(
      `data:image/${format};base64,${fileString}`
    );

    return res;
  } catch (error) {
    throw new ErrorHandler(500, error);
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
};