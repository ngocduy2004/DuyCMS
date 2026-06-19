import axiosClient from '../api/axiosClient';

const categoryBlogService = {
    // Kết nối tới CategoriesController trong ASP.NET Core
    getAllCategoryBlogs: () => {
        return axiosClient.get('/categories');
    }
};

export default categoryBlogService;