// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from '../assets/css/ProductCard.module.css';

const ProductCard = ({ product }) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    // 1. Kiểm tra trạng thái tồn kho
    const stockOfProduct = product.stockQuantity ?? product.stock ?? 999;
    const isOutOfStock = stockOfProduct <= 0; // True nếu hết hàng

    // 2. Tính % giảm giá
    const discountPercent = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : null;

    // 3. Hàm xử lý Mua Ngay
    const handleBuyNow = (e) => {
        e.preventDefault();

        // 🚨 CHẶN NGAY: Nếu hết hàng thì không làm gì cả
        if (isOutOfStock) return;

        const cart = JSON.parse(localStorage.getItem('myCart')) || [];
        const currentId = product.id || product.Id;
        const existingItem = cart.find(item => (item.productId || item.id) === currentId);

        if (existingItem) {
            if (existingItem.quantity < stockOfProduct) {
                existingItem.quantity += 1;
            } else {
                alert(`Sản phẩm này chỉ còn tối đa ${stockOfProduct} cái trong kho!`);
                return;
            }
        } else {
            cart.push({
                productId: currentId,
                productName: product.name || product.Name,
                price: product.price || product.Price,
                imageUrl: product.imageUrl || product.ImageUrl,
                quantity: 1,
                stockQuantity: stockOfProduct
            });
        }

        localStorage.setItem('myCart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));

        navigate('/cart');
    };

    return (
        <div
            // 👉 Thêm style opacity để làm mờ thẻ nếu hết hàng
            className={styles.card}
            style={{ opacity: isOutOfStock ? 0.65 : 1, transition: 'all 0.3s' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* --- TEM NHÃN (BADGE) --- */}
            {isOutOfStock ? (
                // Nếu hết hàng -> Hiện Tem Hết Hàng (Đỏ)
                <div className={styles.saleBadgeTop} style={{ backgroundColor: '#dc3545', letterSpacing: '1px' }}>
                    TẠM HẾT HÀNG
                </div>
            ) : discountPercent ? (
                // Nếu còn hàng & có giảm giá -> Hiện Tem Sale
                <div className={styles.saleBadgeTop}>
                    Sale {discountPercent}%
                </div>
            ) : null}

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
                    // 👉 Ảnh có thể được chuyển sang trắng đen (grayscale) nếu hết hàng
                    style={{ filter: isOutOfStock ? 'grayscale(80%)' : 'none' }}
                />

                {/* Hover overlay icons */}
                {hovered && (
                    <div className={styles.hoverOverlay}>
                        <Link to={`/product/${product.id}`} className={styles.iconBtn} title="Xem chi tiết">🔍</Link>

                        {/* 👉 ẨN NÚT MUA NGAY NẾU HẾT HÀNG */}
                        {!isOutOfStock && (
                            <button onClick={handleBuyNow} className={styles.iconBtn} title="Mua ngay">
                                ⚡
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Product code */}
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
                    <span className={styles.currentPrice} style={{ color: isOutOfStock ? '#6c757d' : '' }}>
                        {product.price.toLocaleString('vi-VN')}₫
                    </span>
                    {product.oldPrice && !isOutOfStock && (
                        <span className={styles.oldPrice}>
                            {product.oldPrice.toLocaleString('vi-VN')}₫
                        </span>
                    )}
                </div>

                {/* Dòng hiển thị nhỏ dưới cùng thay thế cho Sale Badge */}
                {isOutOfStock ? (
                    <div className="text-danger fw-bold mt-2" style={{ fontSize: '0.85rem' }}>
                        <i className="fa-solid fa-phone me-1"></i> Liên hệ đặt trước
                    </div>
                ) : discountPercent ? (
                    <div className={styles.saleBadgeBottom}>
                        Sale {discountPercent}%
                    </div>
                ) : null}
            </div>

            {/* Bottom brand logo */}
            <div className={styles.footer}>
                <span className={styles.dot}>●</span>SOLIS<span className={styles.sup}>Z</span>
            </div>
        </div>
    );
};

export default ProductCard;