import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
    const { user, logout } = useAuth();
    const { getCartItemsCount, wishlistItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const cartItemsCount = getCartItemsCount();
    const wishlistCount = wishlistItems.length;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              ✨ LuxeByZari
            </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors">
                            Home
                        </Link>
                        <Link to="/shop" className="text-gray-700 hover:text-purple-600 transition-colors">
                            Shop
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
                            About
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors">
                                    <HeartIcon className="w-6 h-6" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                                    )}
                                </Link>

                                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors">
                                    <ShoppingBagIcon className="w-6 h-6" />
                                    {cartItemsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                                    )}
                                </Link>

                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {user.avatar}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                    <button
                                        onClick={logout}
                                        className="text-sm text-gray-500 hover:text-red-500 ml-2"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <button className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium">
                                    Login
                                </button>
                                <button className="btn btn-primary">
                                    Sign Up
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600"
                        >
                            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            <Link to="/" className="text-gray-700 hover:text-purple-600" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                            <Link to="/shop" className="text-gray-700 hover:text-purple-600" onClick={() => setIsMenuOpen(false)}>
                                Shop
                            </Link>
                            <Link to="/about" className="text-gray-700 hover:text-purple-600" onClick={() => setIsMenuOpen(false)}>
                                About
                            </Link>

                            {user ? (
                                <>
                                    <Link to="/wishlist" className="text-gray-700 hover:text-purple-600 flex items-center" onClick={() => setIsMenuOpen(false)}>
                                        <HeartIcon className="w-4 h-4 mr-2" />
                                        Wishlist ({wishlistCount})
                                    </Link>
                                    <Link to="/cart" className="text-gray-700 hover:text-purple-600 flex items-center" onClick={() => setIsMenuOpen(false)}>
                                        <ShoppingBagIcon className="w-4 h-4 mr-2" />
                                        Cart ({cartItemsCount})
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="text-left text-red-500 hover:text-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="text-left text-purple-600 hover:text-purple-700">
                                        Login
                                    </button>
                                    <button className="text-left btn btn-primary">
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;