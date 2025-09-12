import React, { createContext, useContext, useState } from 'react';
import { SAMPLE_PRODUCTS } from '../utils/constants';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products] = useState(SAMPLE_PRODUCTS);
    const [filteredProducts, setFilteredProducts] = useState(SAMPLE_PRODUCTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filterProducts = (category, query) => {
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
    };

    const value = {
        products,
        filteredProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filterProducts
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};