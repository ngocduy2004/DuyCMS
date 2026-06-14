import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../services/productService';

const ProductDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [product, setProduct] = useState(null);

    useEffect(() => {
        productService.getDetail(id).then(data => setProduct(data));
    }, [id]);

    if (!product) return <div>Đang tải chi tiết sản phẩm...</div>;

    return (
        <div className="mt-4">
            <h1>{product.name}</h1>
            <img src={`https://localhost:7020${product.imageUrl}`} alt={product.name} className="img-fluid" />
            <p className="h3 text-danger">{product.price.toLocaleString('vi-VN')} đ</p>
            <p>{product.description}</p>
        </div>
    );
};

export default ProductDetail;