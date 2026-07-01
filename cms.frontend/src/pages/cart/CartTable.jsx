// src/pages/cart/CartTable.jsx
import React from 'react';

const CartTable = ({ cartItems, updateQuantity, removeItem }) => {
    return (
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="table-responsive">
                <table className="table align-middle mb-0">
                    <thead className="bg-light">
                        <tr className="text-uppercase text-secondary" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                            <th className="py-3 ps-4 border-0">Sản phẩm</th>
                            <th className="py-3 border-0">Đơn giá</th>
                            <th className="py-3 border-0 text-center" style={{ width: '160px' }}>Số lượng</th>
                            <th className="py-3 border-0 text-end">Thành tiền</th>
                            <th className="py-3 pe-4 border-0 text-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.productId} className="border-bottom">
                                {/* 1. CỘT SẢN PHẨM */}
                                <td className="py-3 ps-4">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-light rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                            {item.imageUrl ? (
                                                <img
                                                    src={`https://localhost:7020${item.imageUrl}`}
                                                    alt={item.productName}
                                                    className="img-fluid"
                                                    style={{ maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                                                />
                                            ) : (
                                                <i className="fa-solid fa-image text-muted opacity-50 fs-3"></i>
                                            )}
                                        </div>
                                        <div>
                                            <h6 className="fw-bold text-dark mb-1">{item.productName}</h6>
                                            <small className="text-muted">Mã SP: #{item.productId}</small>
                                        </div>
                                    </div>
                                </td>

                                {/* 2. CỘT GIÁ ĐƠN */}
                                <td className="py-3 text-muted fw-medium">
                                    {item.price.toLocaleString('vi-VN')} ₫
                                </td>

                                {/* 3. CỘT SỐ LƯỢNG */}
                                <td className="py-3 text-center">
                                    <div
                                        className="d-inline-flex align-items-center border rounded-pill px-2 py-1 bg-white shadow-sm"
                                    >
                                        <button
                                            className="btn btn-sm btn-light rounded-circle fw-bold text-secondary d-flex justify-content-center align-items-center"
                                            type="button"
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.stockQuantity)}
                                            disabled={item.quantity <= 1} // Vẫn giữ khóa nút trừ nếu = 1
                                            style={{ width: '32px', height: '32px' }}
                                        >
                                            <i className="fa-solid fa-minus" style={{ fontSize: '12px' }}></i>
                                        </button>

                                        <input
                                            type="text"
                                            className="form-control border-0 text-center bg-transparent fw-bold px-0"
                                            value={item.quantity}
                                            readOnly
                                            style={{ width: '40px', outline: 'none', boxShadow: 'none' }}
                                        />

                                        {/* 🚨 NÚT CỘNG: Đã xóa thuộc tính disabled để cho phép khách hàng bấm và hiện Toast */}
                                        <button
                                            className="btn btn-sm btn-light rounded-circle fw-bold text-secondary d-flex justify-content-center align-items-center"
                                            type="button"
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.stockQuantity)}
                                            style={{ width: '32px', height: '32px' }}
                                        >
                                            <i className="fa-solid fa-plus" style={{ fontSize: '12px' }}></i>
                                        </button>
                                    </div>
                                </td>

                                {/* 4. CỘT THÀNH TIỀN TỔNG */}
                                <td className="py-3 text-end fw-bold text-info fs-5">
                                    {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                                </td>

                                {/* 5. CỘT XÓA */}
                                <td className="py-3 pe-4 text-center">
                                    <button
                                        className="btn btn-light text-danger rounded-circle shadow-sm"
                                        onClick={() => removeItem(item.productId)}
                                        title="Xóa sản phẩm"
                                        style={{ width: '40px', height: '40px', transition: 'all 0.3s ease' }}
                                        onMouseEnter={(e) => { e.currentTarget.classList.replace('btn-light', 'btn-danger'); e.currentTarget.classList.replace('text-danger', 'text-white'); }}
                                        onMouseLeave={(e) => { e.currentTarget.classList.replace('btn-danger', 'btn-light'); e.currentTarget.classList.replace('text-white', 'text-danger'); }}
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CartTable;