// src/pages/cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import CartTable from './CartTable';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [notes, setNotes] = useState('');

    // 🚨 STATE MỚI: Quản lý thông báo lỗi (Toast)
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem('myCart')) || [];
        setCartItems(localCart);
    }, []);

    // 🚨 HÀM MỚI: Hiển thị thông báo nổi tự động tắt sau 3 giây
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3500); // Tự động tắt sau 3.5 giây
    };

    const updateQuantity = (productId, newQty, stockQuantity) => {
        if (newQty < 1) return;

        if (stockQuantity === undefined) {
            showToast("Dữ liệu giỏ hàng đã cũ. Vui lòng xóa sản phẩm này và thêm lại nhé!");
            return;
        }

        if (newQty > stockQuantity) {
            // Thay thế alert() thô cứng bằng hàm showToast() xịn xò
            showToast(`Sản phẩm này chỉ còn tối đa ${stockQuantity} cái trong kho!`);
            return;
        }

        const updatedCart = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: newQty } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('myCart', JSON.stringify(updatedCart));

        window.dispatchEvent(new Event('cartUpdated'));
    };

    const removeItem = (productId) => {
        const updatedCart = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('myCart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // --- GIAO DIỆN KHI GIỎ HÀNG TRỐNG ---
    if (cartItems.length === 0) {
        return (
            <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <i className="fa-solid fa-cart-arrow-down text-muted opacity-25 mb-4" style={{ fontSize: '6rem' }}></i>
                    <h3 className="fw-bolder text-dark mb-3">Giỏ hàng của bạn đang trống</h3>
                    <p className="text-muted mb-4 fs-5">Hãy quay lại cửa hàng để chọn cho mình những mẫu kính ưng ý nhé!</p>
                    <a href="/shop" className="btn btn-dark btn-lg rounded-pill px-5 py-3 fw-bold shadow-sm">
                        TIẾP TỤC MUA SẮM
                    </a>
                </div>
            </div>
        );
    }

    // --- GIAO DIỆN CHÍNH KHI CÓ HÀNG ---
    return (
        <div className="container py-5 position-relative">

            {/* 🚨 GIAO DIỆN THÔNG BÁO NỔI (TOAST) GÓC TRÊN BÊN PHẢI */}
            {toastMessage && (
                <div
                    className="position-fixed top-0 end-0 p-3"
                    style={{ zIndex: 1050, transition: 'all 0.3s ease-in-out' }}
                >
                    <div className="alert bg-white shadow-lg border-start border-warning border-4 d-flex align-items-center rounded-3 p-3" role="alert" style={{ minWidth: '300px' }}>
                        <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                            <i className="fa-solid fa-triangle-exclamation fs-5"></i>
                        </div>
                        <div>
                            <h6 className="fw-bold mb-1 text-dark">Lưu ý số lượng</h6>
                            <p className="mb-0 text-muted small">{toastMessage}</p>
                        </div>
                        <button
                            type="button"
                            className="btn-close ms-auto"
                            onClick={() => setToastMessage(null)}
                        ></button>
                    </div>
                </div>
            )}

            {/* Tiêu đề trang */}
            <div className="mb-5 border-bottom pb-3">
                <h2 className="fw-bolder text-dark mb-0">
                    Giỏ hàng <span className="text-muted fw-normal fs-4">({cartItems.length} sản phẩm)</span>
                </h2>
            </div>

            <div className="row g-5">
                {/* CỘT TRÁI: BẢNG SẢN PHẨM */}
                <div className="col-lg-8">
                    <CartTable
                        cartItems={cartItems}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                    />
                </div>

                {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (STICKY) */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 position-sticky" style={{ top: '30px' }}>
                        <div className="card-body p-4 p-md-5 bg-light rounded-4">
                            <h4 className="fw-bolder text-dark mb-4">Tóm tắt đơn hàng</h4>

                            <div className="d-flex justify-content-between mb-3 text-secondary" style={{ fontSize: '1.05rem' }}>
                                <span>Tạm tính</span>
                                <span className="fw-bold text-dark">{totalAmount.toLocaleString('vi-VN')} ₫</span>
                            </div>

                            {/* Ghi chú giao hàng */}
                            <div className="mb-4 mt-4">
                                <label className="form-label fw-bold text-secondary" style={{ fontSize: '0.9rem' }}>
                                    <i className="fa-regular fa-clipboard me-2"></i>Ghi chú giao hàng
                                </label>
                                <textarea
                                    className="form-control border-0 shadow-sm rounded-3"
                                    rows="3"
                                    placeholder="Ví dụ: Giao giờ hành chính..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    style={{ resize: 'none' }}
                                ></textarea>
                            </div>

                            <hr className="text-muted opacity-25 my-4" />

                            {/* Tổng cộng */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fw-bold text-dark fs-5">Tổng cộng</span>
                                <span className="fw-bolder text-info fs-3">
                                    {totalAmount.toLocaleString('vi-VN')} ₫
                                </span>
                            </div>

                            {/* Nút thanh toán */}
                            <button
                                className="btn btn-dark btn-lg w-100 py-3 fw-bold rounded-pill shadow d-flex justify-content-center align-items-center"
                                style={{ transition: 'all 0.3s' }}
                                onClick={() => {
                                    localStorage.setItem('checkoutNotes', notes);
                                    window.location.href = '/checkout';
                                }}
                            >
                                THANH TOÁN NGAY <i className="fa-solid fa-arrow-right ms-2"></i>
                            </button>

                            {/* Trust badges (Thêm uy tín) */}
                            <div className="text-center mt-4 text-muted" style={{ fontSize: '0.85rem' }}>
                                <i className="fa-solid fa-shield-halved me-1"></i> Thanh toán bảo mật và an toàn 100%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;