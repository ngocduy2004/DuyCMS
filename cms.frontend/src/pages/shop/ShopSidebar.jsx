import React, { useState } from 'react';

const ShopSidebar = ({ categories, activeCategoryId, onCategorySelect, onPriceChange }) => {
    const [minVal, setMinVal] = useState('');
    const [maxVal, setMaxVal] = useState('');

    const handleApplyPrice = (e) => {
        e.preventDefault();
        onPriceChange(minVal, maxVal);
    };

    return (
        <div className="shop-sidebar pe-md-4">
            {/* Lọc theo Danh mục */}
            <div className="mb-5">
                <h5 className="font-weight-bold mb-3 text-uppercase" style={{ letterSpacing: '1px', fontSize: '1.1rem' }}>
                    Danh mục
                </h5>
                <ul className="list-unstyled">
                    <li className="mb-2">
                        <button
                            className={`btn btn-link text-decoration-none p-0 ${activeCategoryId === null ? 'text-primary font-weight-bold' : 'text-dark'}`}
                            onClick={() => onCategorySelect(null)}
                        >
                            Tất cả sản phẩm
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.id} className="mb-2">
                            <button
                                className={`btn btn-link text-decoration-none p-0 ${activeCategoryId === cat.id ? 'text-primary font-weight-bold' : 'text-dark'}`}
                                onClick={() => onCategorySelect(cat.id)}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Lọc theo Giá */}
            <div>
                <h5 className="font-weight-bold mb-3 text-uppercase" style={{ letterSpacing: '1px', fontSize: '1.1rem' }}>
                    Khoảng Giá
                </h5>
                <form onSubmit={handleApplyPrice}>
                    <div className="row g-2 mb-3">
                        <div className="col-6">
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="Từ (đ)"
                                value={minVal}
                                onChange={(e) => setMinVal(e.target.value)}
                                min="0"
                            />
                        </div>
                        <div className="col-6">
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="Đến (đ)"
                                value={maxVal}
                                onChange={(e) => setMaxVal(e.target.value)}
                                min="0"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-dark btn-sm w-100">Áp dụng</button>
                </form>
            </div>
        </div>
    );
};

export default ShopSidebar;