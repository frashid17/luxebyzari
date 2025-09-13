import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const savedUser = localStorage.getItem('luxe_user');

                if (token && savedUser) {
                    setUser(JSON.parse(savedUser));

                    // Optionally verify token with backend
                    try {
                        const response = await authService.getProfile();
                        if (response.success) {
                            setUser(response.user);
                            localStorage.setItem('luxe_user', JSON.stringify(response.user));
                        }
                    } catch (error) {
                        // Token might be expired, clear auth data
                        console.error('Token verification failed:', error);
                        localStorage.removeItem('token');
                        localStorage.removeItem('luxe_user');
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsInitialized(true);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setIsLoading(true);

            const response = await authService.login(email, password);

            if (response.success) {
                setUser(response.user);
                toast.success(response.message || 'Login successful!');
                return true;
            } else {
                toast.error(response.message || 'Login failed');
                return false;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password) => {
        try {
            setIsLoading(true);

            const response = await authService.register({ name, email, password });

            if (response.success) {
                setUser(response.user);
                toast.success(response.message || 'Registration successful!');
                return true;
            } else {
                toast.error(response.message || 'Registration failed');
                return false;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);

            await authService.logout();
            setUser(null);

            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local state even if API call fails
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (userData) => {
        try {
            setIsLoading(true);

            const response = await authService.updateProfile(userData);

            if (response.success) {
                setUser(response.user);
                toast.success(response.message || 'Profile updated successfully');
                return true;
            } else {
                toast.error(response.message || 'Profile update failed');
                return false;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Profile update failed';
            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isLoading,
        isInitialized,
        login,
        register,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};