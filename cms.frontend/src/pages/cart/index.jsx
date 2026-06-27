import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import CartTable from './CartTable'; // 👉 IMPORT FILE CON VÀO ĐÂY



const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Giả lập ID khách hàng đang đăng nhập (Thực tế bạn lấy từ AuthContext)
    const currentCustomerId = 1;

    // Đọc giỏ hàng từ LocalStorage khi mới vào trang
    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem('myCart')) || [];
        setCartItems(localCart);
    }, []);

    // Hàm cập nhật số lượng (truyền xuống cho CartTable dùng)
    // Hàm cập nhật số lượng (có bọc thép kiểm tra dữ liệu cũ)
    const updateQuantity = (productId, newQty, stockQuantity) => {
        if (newQty < 1) return;

        // 🚨 CHẶN 1: Nếu dữ liệu cũ không có thông tin tồn kho (undefined)
        if (stockQuantity === undefined) {
            alert("Dữ liệu giỏ hàng của bạn đã cũ. Vui lòng nhấn nút Xóa sản phẩm này và thêm lại từ Cửa hàng nhé!");
            return; // Dừng lại ngay, không cho tăng số lượng
        }

        // 🚨 CHẶN 2: Nếu bấm + vượt quá tồn kho thì báo lỗi
        if (newQty > stockQuantity) {
            alert(`Sản phẩm này chỉ còn tối đa ${stockQuantity} cái trong kho!`);
            return;
        }

        // Nếu qua được 2 ải trên thì mới cho phép tăng
        const updatedCart = cartItems.map(item =>
            item.productId === productId ? { ...item, quantity: newQty } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('myCart', JSON.stringify(updatedCart));

        // Phát tín hiệu cập nhật Header
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // Hàm xóa sản phẩm (truyền xuống cho CartTable dùng)
    const removeItem = (productId) => {
        const updatedCart = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('myCart', JSON.stringify(updatedCart));
    };

    // Tính tổng tiền
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Gọi API Đặt Hàng
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        setLoading(true);

        const checkoutPayload = {
            customerId: currentCustomerId,
            notes: notes,
            cartItems: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        };

        try {
            const response = await orderService.checkout(checkoutPayload);
            alert(response.message || "Đặt hàng thành công!");

            localStorage.removeItem('myCart');
            setCartItems([]);
            setNotes('');
            window.location.href = `/order-history`;

        } catch (error) {
            if (error.response && error.response.data) {
                alert("Thất bại: " + error.response.data.message);
            } else {
                alert("Đã xảy ra lỗi hệ thống khi đặt hàng. Vui lòng thử lại sau!");
            }
        } finally {
            setLoading(false);
        }
    };

    // Giao diện khi giỏ hàng trống
    if (cartItems.length === 0) {
        return (
            <div className="container my-5 text-center py-5">
                <h3 className="text-muted">Giỏ hàng của bạn đang trống trơn 🛒</h3>
                <a href="/shop" className="btn btn-primary mt-3 px-4">Tiếp tục mua sắm</a>
            </div>
        );
    }



    // Giao diện chính
    return (
        <div className="container my-5">
            <h2 className="mb-4 fw-bold text-dark">Giỏ Hàng Của Bạn</h2>
            <div className="row">

                {/* 👉 GỌI COMPONENT CON VÀ TRUYỀN DỮ LIỆU/HÀM XUỐNG BẰNG PROPS */}
                <div className="col-lg-8 mb-4">
                    <CartTable
                        cartItems={cartItems}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                    />
                </div>

                {/* Cột Tóm tắt & Thanh toán */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 p-4 bg-light">
                        <h4 className="fw-bold mb-4">Tóm tắt đơn hàng</h4>
                        <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                            <span>Tạm tính:</span>
                            <span className="fw-bold text-primary fs-5">{totalAmount.toLocaleString('vi-VN')} đ</span>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold text-secondary">Ghi chú giao hàng</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Ví dụ: Giao giờ hành chính..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            className="btn btn-success w-100 py-3 fw-bold"
                            onClick={() => {
                                // Lưu ghi chú vào LocalStorage để trang Checkout đọc lại
                                localStorage.setItem('checkoutNotes', notes);
                                window.location.href = '/checkout';
                            }}
                        >
                            ĐI ĐẾN THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;