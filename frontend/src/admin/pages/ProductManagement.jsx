import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../components/AdminLayout';
import { useProducts } from '../../context/ProductContext';
import toast from 'react-hot-toast';

const ProductManagement = () => {
    const { products, fetchProducts } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        let filtered = products;

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [products, searchQuery, categoryFilter]);

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            // This would make an API call to delete the product
            toast.success('Product deleted successfully');
            fetchProducts(); // Refresh the products list
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const getStockStatusColor = (product) => {
        if (!product.inStock) return 'bg-red-100 text-red-800';
        if (product.stock < 5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStockStatusText = (product) => {
        if (!product.inStock) return 'Out of Stock';
        if (product.stock < 5) return 'Low Stock';
        return 'In Stock';
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                        <p className="text-gray-600 mt-1">Manage your product inventory</p>
                    </div>
                    <button className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2">
                        <PlusIcon className="w-5 h-5" />
                        <span>Add New Product</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                            <input
                                type="text"
                                placeholder="Search by name or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                <option value="shoes">Shoes</option>
                                <option value="bags">Bags</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="low-stock">Low Stock</option>
                                <option value="out-of-stock">Out of Stock</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Active Products</p>
                        <p className="text-2xl font-bold text-green-600">{products.filter(p => p.inStock).length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Out of Stock</p>
                        <p className="text-2xl font-bold text-red-600">{products.filter(p => !p.inStock).length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">Low Stock</p>
                        <p className="text-2xl font-bold text-yellow-600">{products.filter(p => p.stock < 5 && p.inStock).length}</p>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={product.images?.[0]?.url || 'https://via.placeholder.com/60x60?text=No+Image'}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.brand}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 capitalize">
                        {product.category}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div>
                                            <span className="font-semibold">KSh {product.price.toLocaleString()}</span>
                                            {product.originalPrice && (
                                                <div className="text-xs text-gray-500 line-through">
                                                    KSh {product.originalPrice.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.stock || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(product)}`}>
                        {getStockStatusText(product)}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900" title="View">
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900" title="Edit">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">No products found</div>
                            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProductManagement;