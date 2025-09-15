import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


// Import components safely
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import ProductManagement from './admin/pages/ProductManagement';

// Admin imports
import Dashboard from './admin/pages/Dashboard';


// Import contexts
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

function App() {
    console.log('🚀 App component rendering...');

    return (
        <div className="App">
            <AuthProvider>
                <CartProvider>
                    <ProductProvider>
                        <Routes>
                            {/* Admin Routes */}
                            <Route path="/admin/products" element={<ProductManagement />} />
                            <Route path="/admin" element={<Dashboard />} />
                            <Route path="/admin/dashboard" element={<Dashboard />} />

                            {/* Public Routes */}
                            <Route path="/*" element={
                                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
                                    <Header />

                                    <main className="pt-16">
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/shop" element={<Shop />} />
                                            <Route path="/product/:id" element={<ProductDetail />} />
                                            <Route path="/cart" element={<Cart />} />
                                            <Route path="/wishlist" element={<Wishlist />} />
                                            <Route path="/about" element={<About />} />
                                        </Routes>
                                    </main>

                                    <Footer />
                                </div>
                            } />
                        </Routes>
                        <Toaster position="top-right" />
                    </ProductProvider>
                </CartProvider>
            </AuthProvider>
        </div>
    );
}

export default App;