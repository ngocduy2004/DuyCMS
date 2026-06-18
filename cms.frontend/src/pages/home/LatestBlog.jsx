// src/pages/home/LatestBlog.jsx
import React, { useState, useEffect } from 'react';
import blogService from '../../services/blogService';
import PostCard from '../../components/PostCard';

const LatestBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await blogService.getAllPosts();
                // Giả sử API trả về mảng trực tiếp hoặc response.data
                setPosts(Array.isArray(response) ? response : response.data);
            } catch (error) {
                console.error("Lỗi khi tải tin tức:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center my-4">Đang tải tin tức...</div>;

    return (
        <div className="container-fluid mt-5 mb-5">
            {/* Tiêu đề được căn giữa giống thiết kế mẫu */}
            <h3 className="mb-5 text-uppercase font-weight-bold text-center" style={{ color: '#3bb4f6' }}>
                Thông tin nổi bật
            </h3>

            {posts.length === 0 ? (
                <p className="text-center text-muted">Chưa có bài viết tin tức nào.</p>
            ) : (
                /* Thêm g-4 (gutter-4) để tạo khoảng cách đều đặn giữa các thẻ bài viết */
                <div className="row g-4 justify-content-center">
                    {/* DÙNG SLICE(0, 3) ĐỂ LẤY ĐÚNG 3 BÀI VIẾT ĐẦU TIÊN */}
                    {posts.slice(0, 3).map((post) => (
                        <div className="col-12 col-md-4" key={post.id}>
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LatestBlog;