import axiosClient from '../api/axiosClient';

const bannerService = {
    getActiveBanners: async () => {
        try {
            // 1. Chỉ cần truyền '/Banners' vì baseURL đã lo phần 'https://localhost:7020/api'
            // 2. Vì Interceptor đã bóc sẵn response.data, nên kết quả trả về ở đây CHÍNH LÀ mảng dữ liệu
            const data = await axiosClient.get('/Banners');

            return data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách Banner:", error);
            return []; // Trả về mảng rỗng nếu có lỗi để web không bị sập
        }
    }
};

export default bannerService;