// src/pages/home/ProductGrid.jsx
import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';

const ProductGrid = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = categoryId
                    ? await productService.getByCategory(categoryId)
                    : await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    if (loading) return <div className="text-center my-4">Đang tải sản phẩm...</div>;

    return (
        <div className="row g-3">
            {products.length === 0 ? (
                <div className="col-12 text-center text-muted">Không có sản phẩm nào.</div>
            ) : (
                products.map((item) => (
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id}>
                        {/* Gọi component ProductCard đã tách ra */}
                        <ProductCard product={item} />
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductGrid;