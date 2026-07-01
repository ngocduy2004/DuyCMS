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
    },
    // 👇 THÊM HÀM NÀY VÀO 👇
    // HÀM MỚI: Gọi API Search có truyền tham số bộ lọc
    searchProducts: async (categoryId, keyword, minPrice, maxPrice) => {
        try {
            const params = {};
            if (categoryId) params.categoryId = categoryId;
            if (keyword) params.keyword = keyword;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;

            const response = await axiosClient.get('/Products/search', { params });
            return response.data || response;
        } catch (error) {
            console.error("Lỗi khi tìm kiếm sản phẩm:", error);
            throw error;
        }
    }
    
    
};

export default productService;