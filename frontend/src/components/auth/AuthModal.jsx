import React, { useState } from 'react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }) => {
    const { login, register, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (mode === 'register') {
            if (!formData.name) {
                newErrors.name = 'Name is required';
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            onClose();
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        } catch (error) {
            console.error('Auth error:', error);
        }
    };

    const handleClose = () => {
        onClose();
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setErrors({});
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.password ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {mode === 'register' && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                                isLoading
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'btn btn-primary hover:transform hover:scale-105'
                            }`}
                        >
                            {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {/* Switch Mode */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
                                className="text-purple-600 hover:text-purple-700 font-semibold"
                            >
                                {mode === 'login' ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    {mode === 'login' && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 text-center">
                                <strong>Demo:</strong> Use any email and password to login
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;