// src/pages/home/CategoryMenu.jsx
import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

const CategoryMenu = ({ onCategorySelect, activeCategoryId }) => {
    const [categoryProducts, setCategoryProducts] = useState([]);

    useEffect(() => {
        categoryProductService.getAllCategoryProducts().then(setCategoryProducts);
    }, []);

    return (
        <ul className="nav nav-pills mb-4 justify-content-center bg-light p-2 rounded shadow-sm">
            <li className="nav-item">
                <button
                    className={`nav-link px-4 ${activeCategoryId === null ? 'active bg-primary' : 'text-dark'}`}
                    onClick={() => onCategorySelect(null)}
                >
                    Tất cả
                </button>
            </li>

            {categoryProducts.map((item) => (
                <li className="nav-item" key={item.id}>
                    <button
                        onClick={() => onCategorySelect(item.id)}
                        className={`nav-link px-4 ${activeCategoryId === item.id ? 'active bg-primary' : 'text-dark'}`}
                    >
                        {item.name}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default CategoryMenu;