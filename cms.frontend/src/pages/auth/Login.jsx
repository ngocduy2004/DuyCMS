import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/customerService';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation(); // 👉 2. Khởi tạo location

    const from = location.state?.from || '/';

    // --- BỔ SUNG HÀM NÀY: Giúp cập nhật dữ liệu khi bạn gõ phím ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Gọi API
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });
            const data = response;
            // Log để kiểm tra cấu trúc dữ liệu trả về từ server
            console.log("Dữ liệu nhận được:", data);

            

            // Kiểm tra theo cấu trúc Backend trả về
            if (data.customerId) {
                localStorage.setItem('customer', JSON.stringify({
                    customerId: data.customerId,
                    fullName: data.fullName,
                    email: formData.email
                }));

                alert(data.message || "Đăng nhập thành công!");

                navigate(from);
                window.location.reload();
            } else {
                setError("Có lỗi xảy ra khi xác thực tài khoản.");
            }
        } catch (err) {
            // Hiển thị lỗi từ Backend (ví dụ: 401 Unauthorized)
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className="card shadow-sm border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h2 className="font-weight-bold" style={{ color: '#1C1F26' }}>ĐĂNG NHẬP</h2>
                    </div>

                    {error && <div className="alert alert-danger small py-2 text-center rounded">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label font-weight-bold small">Email</label>
                            <input
                                type="email"
                                className="form-control px-3 py-2"
                                name="email"
                                value={formData.email}
                                onChange={handleChange} // Gọi hàm handleChange ở đây
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label font-weight-bold small">Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control px-3 py-2"
                                name="password"
                                value={formData.password}
                                onChange={handleChange} // Gọi hàm handleChange ở đây
                                required
                            />
                        </div>

                        {/* BỔ SUNG LINK QUÊN MẬT KHẨU TẠI ĐÂY */}
                        <div className="text-end mb-4">
                            <Link to="/forgot-password" className="text-decoration-none small" style={{ color: '#D9643A' }}>
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 font-weight-bold text-white rounded-pill py-2 mb-3"
                            style={{ backgroundColor: '#D9643A' }}
                            disabled={loading}
                        >
                            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                        </button>
                    </form>

                    <div className="text-center mt-3 small">
                        <Link to="/register" className="text-decoration-none font-weight-bold" style={{ color: '#D9643A' }}>
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;