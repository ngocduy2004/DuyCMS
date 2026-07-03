import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/customerService'; // Nhớ kiểm tra đúng đường dẫn

const ForgotPassword = () => {
    const navigate = useNavigate();

    // Quản lý các bước: 1 (Email), 2 (OTP), 3 (Đổi mật khẩu)
    const [step, setStep] = useState(1);

    // Các State lưu trữ dữ liệu
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Trạng thái giao diện
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // =====================================
    // BƯỚC 1: GỬI EMAIL LẤY OTP
    // =====================================
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setError(''); setMessage(''); setLoading(true);
        try {
            const response = await authService.forgotPassword({ email });
            setMessage(response.message || 'Đã gửi mã OTP. Vui lòng kiểm tra email!');
            setStep(2); // Chuyển sang bước 2
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // BƯỚC 2: XÁC THỰC OTP
    // =====================================
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(''); setMessage(''); setLoading(true);
        try {
            const response = await authService.verifyOtp({ email, otp });
            setMessage(response.message || 'Xác thực thành công. Mời đổi mật khẩu!');
            setStep(3); // Chuyển sang bước 3
        } catch (err) {
            setError(err.response?.data?.message || 'Mã OTP không đúng.');
        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // BƯỚC 3: ĐẶT LẠI MẬT KHẨU
    // =====================================
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(''); setMessage('');

        if (newPassword !== confirmNewPassword) {
            return setError('Mật khẩu xác nhận không khớp!');
        }

        setLoading(true);
        try {
            const response = await authService.resetPassword({
                email,
                otp,
                newPassword,
                confirmNewPassword
            });
            setMessage(response.message || 'Đổi mật khẩu thành công!');

            // Đợi 2 giây để khách đọc thông báo rồi tự động chuyển về trang Đăng nhập
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi đặt lại mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="card shadow-sm border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
                <div className="card-body p-5">

                    {/* Tiêu đề linh hoạt theo Bước */}
                    <div className="text-center mb-4">
                        <h3 className="font-weight-bold" style={{ color: '#1C1F26' }}>
                            {step === 1 && "QUÊN MẬT KHẨU"}
                            {step === 2 && "XÁC NHẬN OTP"}
                            {step === 3 && "ĐẶT LẠI MẬT KHẨU"}
                        </h3>
                        <p className="text-muted small mt-2">
                            {step === 1 && "Nhập địa chỉ email của bạn, chúng tôi sẽ gửi mã xác nhận."}
                            {step === 2 && `Mã gồm 6 chữ số đã được gửi tới email ${email}`}
                            {step === 3 && "Vui lòng nhập mật khẩu mới của bạn."}
                        </p>
                    </div>

                    {error && <div className="alert alert-danger small py-2 text-center rounded">{error}</div>}
                    {message && <div className="alert alert-success small py-2 text-center rounded">{message}</div>}

                    {/* FORM BƯỚC 1: EMAIL */}
                    {step === 1 && (
                        <form onSubmit={handleSendEmail}>
                            <div className="mb-4">
                                <label className="form-label font-weight-bold small">Email đăng ký</label>
                                <input type="email" className="form-control px-3 py-2" placeholder="VD: nguyenvan@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn w-100 font-weight-bold text-white rounded-pill py-2 mb-3" style={{ backgroundColor: '#D9643A' }} disabled={loading}>
                                {loading ? 'ĐANG GỬI...' : 'GỬI MÃ OTP'}
                            </button>
                        </form>
                    )}

                    {/* FORM BƯỚC 2: OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="mb-4">
                                <label className="form-label font-weight-bold small">Mã OTP</label>
                                <input type="text" className="form-control px-3 py-2 text-center fs-4 tracking-widest" maxLength="6" placeholder="------" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} required />
                            </div>
                            <button type="submit" className="btn w-100 font-weight-bold text-white rounded-pill py-2 mb-3" style={{ backgroundColor: '#D9643A' }} disabled={loading || otp.length < 6}>
                                {loading ? 'ĐANG KIỂM TRA...' : 'XÁC NHẬN'}
                            </button>
                        </form>
                    )}

                    {/* FORM BƯỚC 3: MẬT KHẨU MỚI */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="mb-3">
                                <label className="form-label font-weight-bold small">Mật khẩu mới</label>
                                <input type="password" className="form-control px-3 py-2" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength="6" required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label font-weight-bold small">Xác nhận mật khẩu</label>
                                <input type="password" className="form-control px-3 py-2" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} minLength="6" required />
                            </div>
                            <button type="submit" className="btn w-100 font-weight-bold text-white rounded-pill py-2 mb-3" style={{ backgroundColor: '#D9643A' }} disabled={loading}>
                                {loading ? 'ĐANG LƯU...' : 'ĐỔI MẬT KHẨU'}
                            </button>
                        </form>
                    )}

                    {/* Nút quay lại (nếu đang ở bước 2 hoặc 3 thì cho phép lùi lại, nếu bước 1 thì quay về đăng nhập) */}
                    <div className="text-center mt-3 small">
                        {step === 1 ? (
                            <Link to="/login" className="text-decoration-none font-weight-bold" style={{ color: '#1C1F26' }}>
                                <i className="fa-solid fa-arrow-left me-1"></i> Quay lại đăng nhập
                            </Link>
                        ) : (
                            <button type="button" onClick={() => setStep(step - 1)} className="btn btn-link text-decoration-none font-weight-bold p-0" style={{ color: '#1C1F26' }}>
                                <i className="fa-solid fa-arrow-left me-1"></i> Trở lại
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;