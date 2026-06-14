import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoryList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail'; // Component mới
import './App.css';

function App() {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // Trang chủ bao gồm Sidebar danh mục và danh sách sản phẩm
    const HomePage = () => (
        <div className="row">
            <div className="col-md-4">
                <CategoryList
                    onCategorySelect={setSelectedCategoryId}
                    activeCategoryId={selectedCategoryId}
                />
            </div>
            <div className="col-md-8">
                <h4 className="mb-4 text-uppercase">Bộ sưu tập mới nhất</h4>
                <ProductList categoryId={selectedCategoryId} />
            </div>
        </div>
    );

    return (
        <Router>
            <div className="container mt-5">
                <header className="pb-3 mb-4 border-bottom">
                    <span className="fs-4 font-weight-bold text-dark">👗 FASHION BOUTIQUE</span>
                </header>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;