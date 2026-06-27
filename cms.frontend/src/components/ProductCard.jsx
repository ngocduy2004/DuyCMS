// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from '../assets/css/ProductCard.module.css';

const ProductCard = ({ product }) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate(); // 2. Khởi tạo hook điều hướng

    const discountPercent = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : null;

    const handleBuyNow = (e) => {
        e.preventDefault();

        // 1. Lấy dữ liệu giỏ hàng hiện tại
        const cart = JSON.parse(localStorage.getItem('myCart')) || [];
        const currentId = product.id || product.Id;
        const existingItem = cart.find(item => (item.productId || item.id) === currentId);

        // 2. Xác định tồn kho (Dự phòng trường hợp backend trả về các tên khác nhau)
        const stockOfProduct = product.stockQuantity ?? product.stock ?? 999;

        if (existingItem) {
            // Nếu đã có trong giỏ, chỉ tăng số lượng nếu chưa vượt quá tồn kho
            if (existingItem.quantity < stockOfProduct) {
                existingItem.quantity += 1;
            } else {
                alert(`Sản phẩm này chỉ còn tối đa ${stockOfProduct} cái trong kho!`);
            }
        } else {
            // 🔥 ĐÂY LÀ CHỖ CẦN SỬA: Thêm 'stockQuantity' vào đây
            cart.push({
                productId: currentId,
                productName: product.name || product.Name,
                price: product.price || product.Price,
                imageUrl: product.imageUrl || product.ImageUrl,
                quantity: 1,
                stockQuantity: stockOfProduct // Cực kỳ quan trọng để hàm updateQuantity ở trang Cart không báo lỗi
            });
        }

        // 3. Lưu lại
        localStorage.setItem('myCart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));

        // 4. Chuyển trang
        navigate('/cart');
    };
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
                        <Link to={`/product/${product.id}`} className={styles.iconBtn} title="Xem chi tiết">🔍</Link>

                        {/* Nút Mua ngay nằm trong overlay */}
                        <button onClick={handleBuyNow} className={styles.iconBtn} title="Mua ngay">
                            ⚡
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