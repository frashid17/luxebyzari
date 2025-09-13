const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        console.log('📦 Getting products...', req.query);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build basic query for active products
        let query = Product.find({ isActive: { $ne: false } }); // Get products that are not explicitly inactive

        console.log('🔍 Base query created');

        // Search functionality
        if (req.query.search) {
            console.log('🔍 Searching for:', req.query.search);
            query = query.find({
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } },
                    { category: { $regex: req.query.search, $options: 'i' } }
                ]
            });
        }

        // Category filter
        if (req.query.category && req.query.category !== 'all') {
            console.log('📂 Filtering by category:', req.query.category);
            query = query.find({ category: req.query.category });
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            const priceQuery = {};
            if (req.query.minPrice) priceQuery.$gte = parseInt(req.query.minPrice);
            if (req.query.maxPrice) priceQuery.$lte = parseInt(req.query.maxPrice);
            console.log('💰 Filtering by price range:', priceQuery);
            query = query.find({ price: priceQuery });
        }

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            console.log('📊 Sorting by:', sortBy);
            query = query.sort(sortBy);
        } else {
            query = query.sort({ featured: -1, createdAt: -1 });
        }

        console.log('⏳ Executing query...');

        // Execute query
        const products = await query.skip(skip).limit(limit);

        console.log('📊 Found products:', products.length);

        // Get total count for pagination (simplified)
        const total = await Product.countDocuments({ isActive: { $ne: false } });

        console.log('📈 Total products:', total);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (error) {
        console.error('❌ Get products error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        res.status(500).json({
            success: false,
            message: 'Server error getting products',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        console.log('🔍 Getting product by ID:', req.params.id);

        const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');

        if (!product) {
            console.log('❌ Product not found');
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('✅ Product found:', product.name);

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('❌ Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error getting product',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
    try {
        console.log('⭐ Getting featured products...');

        const products = await Product.find({
            featured: true,
            isActive: { $ne: false }
        })
            .sort({ createdAt: -1 })
            .limit(8);

        console.log('⭐ Found featured products:', products.length);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('❌ Get featured products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error getting featured products',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        console.log('➕ Creating new product...');

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const product = await Product.create({
            ...req.body,
            user: req.user.id
        });

        console.log('✅ Product created:', product.name);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('❌ Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating product',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        console.log('📝 Updating product:', req.params.id);

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('✅ Product updated:', product.name);

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('❌ Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating product',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        console.log('🗑️ Deleting product:', req.params.id);

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Soft delete by setting isActive to false
        product.isActive = false;
        await product.save();

        console.log('✅ Product deleted:', product.name);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('❌ Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting product',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addProductReview = async (req, res) => {
    try {
        console.log('📝 Adding review for product:', req.params.id);

        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed this product
        const alreadyReviewed = product.reviews.find(
            review => review.user.toString() === req.user.id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'Product already reviewed by you'
            });
        }

        const review = {
            user: req.user.id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        product.calculateAverageRating();

        await product.save();

        console.log('✅ Review added successfully');

        res.status(201).json({
            success: true,
            message: 'Review added successfully'
        });
    } catch (error) {
        console.error('❌ Add review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error adding review',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};