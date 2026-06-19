import axiosClient from '../api/axiosClient';

const productService = {
    // 1. Hàm lấy toàn bộ sản phẩm
    getAllProducts: () => {
        return axiosClient.get('/products');
    },

    // 2. BỔ SUNG HÀM NÀY: Dùng để lọc sản phẩm theo ID danh mục
    getByCategory: (categoryId) => {
        // Đường dẫn này phải khớp với [HttpGet("category/{categoryId}")] trong Backend
        return axiosClient.get(`/products/category/${categoryId}`);
    },

    // 3. Hàm xem chi tiết (nếu cần dùng sau này)
    getDetail: (id) => {
        return axiosClient.get(`/products/${id}`);
    }

    
    
};

export default productService;