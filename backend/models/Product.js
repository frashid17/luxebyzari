const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please provide product category'],
        enum: ['shoes', 'bags'],
        lowercase: true
    },
    brand: {
        type: String,
        trim: true
    },
    images: [{
        public_id: String,
        url: String
    }],
    sizes: [{
        type: String,
        trim: true
    }],
    colors: [{
        type: String,
        trim: true
    }],
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    inStock: {
        type: Boolean,
        default: function() {
            return this.stock > 0;
        }
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    seoTitle: String,
    seoDescription: String,
    tags: [String]
}, {
    timestamps: true
});

// Update inStock based on stock quantity
productSchema.pre('save', function(next) {
    this.inStock = this.stock > 0;
    next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
    if (this.reviews.length === 0) {
        this.rating = 0;
        this.numOfReviews = 0;
    } else {
        const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10;
        this.numOfReviews = this.reviews.length;
    }
};

module.exports = mongoose.model('Product', productSchema);