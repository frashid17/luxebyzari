import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
    const { addToCart, toggleWishlist, wishlistItems } = useCart();
    const { user } = useAuth();

    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    const discount = product.originalPrice ?
        Math.round((1 - product.price / product.originalPrice) * 100) : 0;

    const handleWishlistClick = (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to add items to wishlist');
            return;
        }
        toggleWishlist(product);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!product.inStock) return;
        addToCart(product);
    };

    return (
        <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <Link to={`/product/${product.id}`}>
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            -{discount}%
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistClick}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                    >
                        {isInWishlist ? (
                            <HeartIconSolid className="w-5 h-5 text-red-500" />
                        ) : (
                            <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
                        )}
                    </button>

                    {/* Stock Status */}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold bg-red-500 px-3 py-1 rounded-lg">
                Out of Stock
              </span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
                <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon
                                key={i}
                                className={`w-4 h-4 ${
                                    i < Math.floor(product.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl font-bold text-purple-600">
            KSh {product.price.toLocaleString()}
          </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
              KSh {product.originalPrice.toLocaleString()}
            </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                        product.inStock
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;