import api from './api';

export const authService = {
    // Register user
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('luxe_user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    // Login user
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('luxe_user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Logout user
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('luxe_user');
            localStorage.removeItem('luxe_cart');
            localStorage.removeItem('luxe_wishlist');
        }
    },

    // Get current user profile
    getProfile: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    // Update user profile
    updateProfile: async (userData) => {
        try {
            const response = await api.put('/auth/profile', userData);

            if (response.data.success) {
                // Update stored user data
                localStorage.setItem('luxe_user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }
};