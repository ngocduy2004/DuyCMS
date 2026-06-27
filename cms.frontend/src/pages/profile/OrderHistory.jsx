import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await orderService.getMyOrders();
                // response trả về từ backend đã qua xử lý .Select()
                setOrders(response || []);
            } catch (error) {
                console.error("Lỗi khi tải lịch sử đơn hàng:", error);
                alert("Lỗi tải đơn hàng. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 0:
                return <span className="badge bg-warning text-dark">Chờ xác nhận</span>;
            case 1:
                return <span className="badge bg-primary">Đang xử lý</span>;
            case 2:
                return <span className="badge bg-success">Đã giao</span>;
            case 3:
                return <span className="badge bg-danger">Đã hủy</span>;
            default:
                return <span className="badge bg-secondary">Không xác định</span>;
        }
    };

    if (loading) return <div className="container py-5 text-center">Đang tải đơn hàng...</div>;

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Lịch sử đơn hàng</h2>

            {orders.length === 0 ? (
                <div className="alert alert-info">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</div>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div key={order.id} className="col-12 mb-4">
                            <div className="card shadow-sm border-0 p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold m-0 text-primary">Đơn hàng #{order.id}</h5>
                                    {getStatusBadge(order.status)}
                                </div>
                                <p className="text-muted small">Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                                <p className="text-muted small">Ghi chú: {order.notes || "Không có"}</p>

                                <hr />

                                {/* Danh sách sản phẩm trong đơn */}
                                <div className="mb-3">
                                    {order.orderDetails?.map((item, index) => (
                                        <div key={index} className="d-flex align-items-center mb-3 border-bottom pb-2">
                                            {/* Hiển thị ảnh sản phẩm */}
                                            <img
                                                src={
                                                    item.imageUrl
                                                        ? `https://localhost:7020${item.imageUrl}`
                                                        : '/default-product.jpg'
                                                }
                                                alt={item.productName || "Sản phẩm"}
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                                className="border me-3"
                                                onError={(e) => {
                                                    e.target.src = '/default-product.jpg';
                                                }}
                                            />

                                            <div className="flex-grow-1">
                                                <div className="fw-medium">{item.productName || "Sản phẩm"}</div>
                                                <small className="text-muted">Số lượng: {item.quantity}</small>
                                            </div>

                                            <div className="fw-bold">
                                                {(item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Tổng tiền */}
                                <div className="text-end pt-2">
                                    <h5 className="text-dark fw-bold m-0">
                                        Tổng tiền: {order.orderDetails?.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toLocaleString('vi-VN')} đ
                                    </h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;