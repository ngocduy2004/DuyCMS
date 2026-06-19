// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/css/ProductCard.module.css';

const ProductCard = ({ product }) => {
    const [hovered, setHovered] = useState(false);

    const discountPercent = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : null;

    return (
        <div
            className={styles.card}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Sale Badge - top left */}
            {discountPercent && (
                <div className={styles.saleBadgeTop}>
                    Sale {discountPercent}%
                </div>
            )}

            {/* Brand Logo - top right */}
            <div className={styles.brandLogoTop}>
                <span className={styles.dot}>●</span>SOLIS<span className={styles.sup}>Z</span>
            </div>

            {/* Image Container */}
            <div className={styles.imageContainer}>
                <img
                    src={product.imageUrl ? `https://localhost:7020${product.imageUrl}` : "https://placehold.co/300x180"}
                    alt={product.name}
                    className={`${styles.productImage} ${hovered ? styles.productImageHover : ''}`}
                />

                {/* Hover overlay icons */}
                {hovered && (
                    <div className={styles.hoverOverlay}>
                        {/* Zoom icon */}
                        <Link
                            to={`/product/${product.id}`}
                            className={styles.iconBtn}
                            title="Xem chi tiết"
                        >
                            🔍
                        </Link>

                        {/* Cart icon */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (product.onAddToCart) product.onAddToCart(product);
                            }}
                            className={styles.iconBtn}
                            title="Thêm vào giỏ"
                        >
                            🛒
                        </button>
                    </div>
                )}
            </div>

            {/* Product code - right aligned, small gray */}
            <div className={styles.sku}>
                {product.sku || product.code || ''}
            </div>

            {/* Card Body */}
            <div className={styles.cardBody}>
                {/* Product Name */}
                <div className={styles.productName}>
                    {product.name}
                </div>

                {/* Price Row */}
                <div className={styles.priceRow}>
                    <span className={styles.currentPrice}>
                        {product.price.toLocaleString('vi-VN')}₫
                    </span>
                    {product.oldPrice && (
                        <span className={styles.oldPrice}>
                            {product.oldPrice.toLocaleString('vi-VN')}₫
                        </span>
                    )}
                </div>

                {/* Sale badge bottom */}
                {discountPercent && (
                    <div className={styles.saleBadgeBottom}>
                        Sale {discountPercent}%
                    </div>
                )}
            </div>

            {/* Bottom brand logo */}
            <div className={styles.footer}>
                <span className={styles.dot}>●</span>SOLIS<span className={styles.sup}>Z</span>
            </div>
        </div>
    );
};

export default ProductCard;