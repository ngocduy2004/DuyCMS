import React, { useState, useEffect } from 'react';
import blogService from '../../services/blogService';
import categoryBlogService from '../../services/categoryBlogService';
import PostCard from '../../components/PostCard';
import BlogSidebar from './BlogSidebar';

const BlogIndex = () => {
    // 1. Quản lý State Dữ liệu
    const [originalPosts, setOriginalPosts] = useState([]);
    const [displayPosts, setDisplayPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Quản lý State Bộ lọc & Phân trang
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // THÊM MỚI: State quản lý phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Hiển thị 6 bài viết trên 1 trang

    // 3. Fetch dữ liệu lần đầu
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [categoriesData, postsData] = await Promise.all([
                    categoryBlogService.getAllCategoryBlogs(),
                    blogService.getAllPosts()
                ]);

                setCategories(categoriesData || []);
                const fetchedPosts = Array.isArray(postsData) ? postsData : postsData.data || [];
                setOriginalPosts(fetchedPosts);
                setDisplayPosts(fetchedPosts);
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

        // Lọc theo danh mục
        if (selectedCategoryId !== null) {
            filtered = filtered.filter(post =>
                post.categoryId == selectedCategoryId ||
                post.CategoryId == selectedCategoryId
            );
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchQuery.trim() !== '') {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(post =>
                (post.title && post.title.toLowerCase().includes(lowerQuery)) ||
                (post.name && post.name.toLowerCase().includes(lowerQuery))
            );
        }

        setDisplayPosts(filtered);
        // QUAN TRỌNG: Đưa người dùng về lại trang 1 mỗi khi đổi bộ lọc
        setCurrentPage(1);
    }, [selectedCategoryId, searchQuery, originalPosts]);

    // 5. THÊM MỚI: Tính toán dữ liệu để Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Mảng chỉ chứa các bài viết của trang hiện tại
    const currentPosts = displayPosts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(displayPosts.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Tự động cuộn lên đầu mượt mà
    };

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
                            Tìm thấy <strong className="text-dark">{displayPosts.length}</strong> bài viết phù hợp
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
                        <>
                            {/* In ra bài viết CỦA TRANG HIỆN TẠI thay vì tất cả */}
                            <div className="row">
                                {currentPosts.map((post) => (
                                    <div className="col-12 col-md-6 col-lg-4 mb-4" key={post.id}>
                                        <PostCard post={post} />
                                    </div>
                                ))}
                            </div>

                            {/* 6. HIỂN THỊ THANH NÚT PHÂN TRANG (Chỉ hiện khi có hơn 1 trang) */}
                            {totalPages > 1 && (
                                <nav aria-label="Page navigation" className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                                Trước
                                            </button>
                                        </li>

                                        {[...Array(totalPages)].map((_, index) => (
                                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}

                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                                Sau
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogIndex;