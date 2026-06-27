import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/customerService'; // Đảm bảo đã đổi đúng đường dẫn service

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu nhập lại không khớp!');
            return;
        }

        setLoading(true);
        try {
            // Gửi dữ liệu đúng theo tên cột trong Model Customer của bạn
            await authService.register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address
            });
            alert("Đăng ký thành công!");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="card shadow-sm border-0" style={{ maxWidth: '500px', width: '100%', borderRadius: '15px' }}>
                <div className="card-body p-5">
                    <h2 className="text-center font-weight-bold mb-4">ĐĂNG KÝ</h2>
                    {error && <div className="alert alert-danger small text-center">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="small font-weight-bold">Họ và tên</label>
                            <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="small font-weight-bold">Email</label>
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="small font-weight-bold">Mật khẩu</label>
                            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="small font-weight-bold">Xác nhận mật khẩu</label>
                            <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="small font-weight-bold">Số điện thoại</label>
                            <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <label className="small font-weight-bold">Địa chỉ</label>
                            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
                        </div>

                        <button type="submit" className="btn w-100 text-white rounded-pill" style={{ backgroundColor: '#1C1F26' }} disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;