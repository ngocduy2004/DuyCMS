import axiosClient from '../api/axiosClient';

const blogService = {
    // Hàm gọi API lấy danh mục các chủ đề bài viết
    getBlogCategories: () => {
        const url = '/Categories'; // Khớp với Route quản lý chuyên mục tin tức ở Backend
        return axiosClient.get(url);
    },

    // Hàm gọi API lấy toàn bộ các bài viết (Mẹo phối đồ, tin tức thời trang)
    getAllPosts: () => {
        const url = '/Posts'; // Khớp với Route quản lý bài viết ở Backend
        return axiosClient.get(url);
    }
};

export default blogService;
