import React, { createContext, useContext, useState, useEffect } from 'react';
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

    // Initialize auth state
    useEffect(() => {
        console.log('🚀 AuthProvider initializing...');

        const initAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const savedUser = localStorage.getItem('luxe_user');

                console.log('🔍 Checking stored auth:', {
                    hasToken: !!token,
                    hasSavedUser: !!savedUser
                });

                if (token && savedUser) {
                    const userData = JSON.parse(savedUser);
                    console.log('👤 Setting user from storage:', userData);
                    setUser(userData);

                    // Optionally verify token with backend
                    try {
                        const response = await fetch('http://localhost:5001/api/auth/me', {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include'
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.success) {
                                console.log('✅ Token verified, updating user data:', data.user);
                                setUser(data.user);
                                localStorage.setItem('luxe_user', JSON.stringify(data.user));
                            }
                        } else {
                            console.log('❌ Token verification failed:', response.status);
                            // Token might be expired
                            localStorage.removeItem('token');
                            localStorage.removeItem('luxe_user');
                            setUser(null);
                        }
                    } catch (error) {
                        console.log('❌ Token verification error:', error);
                        // Keep the stored user data even if verification fails
                    }
                } else {
                    console.log('ℹ️ No stored authentication found');
                }
            } catch (error) {
                console.error('❌ Auth initialization error:', error);
            } finally {
                setIsInitialized(true);
                console.log('✅ Auth initialization complete');
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            console.log('🔐 Attempting login for:', email);

            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('📝 Login response:', data);

            if (data.success) {
                console.log('✅ Login successful, storing user data:', data.user);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('luxe_user', JSON.stringify(data.user));
                toast.success('Login successful!');
                return true;
            } else {
                console.log('❌ Login failed:', data.message);
                toast.error(data.message || 'Login failed');
                return false;
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            toast.error('Login failed. Please try again.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password) => {
        try {
            setIsLoading(true);
            console.log('📝 Attempting registration for:', email);

            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            console.log('📝 Register response:', data);

            if (data.success) {
                console.log('✅ Registration successful, storing user data:', data.user);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('luxe_user', JSON.stringify(data.user));
                toast.success('Registration successful!');
                return true;
            } else {
                console.log('❌ Registration failed:', data.message);
                toast.error(data.message || 'Registration failed');
                return false;
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            toast.error('Registration failed. Please try again.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            console.log('🚪 Logging out...');

            await fetch('http://localhost:5001/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('❌ Logout API error:', error);
        } finally {
            // Always clear local state
            console.log('🧹 Clearing auth data');
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('luxe_user');
            localStorage.removeItem('luxe_cart');
            localStorage.removeItem('luxe_wishlist');
            toast.success('Logged out successfully');
        }
    };

    console.log('🔄 AuthProvider render - Current state:', {
        user: user ? { name: user.name, email: user.email, role: user.role } : null,
        isInitialized,
        isLoading
    });

    const value = {
        user,
        isLoading,
        isInitialized,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};