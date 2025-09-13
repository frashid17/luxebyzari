const express = require('express');
const { body } = require('express-validator');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    addProductReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateProduct = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),
    body('price')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    body('category')
        .isIn(['shoes', 'bags'])
        .withMessage('Category must be either shoes or bags'),
    body('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer')
];

const validateReview = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage('Comment must be between 5 and 500 characters')
];

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/:id/reviews', protect, validateReview, addProductReview);

// Admin only routes
router.post('/', protect, admin, validateProduct, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;