const slugify = require('slugify');

function slugifyVi(str) {
    if (!str) return '';
    const normalized = str
        .normalize("NFD")                          // Tách dấu
        .replace(/[\u0300-\u036f]/g, '')          // Xoá dấu
        .replace(/đ/g, 'd')                       // Chuyển đ → d
        .replace(/Đ/g, 'D');                      // Chuyển Đ → D

    return slugify(normalized, { lower: true, strict: true });
}

module.exports = {
    slugifyVi
};
