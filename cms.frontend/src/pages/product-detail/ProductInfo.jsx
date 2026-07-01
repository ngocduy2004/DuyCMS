// src/pages/product-detail/ProductInfo.jsx
import React, { useState } from 'react';

// 🚨 Nhận thêm prop 'showToast' từ component cha truyền xuống
const ProductInfo = ({ product, onAddToCart, showToast }) => {
    const [quantity, setQuantity] = useState(1);

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        // Nếu số lượng định chọn < tồn kho thì cho tăng
        if (quantity < product.stockQuantity) {
            setQuantity(quantity + 1);
        } else {
            // 🚨 Nếu vượt tồn kho thì gọi Toast xịn xò (nếu không có thì dùng tạm alert)
            if (showToast) {
                showToast("Số lượng sản phẩm trong kho không đủ!", "warning");
            } else {
                alert("Số lượng sản phẩm trong kho không đủ!");
            }
        }
    };

    // Biến phụ trợ kiểm tra hết hàng
    const isOutOfStock = product.stockQuantity === 0;

    return (
        <div className="row mt-4 bg-white p-4 p-md-5 rounded-4 shadow-sm border-0">

            {/* CỘT HÌNH ẢNH */}
            <div className="col-md-5 d-flex align-items-center justify-content-center mb-4 mb-md-0">
                <div className="bg-light rounded-4 p-4 w-100 text-center position-relative">
                    <img
                        src={`https://localhost:7020${product.imageUrl}`}
                        alt={product.name}
                        className="img-fluid"
                        style={{ maxHeight: '450px', objectFit: 'contain', mixBlendMode: 'multiply' }}
                    />
                </div>
            </div>

            {/* CỘT THÔNG TIN SẢN PHẨM */}
            <div className="col-md-7 ps-md-5 d-flex flex-column justify-content-center">

                {/* Trạng thái kho hàng */}
                <div className="mb-3">
                    {isOutOfStock ? (
                        <span className="badge bg-danger px-3 py-2 rounded-pill fw-medium fs-6 shadow-sm">
                            <i className="fa-solid fa-circle-xmark me-1"></i> Tạm hết hàng
                        </span>
                    ) : (
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-medium border border-success border-opacity-25">
                            <i className="fa-solid fa-check-circle me-1"></i> Còn {product.stockQuantity} sản phẩm trong kho
                        </span>
                    )}
                </div>

                {/* Tên & Giá */}
                <h1 className="fw-bolder text-dark mb-3" style={{ fontSize: '2.4rem', lineHeight: '1.3' }}>
                    {product.name}
                </h1>
                <p className="display-6 fw-bold text-info mb-4">
                    {product.price.toLocaleString('vi-VN')} ₫
                </p>

                <hr className="text-muted opacity-25 mb-4" />

                {/* Mô tả sản phẩm */}
                <div className="mb-5">
                    <h6 className="fw-bold text-uppercase text-secondary mb-3" style={{ letterSpacing: '1px', fontSize: '0.9rem' }}>
                        Thông tin sản phẩm
                    </h6>
                    <p className="text-muted lh-lg" style={{ fontSize: '1.05rem', textAlign: 'justify' }}>
                        {product.description}
                    </p>
                </div>

                {/* KHU VỰC HÀNH ĐỘNG (CHỌN SỐ LƯỢNG & MUA HÀNG) */}
                <div className="d-flex flex-wrap align-items-center gap-3 mt-auto">

                    {/* Bộ chọn số lượng kiểu dáng mới (Pill UI) */}
                    <div className="d-flex align-items-center border rounded-pill px-2 py-1 bg-white shadow-sm">
                        <button
                            className="btn btn-sm btn-light rounded-circle fw-bold text-secondary d-flex justify-content-center align-items-center"
                            type="button"
                            onClick={handleDecrease}
                            disabled={isOutOfStock || quantity <= 1} // Vẫn giữ khóa nút trừ nếu = 1
                            style={{ width: '38px', height: '38px', transition: '0.2s' }}
                        >
                            <i className="fa-solid fa-minus"></i>
                        </button>

                        <input
                            type="text"
                            className="form-control border-0 text-center bg-transparent fw-bold fs-5 px-0"
                            value={quantity}
                            readOnly
                            style={{ width: '50px', outline: 'none', boxShadow: 'none' }}
                        />

                        {/* 🚨 ĐÃ SỬA: Bỏ thuộc tính 'disabled' ở nút Cộng */}
                        <button
                            className="btn btn-sm btn-light rounded-circle fw-bold text-secondary d-flex justify-content-center align-items-center"
                            type="button"
                            onClick={handleIncrease}
                            style={{ width: '38px', height: '38px', transition: '0.2s' }}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>

                    {/* Nút Thêm Vào Giỏ Hàng */}
                    <button
                        className={`btn btn-lg rounded-pill px-4 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center ${isOutOfStock ? 'btn-secondary' : 'btn-dark'}`}
                        onClick={() => onAddToCart(product, quantity)}
                        disabled={isOutOfStock}
                        style={{ flex: '1', minWidth: '220px', transition: 'all 0.3s ease' }}
                    >
                        <i className={`fa-solid ${isOutOfStock ? 'fa-ban' : 'fa-bag-shopping'} me-2 fs-5`}></i>
                        {isOutOfStock ? "TẠM HẾT HÀNG" : "THÊM VÀO TÚI"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ProductInfo;