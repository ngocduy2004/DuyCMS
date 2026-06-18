// src/pages/product-detail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService'; // Đảm bảo đường dẫn đúng
import ProductInfo from './ProductInfo';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await productService.getDetail(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center py-5">Đang tải chi tiết sản phẩm...</div>;
    if (!product) return <div className="text-center py-5">Không tìm thấy sản phẩm.</div>;

    return (
        <div className="container py-4">
            <ProductInfo product={product} />
        </div>
    );
};

export default ProductDetail;