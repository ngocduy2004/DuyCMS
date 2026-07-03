import axiosClient from '../api/axiosClient';

const customerService = {
    // POST: /api/CustomerAuth/CustomerRegister
    register: (registerData) => {
        return axiosClient.post('/CustomerAuth/CustomerRegister', registerData);
    },

    // POST: /api/CustomerAuth/CustomerLogin
    login: (loginData) => {
        return axiosClient.post('/CustomerAuth/CustomerLogin', loginData);
    },

    // GET: /api/CustomerAuth/me (Lấy thông tin profile)
    getProfile: async () => {
        try {
            // Lấy thông tin user nếu Cookie hợp lệ
            const data = await axiosClient.get('/CustomerAuth/me');
            return data;
        } catch (error) {
            // 💡 XỬ LÝ ÊM ÁI LỖI 401:
            // Nếu người dùng chưa đăng nhập, Backend trả 401 -> Ta chỉ cần trả về null
            // Tránh văng lỗi đỏ Console làm rác màn hình debug
            if (error.response && error.response.status === 401) {
                return null;
            }

            // Nếu là lỗi khác (như Server chết), ta vẫn ném lỗi ra để xử lý
            throw error;
        }
    },

    // PUT: /api/CustomerAuth/me (Cập nhật thông tin profile)
    updateProfile: (profileData) => {
        return axiosClient.put('/CustomerAuth/me', profileData);
    },

    // 🚨 BẮT BUỘC PHẢI CÓ HÀM NÀY ĐỂ HEADER GỌI ĐĂNG XUẤT
    logout: () => {
        return axiosClient.post('/CustomerAuth/logout');
    },
    // 🚨 BỔ SUNG: Hàm Quên mật khẩu
    // POST: /api/CustomerAuth/forgot-password
    // 1. Quên mật khẩu - Gửi mã OTP
    forgotPassword: (data) => {
        return axiosClient.post('/CustomerAuth/forgot-password', data);
    },

    // 2. Xác thực OTP
    verifyOtp: (data) => {
        return axiosClient.post('/CustomerAuth/verify-otp', data);
    },

    // 3. Đặt lại mật khẩu mới
    resetPassword: (data) => {
        return axiosClient.post('/CustomerAuth/reset-password', data);
    },
    changePassword: (data) => {
        return axiosClient.put('/CustomerAuth/change-password', data);
    },

};

export default customerService;