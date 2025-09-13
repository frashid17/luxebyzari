import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(item.id);
        } else {
            updateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border">
            {/* Product Image */}
            <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                />
            </Link>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                        {item.name}
                    </h3>
                </Link>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-lg font-bold text-purple-600 mt-1">
                    KSh {item.price.toLocaleString()}
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <MinusIcon className="w-4 h-4" />
                </button>

                <span className="w-12 text-center font-semibold bg-gray-50 py-2 rounded">
          {item.quantity}
        </span>

                <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Total Price */}
            <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                    KSh {(item.price * item.quantity).toLocaleString()}
                </p>
            </div>

            {/* Remove Button */}
            <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default CartItem;