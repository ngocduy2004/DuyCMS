// src/pages/home/CategoryMenu.jsx
import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

const CategoryMenu = ({ onCategorySelect, activeCategoryId }) => {
    const [categoryProducts, setCategoryProducts] = useState([]);

    useEffect(() => {
        categoryProductService.getAllCategoryProducts().then(setCategoryProducts);
    }, []);

    return (
        <div className="category-menu-wrapper mb-5">
            {/* Sử dụng flex-nowrap và overflow-auto để tạo thanh cuộn ngang trên mobile */}
            <ul
                className="nav nav-pills justify-content-md-center flex-nowrap overflow-auto pb-3"
                style={{
                    whiteSpace: 'nowrap',
                    WebkitOverflowScrolling: 'touch', // Hỗ trợ vuốt mượt trên iOS
                    scrollbarWidth: 'none' // Ẩn thanh cuộn trên Firefox (tùy chọn)
                }}
            >
                {/* Nút: Tất cả */}
                <li className="nav-item mr-3 mb-2">
                    <button
                        className={`nav-link rounded-pill px-4 py-2 font-weight-bold border ${activeCategoryId === null
                                ? 'active bg-dark border-dark text-white shadow-sm'
                                : 'bg-white text-secondary border-light'
                            }`}
                        onClick={() => onCategorySelect(null)}
                        style={{ transition: 'all 0.3s ease' }}
                    >
                        Tất cả
                    </button>
                </li>

                {/* Các nút: Danh mục sản phẩm */}
                {categoryProducts.map((item) => (
                    <li className="nav-item mr-3 mb-2" key={item.id}>
                        <button
                            onClick={() => onCategorySelect(item.id)}
                            className={`nav-link rounded-pill px-4 py-2 font-weight-bold border ${activeCategoryId === item.id
                                    ? 'active bg-dark border-dark text-white shadow-sm'
                                    : 'bg-white text-secondary border-light'
                                }`}
                            style={{ transition: 'all 0.3s ease' }}
                        >
                            {item.name}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Chèn thêm một đoạn CSS nhỏ để ẩn thanh cuộn xấu xí trên Chrome/Safari */}
            <style jsx="true">{`
                .category-menu-wrapper ul::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default CategoryMenu;