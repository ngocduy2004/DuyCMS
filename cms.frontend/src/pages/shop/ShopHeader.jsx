// src/pages/shop/ShopHeader.jsx
import React from 'react';

const ShopHeader = ({ totalCount, searchQuery, onSearch }) => {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
            <div className="mb-3 mb-md-0">
                <span className="text-muted">
                    Tìm thấy <strong className="text-dark">{totalCount}</strong> sản phẩm phù hợp
                </span>
            </div>
            <div className="search-box" style={{ maxWidth: '300px', width: '100%' }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery} // Hiển thị đúng từ khóa hiện tại
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
};

export default ShopHeader;