// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '10px' }}>
            <div className="product-image-container" style={{ height: '180px' }}>
                <img
                    src={product.imageUrl ? `https://localhost:7020${product.imageUrl}` : "https://placehold.co/300x300"}
                    className="card-img-top p-2"
                    alt={product.name}
                    style={{ height: '100%', objectFit: 'contain' }}
                />
            </div>
            <div className="card-body text-center p-3">
                <h6 className="card-title text-dark fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                    {product.name}
                </h6>
                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                    <span className="text-danger fw-bold">{product.price.toLocaleString('vi-VN')} đ</span>
                    {product.oldPrice && <small className="text-muted text-decoration-line-through">{product.oldPrice.toLocaleString('vi-VN')} đ</small>}
                </div>
                <Link to={`/product/${product.id}`} className="btn btn-outline-primary btn-sm w-100">
                    <i className="fa-solid fa-eye me-1"></i> Xem chi tiết
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;