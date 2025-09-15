import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, HeartIcon, ShoppingBagIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductGrid from '../components/product/ProductGrid';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProduct, products } = useProducts();
    const { addToCart, toggleWishlist, wishlistItems } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('🔍 ProductDetail: Fetching product with ID:', id);
                console.log('🔍 ProductDetail: Available products count:', products.length);

                if (products.length > 0) {
                    console.log('🔍 ProductDetail: Sample product IDs:', products.slice(0, 3).map(p => p._id));
                }

                const productData = await getProduct(id);
                console.log('✅ ProductDetail: Product loaded:', productData);

                setProduct(productData);

                // Set default selections
                if (productData.sizes && productData.sizes.length > 0) {
                    setSelectedSize(productData.sizes[0]);
                }
                if (productData.colors && productData.colors.length > 0) {
                    setSelectedColor(productData.colors[0]);
                }

            } catch (error) {
                console.error('❌ ProductDetail: Failed to load product:', error);
                setError(error.message || 'Product not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, getProduct, products]);

    // Add error state handling
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                    <p className="text-sm text-gray-500 mt-2">Product ID: {id}</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        {error || 'Product not found'}
                    </h2>
                    <p className="text-gray-600 mb-4">Product ID: {id}</p>
                    <p className="text-sm text-gray-500 mb-6">
                        Available products: {products.length}
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="btn btn-primary"
                    >
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product not found</h2>
                    <button
                        onClick={() => navigate('/shop')}
                        className="btn btn-primary"
                    >
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const isInWishlist = wishlistItems.some(item => item._id === product._id);
    const discount = product.originalPrice ?
        Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const relatedProducts = products.filter(p =>
        p.category === product.category && p._id !== product._id
    ).slice(0, 4);

    const handleAddToCart = () => {
        if (!product.inStock) return;

        const cartProduct = {
            ...product,
            selectedSize,
            selectedColor,
            image: product.images?.[0]?.url || 'https://via.placeholder.com/300x300'
        };

        addToCart(cartProduct, quantity);
    };

    const handleWishlistToggle = () => {
        if (!user) {
            toast.error('Please login to add items to wishlist');
            return;
        }
        toggleWishlist(product);
    };

    // Get main product image
    const mainImage = product.images?.[0]?.url || 'https://via.placeholder.com/500x500?text=No+Image';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                <button onClick={() => navigate('/')} className="hover:text-purple-600">Home</button>
                <span>/</span>
                <button onClick={() => navigate('/shop')} className="hover:text-purple-600">Shop</button>
                <span>/</span>
                <button onClick={() => navigate(`/shop?category=${product.category}`)} className="hover:text-purple-600">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </button>
                <span>/</span>
                <span className="text-gray-900">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                            }}
                        />

                        {/* Discount Badge */}
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
                                -{discount}%
                            </div>
                        )}

                        {/* Stock Status */}
                        {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold bg-red-500 px-4 py-2 rounded-lg text-lg">
                  Out of Stock
                </span>
                            </div>
                        )}
                    </div>

                    {/* Additional Images */}
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.slice(0, 4).map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                        {/* Brand */}
                        {product.brand && (
                            <p className="text-lg text-gray-600 mb-2">by {product.brand}</p>
                        )}

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <StarIconSolid
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < Math.floor(product.rating || 0)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-lg font-semibold">{product.rating || 0}</span>
                            <span className="text-gray-600">({product.numOfReviews || 0} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-purple-600">
                KSh {product.price?.toLocaleString()}
              </span>
                            {product.originalPrice && (
                                <span className="text-xl text-gray-500 line-through">
                  KSh {product.originalPrice.toLocaleString()}
                </span>
                            )}
                            {discount > 0 && (
                                <span className="text-green-600 font-semibold">
                  Save {discount}%
                </span>
                            )}
                        </div>
                    </div>

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                            <div className="flex space-x-3">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                                            selectedColor === color
                                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-2 rounded-lg border-2 font-medium transition-colors ${
                                            selectedSize === size
                                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                            >
                                <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Stock Info */}
                    {product.stock !== undefined && (
                        <div className="text-sm text-gray-600">
                            {product.stock > 0 ? (
                                <span className="text-green-600">✅ {product.stock} items in stock</span>
                            ) : (
                                <span className="text-red-600">❌ Out of stock</span>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-lg font-semibold text-lg transition-all ${
                                    product.inStock
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                <ShoppingBagIcon className="w-6 h-6" />
                                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                            </button>

                            <button
                                onClick={handleWishlistToggle}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    isInWishlist
                                        ? 'border-red-500 bg-red-50 text-red-600'
                                        : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600'
                                }`}
                            >
                                {isInWishlist ? (
                                    <HeartIconSolid className="w-6 h-6" />
                                ) : (
                                    <HeartIcon className="w-6 h-6" />
                                )}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <span>🚚</span>
                                <span>Free shipping over KSh 10,000</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>↩️</span>
                                <span>30-day returns</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>🔒</span>
                                <span>Secure payment</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>📞</span>
                                <span>24/7 support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-16">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'description'
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'reviews'
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Reviews ({product.numOfReviews || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'shipping'
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Shipping & Returns
                        </button>
                    </nav>
                </div>

                <div className="py-8">
                    {activeTab === 'description' && (
                        <div className="prose max-w-none">
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                {product.description}
                            </p>

                            {/* Tags */}
                            {product.tags && product.tags.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Tags:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                            >
                        {tag}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 space-y-4">
                                <h4 className="font-semibold text-gray-900">Features:</h4>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    <li>Premium quality materials</li>
                                    <li>Handcrafted with attention to detail</li>
                                    <li>Comfortable fit for all-day wear</li>
                                    <li>Durable construction</li>
                                    <li>Timeless design</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <div className="text-center py-12 text-gray-500">
                                <StarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>Customer reviews will be displayed here</p>
                                <p className="text-sm">Feature coming soon!</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Shipping Information</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• Free standard shipping on orders over KSh 10,000</li>
                                    <li>• Standard delivery: 3-5 business days</li>
                                    <li>• Express delivery: 1-2 business days (additional charges apply)</li>
                                    <li>• Same-day delivery available in Nairobi</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Returns & Exchanges</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• 30-day return policy</li>
                                    <li>• Items must be in original condition with tags</li>
                                    <li>• Free return shipping</li>
                                    <li>• Exchange available for different size/color</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        You Might Also Like
                    </h3>
                    <ProductGrid products={relatedProducts} />
                </div>
            )}
        </div>
    );
};

export default ProductDetail;