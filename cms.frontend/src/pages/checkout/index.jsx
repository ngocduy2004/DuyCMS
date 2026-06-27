import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import orderService from '../../services/orderService';
import customerService from '../../services/customerService';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentCustomerId, setCurrentCustomerId] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '', phone: '', address: '', notes: ''
    });
    const location = useLocation();

    useEffect(() => {
        // 1. Chỉ lấy từ Giỏ Hàng chung (localStorage)
        const localCart = JSON.parse(localStorage.getItem('myCart')) || [];
        setCartItems(localCart);

        // Nếu giỏ hàng trống thì đẩy về cửa hàng
        if (localCart.length === 0) {
            navigate('/shop');
            return;
        }

        // 2. Gọi C# kiểm tra đăng nhập & lấy thông tin điền sẵn vào Form
        const fetchProfile = async () => {
            try {
                const user = await customerService.getProfile();
                setCurrentCustomerId(user.id || user.Id);
                setFormData({
                    fullName: user.fullName || user.FullName || '',
                    phone: user.phone || user.Phone || '',
                    address: user.address || user.Address || '',
                    notes: ''
                });
            } catch (err) {
                // 🚨 C# báo lỗi Unauthorized -> Đẩy văng ra trang Login
                alert("Bạn cần đăng nhập để tiến hành thanh toán!");
              
                navigate('/login', { state: { from: location.pathname + location.search } });
            }
        };
        fetchProfile();
    }, [navigate]);

    const totalAmount = cartItems.reduce((sum, item) => sum + ((item.price || item.unitPrice) * item.quantity), 0);

    const handleConfirmOrder = async () => {
        if (!formData.address || !formData.phone || !formData.fullName) {
            alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
            return;
        }

        if (!currentCustomerId) {
            alert("Lỗi: Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại!");
            return;
        }

        setLoading(true);
        const checkoutPayload = {
            customerId: currentCustomerId,
            notes: `Ghi chú: ${formData.notes} | Người nhận: ${formData.fullName} | SĐT: ${formData.phone}`,
            cartItems: cartItems.map(item => ({
                productId: item.productId || item.id,
                quantity: item.quantity,
                unitPrice: item.price || item.unitPrice
            }))
        };

        try {
            await orderService.checkout(checkoutPayload);
            alert("Đặt hàng thành công! Vui lòng kiểm tra Email để xem chi tiết đơn hàng.");

            // Đặt xong thì xóa giỏ hàng
            localStorage.removeItem('myCart');
            window.dispatchEvent(new Event('cartUpdated'));

            navigate('/order-history');
        } catch (error) {
            console.error("Lỗi API Checkout:", error);
            alert(error.response?.data?.message || "Lỗi đặt hàng!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4 fw-bold">Thông tin thanh toán</h2>
            <div className="row">
                {/* Form thông tin */}
                <div className="col-md-7">
                    <div className="card p-4 shadow-sm border-0">
                        <div className="mb-3">
                            <label className="fw-bold">Họ tên:</label>
                            <input className="form-control" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="fw-bold">Số điện thoại:</label>
                            <input className="form-control" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="fw-bold">Địa chỉ nhận hàng:</label>
                            <textarea className="form-control" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="fw-bold">Ghi chú đơn hàng:</label>
                            <textarea className="form-control" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Giao giờ hành chính..." />
                        </div>
                    </div>
                </div>

                {/* Danh sách đơn */}
                <div className="col-md-5 mt-4 mt-md-0">
                    <div className="card p-4 bg-light shadow-sm border-0">
                        <h4 className="fw-bold mb-3">Đơn hàng của bạn</h4>
                        <div className="d-flex flex-column gap-3 mb-3">
                            {cartItems.map((item, index) => (
                                <div key={index} className="d-flex align-items-center border-bottom pb-2">
                                    <img
                                        src={item.imageUrl ? `https://localhost:7020${item.imageUrl}` : "https://placehold.co/60x60"}
                                        alt={item.productName || item.name}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        className="rounded shadow-sm me-3"
                                    />
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-dark">{item.productName || item.name}</div>
                                        <div className="text-muted small">
                                            {item.quantity} x {(item.price || item.unitPrice)?.toLocaleString('vi-VN')} đ
                                        </div>
                                    </div>
                                    <div className="fw-bold text-dark">
                                        {((item.price || item.unitPrice) * item.quantity).toLocaleString('vi-VN')} đ
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                            <span className="fs-5">Tổng cộng:</span>
                            <span className="fs-5 fw-bold text-primary">{totalAmount.toLocaleString('vi-VN')} đ</span>
                        </div>

                        <button className="btn btn-success w-100 mt-4 py-2 fw-bold" onClick={handleConfirmOrder} disabled={loading || cartItems.length === 0}>
                            {loading ? "Đang xử lý..." : "XÁC NHẬN THANH TOÁN"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;