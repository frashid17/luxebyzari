import React, { useState, useEffect } from 'react';
import {
    CubeIcon,
    ShoppingBagIcon,
    UsersIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon  // Changed from TrendingUpIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../components/AdminLayout';
import StatsCard from '../components/StatsCard';
import { useProducts } from '../../context/ProductContext';

const Dashboard = () => {
    const { products } = useProducts();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        outOfStock: 0,
        featuredProducts: 0
    });

    useEffect(() => {
        // Calculate stats from products
        if (products.length > 0) {
            const outOfStock = products.filter(p => !p.inStock).length;
            const featured = products.filter(p => p.featured).length;

            setStats({
                totalProducts: products.length,
                totalOrders: 156, // Mock data - would come from API
                totalUsers: 1240, // Mock data - would come from API
                totalRevenue: 2847650, // Mock data - would come from API
                outOfStock,
                featuredProducts: featured
            });
        }
    }, [products]);

    const recentOrders = [
        { id: '#ORD001', customer: 'Alice Johnson', product: 'Luxury Leather Heels', amount: 12500, status: 'Completed' },
        { id: '#ORD002', customer: 'Bob Smith', product: 'Designer Handbag', amount: 25000, status: 'Processing' },
        { id: '#ORD003', customer: 'Carol Davis', product: 'Premium Boots', amount: 18000, status: 'Shipped' },
        { id: '#ORD004', customer: 'David Wilson', product: 'Evening Clutch', amount: 6500, status: 'Pending' },
        { id: '#ORD005', customer: 'Eva Brown', product: 'Sport Sneakers', amount: 8500, status: 'Completed' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon={CubeIcon}
                        change="+12% from last month"
                        changeType="positive"
                        color="purple"
                    />
                    <StatsCard
                        title="Total Orders"
                        value={stats.totalOrders.toLocaleString()}
                        icon={ShoppingBagIcon}
                        change="+8% from last month"
                        changeType="positive"
                        color="blue"
                    />
                    <StatsCard
                        title="Total Users"
                        value={stats.totalUsers.toLocaleString()}
                        icon={UsersIcon}
                        change="+23% from last month"
                        changeType="positive"
                        color="green"
                    />
                    <StatsCard
                        title="Total Revenue"
                        value={`KSh ${stats.totalRevenue.toLocaleString()}`}
                        icon={CurrencyDollarIcon}
                        change="+15% from last month"
                        changeType="positive"
                        color="orange"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">{stats.outOfStock}</p>
                            </div>
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <ChartBarIcon className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Featured Products</p>
                                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.featuredProducts}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">3.2%</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.product}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        KSh {order.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-sm p-6 text-white">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-white/30 transition-colors">
                            <CubeIcon className="w-6 h-6 mb-2" />
                            <p className="font-medium">Add New Product</p>
                            <p className="text-sm opacity-90">Create a new product listing</p>
                        </button>
                        <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-white/30 transition-colors">
                            <ShoppingBagIcon className="w-6 h-6 mb-2" />
                            <p className="font-medium">View Orders</p>
                            <p className="text-sm opacity-90">Manage customer orders</p>
                        </button>
                        <button className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left hover:bg-white/30 transition-colors">
                            <UsersIcon className="w-6 h-6 mb-2" />
                            <p className="font-medium">Customer Support</p>
                            <p className="text-sm opacity-90">Help customers with issues</p>
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;