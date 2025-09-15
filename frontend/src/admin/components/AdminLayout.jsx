import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Toaster } from 'react-hot-toast';

const AdminLayout = ({ children }) => {
    const { user, isInitialized } = useAuth();

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    // Check if user is admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-6 ml-64">
                    {children}
                </main>
            </div>
            <Toaster position="top-right" />
        </div>
    );
};

export default AdminLayout;