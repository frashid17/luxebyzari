import React, { createContext, useContext, useState, useEffect } from 'react';
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

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching products from API...');

            const response = await fetch('http://localhost:5001/api/products');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📦 API Response:', data);

            if (data.success && data.data) {
                setProducts(data.data);
                setFilteredProducts(data.data);

                // Set featured products
                const featured = data.data.filter(p => p.featured);
                setFeaturedProducts(featured);

                console.log('✅ Products loaded successfully:', data.data.length);
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('❌ Failed to fetch products:', error);
            setError('Failed to load products from server.');
            toast.error('Failed to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    // Filter products
    const filterProducts = (category = selectedCategory, query = searchQuery) => {
        console.log('🔍 Filtering products:', { category, query });

        let filtered = products;

        if (category !== 'all') {
            filtered = filtered.filter(product => product.category === category);
        }

        if (query) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
        console.log('📊 Filtered results:', filtered.length);
    };

    // Get single product - FIXED VERSION
    const getProduct = async (id) => {
        try {
            console.log('🔍 Getting product with ID:', id);

            // First try to find in loaded products (faster)
            const cachedProduct = products.find(p => p._id === id);
            if (cachedProduct) {
                console.log('✅ Found product in cache:', cachedProduct.name);
                return cachedProduct;
            }

            // If not in cache, fetch from API
            console.log('🌐 Fetching product from API...');
            const response = await fetch(`http://localhost:5001/api/products/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Product not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📦 Single product API response:', data);

            if (data.success && data.data) {
                console.log('✅ Product fetched from API:', data.data.name);
                return data.data;
            } else {
                throw new Error(data.message || 'Product not found');
            }
        } catch (error) {
            console.error('❌ Get product error:', error);
            throw error; // Re-throw so the component can handle it
        }
    };

    // Initialize on mount
    useEffect(() => {
        console.log('🚀 ProductProvider initializing...');
        fetchProducts();
    }, []);

    // Filter when search/category changes
    useEffect(() => {
        if (products.length > 0) {
            filterProducts(selectedCategory, searchQuery);
        }
    }, [searchQuery, selectedCategory, products]);

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
        filterProducts,
        getProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};