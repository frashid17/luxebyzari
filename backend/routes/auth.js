const express = require('express');
const { body } = require('express-validator');
const {
    register,
    login,
    logout,
    getMe,
    updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateRegister = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .exists()
        .withMessage('Password is required')
];

// Routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;