// src/pages/cart/CartTable.jsx
import React from 'react';

const CartTable = ({ cartItems, updateQuantity, removeItem }) => {
    return (
        <div className="card shadow-sm border-0 p-3">
            <table className="table align-middle">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th style={{ width: '130px' }}>Số lượng</th>
                        <th>Tổng</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.productId}>
                            <td>
                                <div className="d-flex align-items-center">
                                    {item.imageUrl && (
                                        <img src={`https://localhost:7020${item.imageUrl}`} alt={item.productName} className="rounded me-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                    )}
                                    <span className="fw-bold text-secondary">{item.productName}</span>
                                </div>
                            </td>
                            <td>{item.price.toLocaleString('vi-VN')} đ</td>
                            <td>
                                <div className="input-group input-group-sm">
                                    {/* 🚨 Nút Giảm: Truyền thêm item.stockQuantity */}
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.stockQuantity)}
                                    >-</button>

                                    <input type="text" className="form-control text-center bg-white" value={item.quantity} readOnly />

                                    {/* 🚨 Nút Tăng: Truyền thêm item.stockQuantity */}
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.stockQuantity)}
                                    >+</button>
                                </div>
                            </td>
                            <td className="fw-bold">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</td>
                            <td>
                                <button className="btn btn-sm btn-outline-danger border-0" onClick={() => removeItem(item.productId)}>
                                    <i className="fa-solid fa-trash"></i> Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CartTable;