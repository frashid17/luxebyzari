import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/product/ProductGrid';

const Home = () => {
    const { featuredProducts = [], loading } = useProducts();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Luxury Fashion
                        <span className="block text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              Redefined
            </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Discover premium shoes and bags that define your unique style.
                        Crafted with passion, designed for elegance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/shop" className="btn btn-primary text-lg px-8 py-3">
                            Shop Now
                        </Link>
                        <Link to="/about" className="btn btn-outline text-lg px-8 py-3">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Link to="/shop?category=shoes" className="group">
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                <div className="text-6xl mb-4 text-center">👠</div>
                                <h3 className="text-2xl font-bold text-center mb-4">Premium Shoes</h3>
                                <p className="text-gray-600 text-center">
                                    Step into elegance with our curated collection
                                </p>
                            </div>
                        </Link>
                        <Link to="/shop?category=bags" className="group">
                            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                <div className="text-6xl mb-4 text-center">👜</div>
                                <h3 className="text-2xl font-bold text-center mb-4">Luxury Bags</h3>
                                <p className="text-gray-600 text-center">
                                    Carry sophistication wherever you go
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-gray-600">Handpicked items from our premium collection</p>
                    </div>

                    {/* ✅ ProductGrid now always gets an array */}
                    <ProductGrid products={featuredProducts} loading={loading} />

                    <div className="text-center mt-12">
                        <Link to="/shop" className="btn btn-primary text-lg px-8 py-3">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
