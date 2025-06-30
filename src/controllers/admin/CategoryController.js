const db = require('../../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { slugifyVi } = require('../../utils/slugifyVi');

const Category = db.Category;

// GET /api/categories
exports.getCategories = async (req, res) => {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const where = {};

    if (search) where.name = { [Op.like]: `%${search}%` };
    if (status !== undefined) where.status = status;

    try {
        const { count, rows } = await Category.findAndCountAll({
            where,
            limit: +limit,
            offset: (+page - 1) * +limit,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Category, as: 'parent', attributes: ['id', 'name'] }
            ]
        });

        res.json({
            data: rows,
            pagination: {
                total: count,
                current_page: +page,
                per_page: +limit,
                last_page: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách category' });
    }
};

// GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [
                { model: Category, as: 'parent', attributes: ['id', 'name'] },
                { model: Category, as: 'children', attributes: ['id', 'name'] }
            ]
        });
        if (!category) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết category' });
    }
};

// POST /api/categories
exports.createCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
        const { name, slug: inputSlug, parent_id, status } = req.body;
        const slug = inputSlug?.trim() || slugifyVi(name);

        const exist = await Category.findOne({ where: { slug } });
        if (exist) return res.status(400).json({ message: 'Slug đã tồn tại' });

        //  Normalize parent_id
        let normalizedParentId = null;
        if (parent_id && !isNaN(parent_id) && parseInt(parent_id) > 0) {
            normalizedParentId = parseInt(parent_id);
        }

        const category = await Category.create({
            name,
            slug,
            parent_id: normalizedParentId,
            status: parseInt(status),
        });

        res.status(201).json(category);
    } catch (err) {
        console.error('❌ Lỗi khi tạo category:', err);
        res.status(500).json({ message: 'Lỗi khi tạo category', error: err.message });
    }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
        const { name, slug: inputSlug, parent_id, status } = req.body;
        const slug = inputSlug?.trim() || slugifyVi(name);

        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Không tìm thấy' });

        // Chặn gán chính nó làm cha
        if (parseInt(parent_id) === category.id) {
            return res.status(400).json({ message: 'Danh mục không thể là cha của chính nó' });
        }

        // Kiểm tra slug trùng nếu slug có thay đổi
        if (slug !== category.slug) {
            const exist = await Category.findOne({
                where: { slug, id: { [Op.ne]: req.params.id } }
            });
            if (exist) return res.status(400).json({ message: 'Slug đã tồn tại' });
        }

        // Chuẩn hóa parent_id nếu cần
        let normalizedParentId = null;
        if (parent_id && !isNaN(parent_id) && parseInt(parent_id) > 0) {
            normalizedParentId = parseInt(parent_id);
        }

        await category.update({
            name,
            slug,
            parent_id: normalizedParentId,
            status: parseInt(status),
        });

        res.json({ message: 'Cập nhật thành công', category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi cập nhật category' });
    }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Không tìm thấy' });

        const hasChildren = await Category.findOne({ where: { parent_id: category.id } });
        if (hasChildren) {
            return res.status(400).json({ message: 'Không thể xoá danh mục cha có danh mục con' });
        }

        await category.destroy();
        res.json({ message: 'Đã xoá thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi xoá category' });
    }
};
