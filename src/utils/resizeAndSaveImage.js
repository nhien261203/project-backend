const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const resizeAndSaveImage = async (buffer, filename, folder) => {
    const filepath = path.join(folder, filename);

    await sharp(buffer)
        .resize(300, 300, {
            fit: 'inside', // ✅ Giữ nguyên nội dung, không cắt
            withoutEnlargement: true
        })
        .toFormat('webp')
        .toFile(filepath);

    return filename;
};

const deleteFileIfExists = (filepath) => {
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
    }
};

module.exports = {
    resizeAndSaveImage,
    deleteFileIfExists
};
