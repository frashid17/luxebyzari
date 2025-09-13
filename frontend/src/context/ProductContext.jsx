import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all products
    const fetchProducts = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await productService.getProducts(params);

            if (response.success) {
                setProducts(response.data);
                setFilteredProducts(response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch products');
            }
        } catch (error) {
            console.error('Fetch products error:', error);
            setError(error.response?.data?.message || 'Failed to load products');
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // Fetch featured products
    const fetchFeaturedProducts = async () => {
        try {
            const response = await productService.getFeaturedProducts();

            if (response.success) {
                setFeaturedProducts(response.data);
            }
        } catch (error) {
            console.error('Fetch featured products error:', error);
        }
    };

    // Filter products based on search and category
    const filterProducts = async (category = selectedCategory, query = searchQuery) => {
        try {
            setLoading(true);
            setError(null);

            const params = {};

            if (category !== 'all') {
                params.category = category;
            }

            if (query) {
                params.search = query;
            }

            const response = await productService.getProducts(params);

            if (response.success) {
                setFilteredProducts(response.data);
            }
        } catch (error) {
            console.error('Filter products error:', error);
            setError('Failed to filter products');
            toast.error('Failed to filter products');
        } finally {
            setLoading(false);
        }
    };

    // Get single product
    const getProduct = async (id) => {
        try {
            const response = await productService.getProduct(id);

            if (response.success) {
                return response.data;
            } else {
                throw new Error(response.message || 'Product not found');
            }
        } catch (error) {
            console.error('Get product error:', error);
            toast.error('Failed to load product');
            throw error;
        }
    };

    // Initial load
    useEffect(() => {
        fetchProducts();
        fetchFeaturedProducts();
    }, []);

    // Filter when search query or category changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            filterProducts(selectedCategory, searchQuery);
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory]);

    const value = {
        products,
        filteredProducts,
        featuredProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        loading,
        error,
        fetchProducts,
        fetchFeaturedProducts,
        filterProducts,
        getProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};