import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. IMPORT LAYOUT DÙNG CHUNG
import Header from './components/Header';
import Footer from './components/Footer';

// 2. IMPORT CÁC TRANG CHỨC NĂNG
import Home from './pages/home/index';

import ProductDetail from './pages/product-detail';

// Sau này bạn có thể import thêm Shop, Blog, Cart, Checkout... tại đây
import Blog from './pages/blog/index';
import BlogDetail from './pages/blog/BlogDetail';

// BỔ SUNG: Import trang Shop vào đây!
import Shop from './pages/shop/index';

import './App.css';

// Layout bao bọc toàn bộ website
const MainLayout = ({ children }) => (
    <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
            {children}
        </main>2
        <Footer />
    </div>
);

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    {/* Trang chủ - Sử dụng component Home đã tách */}
                    <Route path="/" element={<Home />} />

                    {/* BỔ SUNG: Cấu hình URL /shop sẽ mở Component Shop */}
                    <Route path="/shop" element={<Shop />} />
                 
                    {/* Trang chi tiết sản phẩm */}
                    <Route path="/product/:id" element={
                        <div className="container py-4">
                            <ProductDetail />
                        </div>
                    } />

                    {/* Trang blog */}
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    {/* Sau này thêm các Route khác tại đây */}
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;