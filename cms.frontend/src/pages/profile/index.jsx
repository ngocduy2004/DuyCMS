import React, { useState } from 'react';
import ProfileInfo from './ProfileInfo';
import OrderHistory from './OrderHistory'; // 1. Bỏ comment import

const ProfileIndex = () => {
    // State để quản lý xem người dùng đang bấm vào tab nào
    const [activeTab, setActiveTab] = useState('info');

    return (
        <div className="container py-5" style={{ minHeight: '60vh' }}>
            <h2 className="mb-4 font-weight-bold" style={{ color: '#1C1F26' }}>Tài khoản của tôi</h2>

            <div className="row">
                {/* Menu bên trái */}
                <div className="col-md-3 mb-4">
                    <div className="list-group shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <button
                            className={`list-group-item list-group-item-action py-3 ${activeTab === 'info' ? 'active' : ''}`}
                            onClick={() => setActiveTab('info')}
                            style={activeTab === 'info' ? { backgroundColor: '#D9643A', borderColor: '#D9643A', color: 'white' } : {}}
                        >
                            <i className="fa-regular fa-user me-2"></i> Thông tin cá nhân
                        </button>

                        <button
                            className={`list-group-item list-group-item-action py-3 ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                            style={activeTab === 'orders' ? { backgroundColor: '#D9643A', borderColor: '#D9643A', color: 'white' } : {}}
                        >
                            <i className="fa-solid fa-box me-2"></i> Lịch sử đơn hàng
                        </button>
                    </div>
                </div>

                {/* Nội dung bên phải */}
                <div className="col-md-9">
                    {/* 2. Hiển thị component tương ứng dựa trên activeTab */}
                    {activeTab === 'info' ? (
                        <ProfileInfo />
                    ) : (
                        <OrderHistory />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileIndex;