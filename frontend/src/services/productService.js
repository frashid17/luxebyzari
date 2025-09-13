import api from './api';

export const productService = {
    // Get all products with filters
    getProducts: async (params = {}) => {
        try {
            const response = await api.get('/products', { params });
            return response.data;
        } catch (error) {
            console.error('Get products error:', error);
            throw error;
        }
    },

    // Get single product
    getProduct: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get product error:', error);
            throw error;
        }
    },

    // Get featured products
    getFeaturedProducts: async () => {
        try {
            const response = await api.get('/products/featured');
            return response.data;
        } catch (error) {
            console.error('Get featured products error:', error);
            throw error;
        }
    },

    // Add product review
    addReview: async (productId, reviewData) => {
        try {
            const response = await api.post(`/products/${productId}/reviews`, reviewData);
            return response.data;
        } catch (error) {
            console.error('Add review error:', error);
            throw error;
        }
    },

    // Admin: Create product
    createProduct: async (productData) => {
        try {
            const response = await api.post('/products', productData);
            return response.data;
        } catch (error) {
            console.error('Create product error:', error);
            throw error;
        }
    },

    // Admin: Update product
    updateProduct: async (id, productData) => {
        try {
            const response = await api.put(`/products/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error('Update product error:', error);
            throw error;
        }
    },

    // Admin: Delete product
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete product error:', error);
            throw error;
        }
    }
};