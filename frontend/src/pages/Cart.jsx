import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/cart/CartItem';

const Cart = () => {
    const { cartItems, getCartTotal, getCartItemsCount } = useCart();
    const { user } = useAuth();

    const total = getCartTotal();
    const itemCount = getCartItemsCount();
    const shipping = total > 20000 ? 0 : 500; // Free shipping over KSh 20,000
    const finalTotal = total + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-7">
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-5 mt-8 lg:mt-0">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                                <span className="font-semibold">KSh {total.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold">
                  {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                  ) : (
                      `KSh ${shipping.toLocaleString()}`
                  )}
                </span>
                            </div>

                            {shipping === 0 && (
                                <p className="text-sm text-green-600">🎉 You've qualified for free shipping!</p>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-lg font-bold text-purple-600">
                    KSh {finalTotal.toLocaleString()}
                  </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            {user ? (
                                <button className="w-full btn btn-primary text-lg py-3">
                                    Proceed to Checkout
                                </button>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 mb-3 text-center">
                                        Please login to continue with checkout
                                    </p>
                                    <button className="w-full btn btn-primary text-lg py-3">
                                        Login to Checkout
                                    </button>
                                </div>
                            )}

                            <Link to="/shop" className="w-full btn btn-outline text-center block">
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-6 pt-6 border-t">
                            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <span className="mr-1">🔒</span>
                                    Secure Payment
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-1">📱</span>
                                    M-Pesa Ready
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;