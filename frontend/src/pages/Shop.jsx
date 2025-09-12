import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/product/ProductGrid';
import { CATEGORIES } from '../utils/constants';

const Shop = () => {
    const { products, filteredProducts, filterProducts } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState([0, 50000]);

    // Get category from URL params
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category') || 'all';
        setSelectedCategory(categoryFromUrl);
    }, [searchParams]);

    // Filter products whenever filters change
    useEffect(() => {
        let filtered = products;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by price range
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            default:
                // Featured first
                filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        filterProducts(selectedCategory, searchQuery);
    }, [selectedCategory, searchQuery, sortBy, priceRange, products, filterProducts]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === 'all') {
            setSearchParams({});
        } else {
            setSearchParams({ category });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop</h1>
                    <p className="text-gray-600">Discover our premium collection</p>
                </div>

                {/* Search Bar */}
                <div className="mt-4 lg:mt-0 lg:max-w-md lg:w-full">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="lg:w-64 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <FunnelIcon className="w-5 h-5 mr-2" />
                            Filters
                        </h3>

                        {/* Categories */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
                            <div className="space-y-2">
                                {CATEGORIES.map(category => (
                                    <label key={category.id} className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category.id}
                                            checked={selectedCategory === category.id}
                                            onChange={(e) => handleCategoryChange(e.target.value)}
                                            className="text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                      {category.icon} {category.name}
                    </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                            <div className="space-y-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="50000"
                                    step="1000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>KSh 0</span>
                                    <span>KSh {priceRange[1].toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <h4 className="font-medium text-gray-700 mb-3">Sort By</h4>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">
                            Showing {filteredProducts.length} of {products.length} products
                        </p>
                    </div>

                    <ProductGrid products={filteredProducts} />
                </div>
            </div>
        </div>
    );
};

export default Shop;