const express = require('express');
const { check } = require('express-validator');

// Controllers
const brandController = require('../controllers/admin/BrandController');


// Middlewares
const { brandLogoUpload } = require('../middlewares/uploadMiddleware');
const { validateRequest } = require('../middlewares/validateRequest');

const router = express.Router();

//
// ===== BRAND ROUTES =====
//

const brandValidator = [
    check('name').notEmpty().withMessage('Tên không được để trống'),
    check('slug').optional().isString().withMessage('Slug phải là chuỗi nếu nhập vào'),
    check('status').isInt({ min: 0, max: 1 }).withMessage('Status phải là 0 hoặc 1')
];

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




module.exports = router;
