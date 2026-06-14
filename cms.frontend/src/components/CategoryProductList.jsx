import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = ({ onCategorySelect, activeCategoryId }) => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, []);

    if (loading) return <div className="text-center my-4">Đang tải danh mục...</div>;

    return (
        <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase font-weight-bold text-dark mb-0">
                    <i className="fa-solid fa-cubes text-primary mr-2"></i> Danh mục SP
                </h5>
            </div>
            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {categoryProducts.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onCategorySelect(item.id)}
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 ${activeCategoryId === item.id ? 'active' : ''}`}
                            style={{ fontSize: '0.95rem' }}
                        >
                            <span>{item.name}</span>
                            <span className="badge badge-primary badge-pill">{item.totalProducts}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;