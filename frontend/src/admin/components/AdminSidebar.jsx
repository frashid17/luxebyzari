import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    CubeIcon,
    ShoppingBagIcon,
    UsersIcon,
    ChartBarIcon,
    CogIcon,
    ArrowRightOnRectangleIcon  // Changed from ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: ChartBarIcon, label: 'Dashboard', path: '/admin' },
        { icon: CubeIcon, label: 'Products', path: '/admin/products' },
        { icon: ShoppingBagIcon, label: 'Orders', path: '/admin/orders' },
        { icon: UsersIcon, label: 'Users', path: '/admin/users' },
        { icon: CogIcon, label: 'Settings', path: '/admin/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleBackToStore = () => {
        navigate('/');
    };

    return (
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-center h-16 bg-gradient-to-r from-purple-600 to-pink-600">
                    <h1 className="text-xl font-bold text-white">LuxeByZari Admin</h1>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{user?.avatar}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-sm text-gray-500">Administrator</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                    <button
                        onClick={handleBackToStore}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors w-full"
                    >
                        <HomeIcon className="w-5 h-5" />
                        <span className="font-medium">Back to Store</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors w-full"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;