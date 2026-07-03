import React, { useState } from 'react';
import authService from '../../services/customerService';

const ChangePassword = () => {
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('Mật khẩu mới không khớp!');
            return;
        }

        setLoading(true);
        try {
            // Bạn cần thêm hàm changePassword vào customerService
            await authService.changePassword(formData);
            setMessage('Đổi mật khẩu thành công!');
            setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm p-4">
            <h4 className="mb-4">Đổi mật khẩu</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Mật khẩu cũ</label>
                    <input type="password" className="form-control" onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mật khẩu mới</label>
                    <input type="password" className="form-control" onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Xác nhận mật khẩu mới</label>
                    <input type="password" className="form-control" onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })} required />
                </div>
                <button type="submit" className="btn text-white" style={{ backgroundColor: '#D9643A' }} disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                </button>
            </form>
        </div>
    );
};
export default ChangePassword;