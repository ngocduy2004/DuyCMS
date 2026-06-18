import React, { useState, useEffect } from 'react';
import blogService from '../../services/blogService';
import PostCard from '../../components/PostCard';

const BlogIndex = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        blogService.getAllPosts()
            .then(data => {
                // Kiểm tra xem API trả về mảng trực tiếp hay nằm trong .data
                setPosts(Array.isArray(data) ? data : data.data || []);
            })
            .catch(error => console.error("Lỗi khi tải bài viết:", error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-5 font-weight-bold" style={{ color: '#3bb4f6' }}>
                THÔNG TIN NỔI BẬT
            </h2>

            {loading ? (
                <div className="text-center my-5 text-muted">Đang tải danh sách bài viết...</div>
            ) : posts.length === 0 ? (
                <div className="text-center my-5 text-muted">Chưa có bài viết nào trong hệ thống.</div>
            ) : (
                /* Thêm g-4 để tạo khoảng cách và justify-content-center để căn giữa lưới */
                <div className="row g-4 justify-content-center">
                    {posts.map((post) => (
                        /* Đổi col-md-12 thành col-md-4 để chia thành 3 cột */
                        <div className="col-12 col-md-4" key={post.id}>
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogIndex;