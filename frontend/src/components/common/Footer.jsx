import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                            ✨ LuxeByZari
                        </h3>
                        <p className="text-gray-400">
                            Premium shoes and bags for the modern fashionista.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/" className="hover:text-white">Home</a></li>
                            <li><a href="/shop" className="hover:text-white">Shop</a></li>
                            <li><a href="/about" className="hover:text-white">About</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/shop?category=shoes" className="hover:text-white">Shoes</a></li>
                            <li><a href="/shop?category=bags" className="hover:text-white">Bags</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: info@luxebyzari.com</li>
                            <li>Phone: +254 700 000 000</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 LuxeByZari. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;