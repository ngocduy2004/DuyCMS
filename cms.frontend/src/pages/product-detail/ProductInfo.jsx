// src/pages/product-detail/ProductInfo.jsx
import React, { useState } from 'react';

const ProductInfo = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        // 🚨 CHẶN NGAY TẠI ĐÂY: Nếu số lượng định chọn < tồn kho thì mới cho tăng
        if (quantity < product.stockQuantity) {
            setQuantity(quantity + 1);
        } else {
            alert(`Sản phẩm này chỉ còn tối đa ${product.stockQuantity} cái trong kho!`);
        }
    };

    return (
        <div className="row mt-4 bg-white p-4 rounded shadow-sm">
            {/* ... (Phần hiển thị hình ảnh giữ nguyên) ... */}
            <div className="col-md-5 text-center">
                <img src={`https://localhost:7020${product.imageUrl}`} alt={product.name} className="img-fluid rounded border" style={{ maxHeight: '400px', objectFit: 'contain' }} />
            </div>

            <div className="col-md-7 ps-md-5">
                <h1 className="fw-bold">{product.name}</h1>
                <p className="display-6 text-danger my-3 fw-bold">
                    {product.price.toLocaleString('vi-VN')} đ
                </p>

                <div className="mb-4">
                    <h5 className="fw-bold">Mô tả sản phẩm:</h5>
                    <p className="text-muted lh-lg">{product.description}</p>

                    {/* 🚨 BỔ SUNG: Hiển thị số lượng tồn kho cho khách thấy */}
                    <p className="text-primary fw-bold">
                        <i className="fa-solid fa-box-open me-2"></i>
                        Còn lại: {product.stockQuantity} sản phẩm
                    </p>
                </div>

                {/* KHU VỰC CHỌN SỐ LƯỢNG */}
                <div className="d-flex align-items-center mb-4">
                    <span className="me-3 fw-bold">Số lượng:</span>
                    <div className="input-group" style={{ width: '130px' }}>
                        <button className="btn btn-outline-secondary" type="button" onClick={handleDecrease}>-</button>
                        <input type="text" className="form-control text-center bg-white fw-bold" value={quantity} readOnly />
                        <button className="btn btn-outline-secondary" type="button" onClick={handleIncrease}>+</button>
                    </div>
                </div>

                {/* NÚT THÊM VÀO GIỎ HÀNG */}
                {/* 🚨 Nâng cấp: Nút bị mờ (disabled) nếu kho = 0 */}
                <button
                    className="btn btn-primary btn-lg px-5 py-3 shadow"
                    onClick={() => onAddToCart(product, quantity)}
                    disabled={product.stockQuantity === 0}
                >
                    <i className="fa-solid fa-cart-plus me-2"></i>
                    {product.stockQuantity === 0 ? "TẠM HẾT HÀNG" : "THÊM VÀO GIỎ HÀNG"}
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;