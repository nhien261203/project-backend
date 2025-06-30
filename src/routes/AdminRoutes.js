const express = require('express');
const { check } = require('express-validator');

//brand Controllers
const brandController = require('../controllers/admin/BrandController');
//category Controllers
const categoryController = require('../controllers/admin/CategoryController');


// Middlewares
const { brandLogoUpload } = require('../middlewares/uploadMiddleware');
const { validateRequest } = require('../middlewares/validateRequest');

const router = express.Router();

//validate brand
const brandValidator = [
    check('name').notEmpty().withMessage('Tên không được để trống'),
    check('slug').optional().isString().withMessage('Slug phải là chuỗi nếu nhập vào'),
    check('status').toInt().isInt({ min: 0, max: 1 }).withMessage('Status phải là 0 hoặc 1')
];

//validate category
const categoryValidator = [
    check('name').notEmpty().withMessage('Tên không được để trống'),
    check('slug').optional().isString().withMessage('Slug phải là chuỗi nếu nhập vào'),
    check('status').toInt().isInt({ min: 0, max: 1 }).withMessage('Trạng thái phải là 0 hoặc 1'),
    check('parent_id').optional().isInt().withMessage('parent_id phải là số nếu có'),
];

// brand routes
router.get('/brands', brandController.getBrands);
router.get('/brands/countries', brandController.getBrandCountries);
router.get('/brands/:id', brandController.getBrandById);
router.post(
    '/brands',
    brandLogoUpload,
    brandValidator,
    validateRequest,
    brandController.createBrand
);
router.put(
    '/brands/:id',
    brandLogoUpload,
    brandValidator,
    validateRequest,
    brandController.updateBrand
);
router.delete('/brands/:id', brandController.deleteBrand);

// category routes
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post(
    '/categories',
    categoryValidator,
    validateRequest,
    categoryController.createCategory
);
router.put(
    '/categories/:id',
    categoryValidator,
    validateRequest,
    categoryController.updateCategory
);
router.delete('/categories/:id', categoryController.deleteCategory);


module.exports = router;
