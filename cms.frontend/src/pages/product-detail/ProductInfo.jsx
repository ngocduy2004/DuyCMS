// src/pages/product-detail/ProductInfo.jsx
import React from 'react';

const ProductInfo = ({ product }) => {
    return (
        <div className="row mt-4">
            <div className="col-md-6">
                <img
                    src={`https://localhost:7020${product.imageUrl}`}
                    alt={product.name}
                    className="img-fluid rounded"
                />
            </div>
            <div className="col-md-6">
                <h1 className="fw-bold">{product.name}</h1>
                <p className="h3 text-danger my-3">{product.price.toLocaleString('vi-VN')} đ</p>
                <div className="mb-4">
                    <h5>Mô tả sản phẩm:</h5>
                    <p className="text-muted">{product.description}</p>
                </div>
                <button className="btn btn-primary btn-lg">
                    <i className="fa-solid fa-cart-plus me-2"></i> Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;