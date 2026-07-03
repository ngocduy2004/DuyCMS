import axios from 'axios';

// 1. LẤY BIẾN MÔI TRƯỜNG TỪ FILE .env
// Sử dụng || để dự phòng (fallback) trong trường hợp file .env bị lỗi hoặc chưa load kịp
const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7020/api';
export const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7020';

// Khởi tạo một thực thể axios với cấu hình base chung
const axiosClient = axios.create({
    baseURL: API_URL, // 🚨 Đã thay thế chuỗi hardcode bằng hằng số môi trường
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Thời gian tối đa chờ phản hồi từ server (10 giây)
    withCredentials: true,
});

// Giải thích: Interceptor giúp chúng ta can thiệp vào dữ liệu trước khi trả về cho component
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu phản hồi thành công, bóc tách lấy thẳng cục data bên trong dữ liệu JSON
        return response.data;
    },
    (error) => {
        // 💡 XỬ LÝ ÊM ÁI LỖI 401 NGAY TẠI CỔNG BẢO VỆ
        if (error.response && error.response.status === 401) {
            // Cứ âm thầm ném lỗi đi tiếp để customerService bắt lấy, KHÔNG in ra console nữa
            return Promise.reject(error);
        }
        // Xử lý lỗi tập trung tại đây (Ví dụ: Server sập, lỗi 404, lỗi 500)
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;