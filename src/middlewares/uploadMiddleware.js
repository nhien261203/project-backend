const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục nếu chưa tồn tại
const createUploadFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            return cb(new Error('Chỉ cho phép ảnh JPG, PNG, WEBP'));
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 } // Giới hạn 2MB
});

// Middleware dành riêng cho brand
const brandLogoUpload = (req, res, next) => {
    createUploadFolder('uploads/brands');

    upload.single('logo')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

module.exports = {
    brandLogoUpload
};
