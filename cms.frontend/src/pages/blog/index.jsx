import React, { useState, useEffect } from 'react';
import blogService from '../../services/blogService';
import categoryBlogService from '../../services/categoryBlogService'; // Import API danh mục bài viết
import PostCard from '../../components/PostCard';
import BlogSidebar from './BlogSidebar'; // Import Sidebar

const BlogIndex = () => {
    // 1. Quản lý State Dữ liệu
    const [originalPosts, setOriginalPosts] = useState([]); // Chứa dữ liệu gốc từ API
    const [displayPosts, setDisplayPosts] = useState([]);   // Chứa dữ liệu sau khi lọc để hiển thị
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Quản lý State Bộ lọc
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // 3. Fetch dữ liệu lần đầu (Gọi song song API Bài viết và Danh mục)
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [categoriesData, postsData] = await Promise.all([
                    categoryBlogService.getAllCategoryBlogs(),
                    blogService.getAllPosts()
                ]);

                // Xử lý danh mục
                setCategories(categoriesData || []);

                // Xử lý bài viết
                const fetchedPosts = Array.isArray(postsData) ? postsData : postsData.data || [];
                setOriginalPosts(fetchedPosts);
                setDisplayPosts(fetchedPosts); // Ban đầu hiển thị tất cả

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu trang Blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // 4. Logic lọc bài viết mỗi khi đổi danh mục hoặc gõ tìm kiếm
    useEffect(() => {
        let filtered = [...originalPosts];

        // Lọc theo danh mục (Lưu ý: Bạn cần đảm bảo API bài viết trả về có trường categoryId)
        // Lọc theo danh mục (Đã bọc chống lỗi C# và kiểu dữ liệu)
        if (selectedCategoryId !== null) {
            filtered = filtered.filter(post =>
                post.categoryId == selectedCategoryId ||
                post.CategoryId == selectedCategoryId
            );
        }

        // Lọc theo từ khóa tìm kiếm (Tìm trong tiêu đề bài viết)
        if (searchQuery.trim() !== '') {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(post =>
                (post.title && post.title.toLowerCase().includes(lowerQuery)) ||
                (post.name && post.name.toLowerCase().includes(lowerQuery)) // Dự phòng nếu Backend dùng trường Name
            );
        }

        setDisplayPosts(filtered);
    }, [selectedCategoryId, searchQuery, originalPosts]);

    return (
        <div className="container py-5" style={{ paddingBottom: '80px' }}>
            <h2 className="text-center mb-5 font-weight-bold text-uppercase" style={{ color: '#1C1F26', letterSpacing: '1px' }}>
                Tin tức & Ưu đãi
            </h2>

            <div className="row">
                {/* Cột Trái: Sidebar chứa Bộ lọc và Tìm kiếm */}
                <div className="col-12 col-md-3 mb-4 mb-md-0">
                    <BlogSidebar
                        categories={categories}
                        activeCategoryId={selectedCategoryId}
                        onCategorySelect={setSelectedCategoryId}
                        onSearch={setSearchQuery}
                    />
                </div>

                {/* Cột Phải: Không gian hiển thị danh sách bài viết */}
                <div className="col-12 col-md-9">
                    {/* Dòng thông báo số lượng */}
                    <div className="mb-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
                        <span className="text-muted">
                            Hiển thị <strong className="text-dark">{displayPosts.length}</strong> bài viết
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center my-5 py-5 text-muted">
                            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                            <p>Đang tải danh sách bài viết...</p>
                        </div>
                    ) : displayPosts.length === 0 ? (
                        <div className="text-center my-5 py-5">
                            <img src="https://placehold.co/150x150?text=No+Posts" alt="Không có bài viết" className="mb-4 opacity-50 rounded-circle" />
                            <h5 className="text-muted">Không tìm thấy bài viết nào phù hợp.</h5>
                        </div>
                    ) : (
                        <div className="row">
                            {displayPosts.map((post) => (
                                /* Thêm class mb-4 để hàng trên và hàng dưới không dính vào nhau */
                                <div className="col-12 col-md-6 col-lg-4 mb-4" key={post.id}>
                                    <PostCard post={post} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogIndex;