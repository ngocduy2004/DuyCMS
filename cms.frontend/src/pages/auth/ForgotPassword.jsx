import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/customerService'; // Đảm bảo import đúng service của bạn

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // 🚨 GỌI ĐÚNG ĐƯỜNG DẪN API CỦA BACKEND
            // Đảm bảo URL này khớp với [HttpPost("forgot-password")] trong CustomerAuthController
            const response = await authService.forgotPassword({ email });

            // Backend trả về message thành công
            setMessage(response.message || 'Mật khẩu mới đã được gửi vào email của bạn!');
            setEmail('');
        } catch (err) {
            // Lấy thông báo lỗi từ phía Backend (.NET)
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="card shadow-sm border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h3 className="font-weight-bold" style={{ color: '#1C1F26' }}>QUÊN MẬT KHẨU</h3>
                        <p className="text-muted small mt-2">
                            Nhập địa chỉ email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
                        </p>
                    </div>

                    {error && <div className="alert alert-danger small py-2 text-center rounded">{error}</div>}
                    {message && <div className="alert alert-success small py-2 text-center rounded">{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label font-weight-bold small">Email đăng ký</label>
                            <input
                                type="email"
                                className="form-control px-3 py-2"
                                placeholder="VD: nguyenvan@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 font-weight-bold text-white rounded-pill py-2 mb-3"
                            style={{ backgroundColor: '#D9643A' }}
                            disabled={loading}
                        >
                            {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU'}
                        </button>
                    </form>

                    <div className="text-center mt-3 small">
                        <Link to="/login" className="text-decoration-none font-weight-bold" style={{ color: '#1C1F26' }}>
                            <i className="fa-solid fa-arrow-left me-1"></i> Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;