const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
    {
        name: "Luxury Leather Heels",
        description: "Elegant handcrafted leather heels perfect for formal occasions. Made with premium Italian leather and designed for comfort.",
        price: 12500,
        originalPrice: 15000,
        category: "shoes",
        brand: "LuxeByZari",
        images: [{ url: "https://via.placeholder.com/400x400?text=👠", public_id: "heel_1" }],
        sizes: ["36", "37", "38", "39", "40", "41"],
        colors: ["Black", "Brown", "Red", "Nude"],
        stock: 25,
        featured: true,
        rating: 4.8,
        numOfReviews: 124,
        tags: ["formal", "elegant", "leather", "heels"]
    },
    {
        name: "Designer Handbag Collection",
        description: "Premium designer handbag with genuine leather finish. Perfect for everyday use or special occasions.",
        price: 25000,
        originalPrice: 30000,
        category: "bags",
        brand: "LuxeByZari",
        images: [{ url: "https://via.placeholder.com/400x400?text=👜", public_id: "bag_1" }],
        colors: ["Black", "Brown", "Tan", "White", "Navy"],
        stock: 15,
        featured: true,
        rating: 4.9,
        numOfReviews: 89,
        tags: ["designer", "handbag", "leather", "luxury"]
    },
    {
        name: "Casual Sport Sneakers",
        description: "Comfortable sneakers for everyday wear. Breathable fabric with superior cushioning technology.",
        price: 8500,
        originalPrice: 10000,
        category: "shoes",
        brand: "LuxeByZari",
        images: [{ url: "https://via.placeholder.com/400x400?text=👟", public_id: "sneaker_1" }],
        sizes: ["39", "40", "41", "42", "43", "44", "45"],
        colors: ["White", "Black", "Navy", "Gray", "Red"],
        stock: 40,
        featured: false,
        rating: 4.6,
        numOfReviews: 256,
        tags: ["casual", "sport", "comfortable", "sneakers"]
    },
    {
        name: "Evening Clutch Purse",
        description: "Elegant evening clutch perfect for special occasions. Compact design with premium finish.",
        price: 6500,
        originalPrice: 8000,
        category: "bags",
        brand: "LuxeByZari",
        images: [{ url: "https://via.placeholder.com/400x400?text=👛", public_id: "clutch_1" }],
        colors: ["Gold", "Silver", "Black", "Rose Gold", "Navy"],
        stock: 20,
        featured: false,
        rating: 4.7,
        numOfReviews: 67,
        tags: ["evening", "clutch", "elegant", "special occasion"]
    },
    {
        name: "Premium Leather Boots",
        description: "Durable leather boots for fashion and function. Weather-resistant with superior craftsmanship.",
        price: 18000,
        originalPrice: 22000,
        category: "shoes",
        brand: "LuxeByZari",
        images: [{ url: "https://via.placeholder.com/400x400?text=🥾", public_id: "boots_1" }],
        sizes: ["38", "39", "40", "41", "42", "43"],
        colors: ["Brown", "Black", "Tan", "Dark Brown"],
        stock: 18,
        featured: true,
        rating: 4.8,
        numOfReviews: 143,
        tags: ["leather", "boots", "durable", "premium"]
    },
    {
        name: "Luxury Tote Bag",
        description: "Spacious tote bag perfect for work and travel. Multiple compartments for organization.",
        price: 15000,
        originalPrice: 18000,
        category: "bags",
        brand: "LuxeByZari",
        images: [{ url: "https://via.placeholder.com/400x400?text=🛍️", public_id: "tote_1" }],
        colors: ["Brown", "Black", "Navy", "Beige", "Gray"],
        stock: 0, // Out of stock
        featured: false,
        rating: 4.5,
        numOfReviews: 98,
        tags: ["tote", "spacious", "work", "travel"]
    },
    {
        name: "Classic Oxford Shoes",
        description: "Timeless Oxford shoes for professional and formal wear. Handcrafted with attention to detail.",
        price: 16000,
        originalPrice: 20000,
        category: "shoes",
        brand: "LuxeByZari",
        images: [{ url: "https://via.placeholder.com/400x400?text=👞", public_id: "oxford_1" }],
        sizes: ["39", "40", "41", "42", "43", "44"],
        colors: ["Black", "Brown", "Dark Brown"],
        stock: 22,
        featured: true,
        rating: 4.9,
        numOfReviews: 87,
        tags: ["oxford", "formal", "professional", "classic"]
    },
    {
        name: "Mini Crossbody Bag",
        description: "Compact crossbody bag perfect for hands-free convenience. Adjustable strap and secure closure.",
        price: 7500,
        originalPrice: 9000,
        category: "bags",
        brand: "LuxeByZari",
        images: [{ url: "https://via.placeholder.com/400x400?text=👝", public_id: "crossbody_1" }],
        colors: ["Pink", "Black", "White", "Beige", "Red"],
        stock: 30,
        featured: false,
        rating: 4.4,
        numOfReviews: 156,
        tags: ["crossbody", "mini", "compact", "hands-free"]
    }
];

const seedProducts = async () => {
    try {
        console.log('🌱 Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing products
        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});

        // Insert sample products
        console.log('🌱 Seeding products...');
        await Product.insertMany(sampleProducts);

        console.log('✅ Database seeded successfully!');
        console.log(`📦 Added ${sampleProducts.length} products`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedProducts();