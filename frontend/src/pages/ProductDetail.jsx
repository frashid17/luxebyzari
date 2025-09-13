import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StarIcon, HeartIcon, ShoppingBagIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductGrid from '../components/product/ProductGrid';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products } = useProducts();
    const { addToCart, toggleWishlist, wishlistItems } = useCart();
    const { user } = useAuth();

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const product = products.find(p => p.id === parseInt(id));

    useEffect(() => {
        if (!product) return;

        // Set default selections
        if (product.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
        }
        if (product.colors && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        }
    }, [product]);

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                    <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
                    <Link to="/shop" className="btn btn-primary">
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    const discount = product.originalPrice ?
        Math.round((1 - product.price / product.originalPrice) * 100) : 0;

    // Get related products (same category, different product)
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        if (!product.inStock) return;

        // For shoes, require size selection
        if (product.category === 'shoes' && product.sizes && !selectedSize) {
            toast.error('Please select a size');
            return;
        }

        addToCart(product, quantity);
    };

    const handleWishlistToggle = () => {
        if (!user) {
            toast.error('Please login to add items to wishlist');
            return;
        }
        toggleWishlist(product);
    };

    // Mock images array (in real app, this would come from product data)
    const productImages = [product.image, product.image, product.image];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-purple-600">Home</Link>
                <span>/</span>
                <Link to="/shop" className="hover:text-purple-600">Shop</Link>
                <span>/</span>
                <Link to={`/shop?category=${product.category}`} className="hover:text-purple-600 capitalize">
                    {product.category}
                </Link>
                <span>/</span>
                <span className="text-gray-900">{product.name}</span>
            </nav>

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-8"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
            </button>

            <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
                {/* Product Images */}
                <div className="mb-8 lg:mb-0">
                    <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-2xl overflow-hidden mb-4">
                        <img
                            src={productImages[activeImageIndex]}
                            alt={product.name}
                            className="w-full h-96 object-cover"
                        />
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                -{discount}% OFF
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Images */}
                    {productImages.length > 1 && (
                        <div className="flex space-x-2">
                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                        activeImageIndex === index ? 'border-purple-500' : 'border-gray-200'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                                <span className="text-sm text-gray-600 ml-2">
                  {product.rating} ({product.reviews} reviews)
                </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                product.inStock
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
                        </div>

                        <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-purple-600">
                KSh {product.price.toLocaleString()}
              </span>
                            {product.originalPrice && (
                                <span className="text-xl text-gray-500 line-through">
                  KSh {product.originalPrice.toLocaleString()}
                </span>
                            )}
                            {discount > 0 && (
                                <span className="text-green-600 font-semibold">
                  Save KSh {(product.originalPrice - product.price).toLocaleString()}
                </span>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                            selectedSize === size
                                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                            selectedColor === color
                                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                    className="p-2 hover:bg-gray-50 disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2 hover:bg-gray-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4 mb-8">
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
                                    product.inStock
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                <ShoppingBagIcon className="w-5 h-5" />
                                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                            </button>

                            <button
                                onClick={handleWishlistToggle}
                                className="p-4 border-2 border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                            >
                                {isInWishlist ? (
                                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                                ) : (
                                    <HeartIcon className="w-6 h-6 text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="border-t pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3">
                                <TruckIcon className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Free Shipping</p>
                                    <p className="text-sm text-gray-600">Orders over KSh 20,000</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Secure Payment</p>
                                    <p className="text-sm text-gray-600">M-Pesa & Card</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🔄</span>
                                <div>
                                    <p className="font-medium text-gray-900">Easy Returns</p>
                                    <p className="text-sm text-gray-600">14 days return policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
                    <ProductGrid products={relatedProducts} />
                </div>
            )}
        </div>
    );
};

export default ProductDetail;