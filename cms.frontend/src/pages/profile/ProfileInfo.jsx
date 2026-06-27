import React, { useState, useEffect } from 'react';
import customerService from '../../services/customerService';

const ProfileInfo = () => {
    const [formData, setFormData] = useState({ fullName: '', phone: '', address: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Chạy 1 lần duy nhất khi component vừa render
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await customerService.getProfile();
            // Lấy data từ response (điều chỉnh nếu axiosClient của bạn đã bóc tách sẵn data)
            const data = response.data || response;

            setFormData({
                fullName: data.fullName || '',
                phone: data.phone || '',
                address: data.address || ''
            });
        } catch (error) {
            console.error("Lỗi lấy thông tin:", error);
            setMessage({ text: 'Phiên đăng nhập đã hết hạn hoặc có lỗi xảy ra. Vui lòng đăng nhập lại.', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            // 1. Gọi API lưu dữ liệu mới xuống C#
            await customerService.updateProfile(formData);
            setMessage({ text: 'Cập nhật thông tin thành công!', type: 'success' });

            // 2. PHÁT TÍN HIỆU (Không dùng localStorage nữa)
            // Lệnh này giống như bật loa phát thanh báo cho Header biết "Ê, lấy API mới đi!"
            window.dispatchEvent(new Event('profileUpdated'));

        } catch (error) {
            setMessage({ text: 'Có lỗi xảy ra khi cập nhật thông tin.', type: 'danger' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="card shadow-sm border-0 p-5 text-center">
                <div className="spinner-border" style={{ color: '#D9643A' }} role="status"></div>
                <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="card shadow-sm border-0" style={{ borderRadius: '10px' }}>
            <div className="card-body p-4 p-md-5">
                <h4 className="mb-4 font-weight-bold">Cập nhật hồ sơ</h4>

                {message.text && (
                    <div className={`alert alert-${message.type} small py-2 rounded`} role="alert">
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label font-weight-bold small">Họ và tên <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control px-3 py-2"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label font-weight-bold small">Số điện thoại</label>
                        <input
                            type="text"
                            className="form-control px-3 py-2"
                            name="phone"
                            placeholder="Chưa cập nhật"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label font-weight-bold small">Địa chỉ giao hàng</label>
                        <input
                            type="text"
                            className="form-control px-3 py-2"
                            name="address"
                            placeholder="Chưa cập nhật"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn font-weight-bold text-white rounded-pill px-5 py-2 mt-2"
                        style={{ backgroundColor: '#D9643A', transition: 'all 0.3s' }}
                        disabled={saving}
                    >
                        {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : 'LƯU THAY ĐỔI'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileInfo;