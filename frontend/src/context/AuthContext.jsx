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

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('luxe_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const userData = {
                id: Date.now(),
                name: 'Zari Customer',
                email,
                avatar: email.charAt(0).toUpperCase()
            };

            setUser(userData);
            localStorage.setItem('luxe_user', JSON.stringify(userData));
            toast.success('Login successful!');
            return true;
        } catch (error) {
            toast.error('Login failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const userData = {
                id: Date.now(),
                name,
                email,
                avatar: name.charAt(0).toUpperCase()
            };

            setUser(userData);
            localStorage.setItem('luxe_user', JSON.stringify(userData));
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            toast.error('Registration failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('luxe_user');
        localStorage.removeItem('luxe_cart');
        localStorage.removeItem('luxe_wishlist');
        toast.success('Logged out successfully');
    };

    const value = {
        user,
        isLoading,
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