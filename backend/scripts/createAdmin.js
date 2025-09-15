const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        console.log('🔐 Creating admin user...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');

        // Remove existing admin if exists
        await User.deleteOne({ email: 'admin@luxebyzari.com' });
        console.log('🗑️ Removed any existing admin user');

        // Create new admin user
        const adminUser = await User.create({
            name: 'LuxeByZari Admin',
            email: 'admin@luxebyzari.com',
            password: 'admin123',
            role: 'admin',
            avatar: 'A',
            isActive: true,
            emailVerified: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@luxebyzari.com');
        console.log('🔑 Password: admin123');
        console.log('👑 Role:', adminUser.role);
        console.log('🆔 ID:', adminUser._id);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();