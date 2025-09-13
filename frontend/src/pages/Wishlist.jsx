import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductGrid from '../components/product/ProductGrid';

const Wishlist = () => {
    const { wishlistItems } = useCart();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Please login to view your wishlist</h2>
                    <p className="text-gray-600 mb-8">Save your favorite items by creating an account.</p>
                    <button className="btn btn-primary text-lg px-8 py-3">
                        Login / Sign Up
                    </button>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-600 mb-8">Save items you love by clicking the heart icon.</p>
                    <Link to="/shop" className="btn btn-primary text-lg px-8 py-3">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                <p className="text-gray-600">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later</p>
            </div>

            <ProductGrid products={wishlistItems} />
        </div>
    );
};

export default Wishlist;