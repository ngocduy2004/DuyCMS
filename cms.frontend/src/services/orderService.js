import axiosClient from '../api/axiosClient';

const orderService = {
    /**
     * 1. API ĐẶT HÀNG (CHECKOUT)
     * Hàm này gomCustomerId, ghi chú và mảng giỏ hàng để gửi xuống C# lưu vào Database
     * @param {Object} checkoutData - Gồm { customerId, notes, cartItems: [{ productId, quantity }] }
     */
    checkout: async (checkoutData) => {
        try {
            // Gọi đến API [HttpPost("checkout")] trong OrdersController
            const data = await axiosClient.post('/Orders/checkout', checkoutData);
            return data; // Trả về { message: "Đặt hàng thành công!", orderId: ... }
        } catch (error) {
            console.error("Lỗi khi xử lý đặt hàng:", error);
            throw error; // Ném lỗi ra ngoài để component (Cart.jsx) chộp lấy và hiển thị thông báo lỗi cho khách
        }
    },

    /**
     * 2. LẤY LỊCH SỬ MUA HÀNG THEO KHÁCH HÀNG
     * Hàm này giúp hiển thị danh sách các đơn hàng mà khách đó từng đặt mua
     * @param {number} customerId - ID của khách hàng đang đăng nhập
     */
    getOrdersByCustomer: async (customerId) => {
        try {
            // Gọi đến API [HttpGet("customer/{customerId}")]
            const data = await axiosClient.get(`/Orders/customer/${customerId}`);
            return data || []; // Nếu có dữ liệu thì trả về mảng, nếu không có (hoặc trống) trả về mảng rỗng []
        } catch (error) {
            console.error(`Lỗi khi lấy lịch sử đơn hàng của khách mã ${customerId}:`, error);
            return []; // Trả về mảng rỗng để giao diện không bị lỗi crash trang
        }
    },

    /**
     * 3. LẤY CHI TIẾT 1 ĐƠN HÀNG
     * Xem đơn hàng đó gồm những sản phẩm cụ thể nào, giá bao nhiêu
     * @param {number} orderId - ID của đơn hàng cần xem
     */
    getOrderDetail: async (orderId) => {
        try {
            // Gọi đến API [HttpGet("{id}")]
            const data = await axiosClient.get(`/Orders/${orderId}`);
            return data;
        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết đơn hàng mã ${orderId}:`, error);
            return null;
        }
    },
    // Hàm lấy lịch sử đơn hàng
    getMyOrders: async () => {
        // Gọi API lấy đơn hàng (bỏ api/ nếu baseURL của bạn đã có /api)
        return await axiosClient.get('/orders/my-orders');
    }
};

export default orderService;