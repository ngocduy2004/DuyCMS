// src/pages/shop/ShopSidebar.jsx
import React, { useState } from 'react';

const ShopSidebar = ({ categories = [], activeCategoryId, onCategorySelect, onPriceChange }) => {
    const [minVal, setMinVal] = useState('');
    const [maxVal, setMaxVal] = useState('');

    const handleApplyPrice = (e) => {
        e.preventDefault();
        onPriceChange(minVal, maxVal);
    };

    // Hàm tiện ích: Xóa trắng khoảng giá
    const handleClearPrice = () => {
        setMinVal('');
        setMaxVal('');
        onPriceChange('', ''); // Gọi API load lại toàn bộ giá
    };

    return (
        // position-sticky giúp thanh sidebar trượt theo màn hình khi cuộn xuống
        <div className="shop-sidebar pe-md-4 position-sticky" style={{ top: '30px', zIndex: 10 }}>

            {/* ================= KHỐI 1: DANH MỤC SẢN PHẨM ================= */}
            <div className="mb-5">
                <h5 className="font-weight-bold mb-4 text-uppercase text-dark" style={{ letterSpacing: '1px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-list-ul me-2 text-primary"></i> Danh mục
                </h5>
                <div className="d-flex flex-column gap-2">
                    {/* Nút: Tất cả sản phẩm */}
                    <button
                        className={`btn text-start px-3 py-2 rounded-3 border-0 fw-medium ${activeCategoryId === null ? 'btn-dark shadow-sm' : 'btn-light text-dark'}`}
                        onClick={() => onCategorySelect(null)}
                        style={{ transition: 'all 0.2s ease' }}
                    >
                        Tất cả sản phẩm
                    </button>

                    {/* Danh sách các danh mục từ API */}
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`btn text-start px-3 py-2 rounded-3 border-0 fw-medium ${activeCategoryId === cat.id ? 'btn-dark shadow-sm' : 'btn-light text-dark'}`}
                            onClick={() => onCategorySelect(cat.id)}
                            style={{ transition: 'all 0.2s ease' }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* ================= KHỐI 2: LỌC THEO KHOẢNG GIÁ ================= */}
            <div className="mb-5">
                <h5 className="font-weight-bold mb-4 text-uppercase text-dark" style={{ letterSpacing: '1px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-filter-circle-dollar me-2 text-primary"></i> Khoảng Giá
                </h5>

                <div className="card border-0 bg-light p-4 rounded-4 shadow-sm">
                    <form onSubmit={handleApplyPrice}>
                        {/* Ô nhập Giá Min */}
                        <div className="mb-3">
                            <label className="form-label small text-muted fw-bold text-uppercase">Từ (VNĐ)</label>
                            <input
                                type="number"
                                className="form-control form-control-lg border-0 shadow-none rounded-3 fs-6"
                                placeholder="VD: 100000"
                                value={minVal}
                                onChange={(e) => setMinVal(e.target.value)}
                                min="0"
                            />
                        </div>

                        {/* Ô nhập Giá Max */}
                        <div className="mb-4">
                            <label className="form-label small text-muted fw-bold text-uppercase">Đến (VNĐ)</label>
                            <input
                                type="number"
                                className="form-control form-control-lg border-0 shadow-none rounded-3 fs-6"
                                placeholder="VD: 500000"
                                value={maxVal}
                                onChange={(e) => setMaxVal(e.target.value)}
                                min="0"
                            />
                        </div>

                        {/* Các nút hành động */}
                        <div className="d-flex flex-column gap-2">
                            <button type="submit" className="btn btn-dark w-100 fw-bold rounded-pill py-2 shadow-sm">
                                ÁP DỤNG BỘ LỌC
                            </button>

                            {/* Nút Xóa khoảng giá (Chỉ hiện khi khách có gõ số vào ô) */}
                            {(minVal !== '' || maxVal !== '') && (
                                <button
                                    type="button"
                                    className="btn btn-link text-danger text-decoration-none small mt-1"
                                    onClick={handleClearPrice}
                                >
                                    <i className="fa-solid fa-rotate-left me-1"></i> Xóa khoảng giá
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShopSidebar;