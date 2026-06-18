import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; // Hoặc dùng blogService của bạn

const BlogDetail = () => {
    // Lấy ID bài viết từ URL (ví dụ: /blog/5 -> id = 5)
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                // Gọi thẳng API GetDetail mà bạn đã viết ở C#
                const response = await axios.get(`https://localhost:7020/api/Posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [id]);

    // Trạng thái đang tải dữ liệu
    if (loading) {
        return <div className="container text-center my-5 py-5 text-muted">Đang tải nội dung bài viết...</div>;
    }

    // Trạng thái lỗi 404 (Không tìm thấy)
    if (!post) {
        return (
            <div className="container text-center my-5 py-5">
                <h3 className="text-danger">Không tìm thấy bài viết!</h3>
                <Link to="/" className="btn btn-outline-info mt-3">Về trang chủ</Link>
            </div>
        );
    }

    // Xử lý ngày tháng hiển thị đẹp
    const dateObj = new Date(post.createdDate || post.CreatedAt);
    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

    return (
        <div className="container mt-5 mb-5">
            {/* Căn giữa bài viết, giới hạn độ rộng để người dùng dễ đọc (col-lg-8) */}
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">

                    {/* 1. Breadcrumb (Đường dẫn điều hướng) */}
                    <nav aria-label="breadcrumb" className="mb-4">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '0.9rem' }}>
                            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-info">Trang chủ</Link></li>
                            <li className="breadcrumb-item"><Link to="/blog" className="text-decoration-none text-info">Tin tức</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Chi tiết bài viết</li>
                        </ol>
                    </nav>

                    {/* 2. Tiêu đề và Thông tin Metadata */}
                    <h1 className="font-weight-bold mb-3" style={{ fontSize: '2rem', lineHeight: '1.4' }}>
                        {post.title}
                    </h1>

                    <div className="d-flex align-items-center text-muted mb-4 pb-3 border-bottom" style={{ fontSize: '0.9rem' }}>
                        <span className="me-4">
                            <i className="fa-solid fa-calendar-days me-2 text-info"></i>
                            {formattedDate}
                        </span>
                        <span>
                            <i className="fa-solid fa-user me-2 text-info"></i>
                            Đăng bởi: Solis
                        </span>
                    </div>

                    {/* 3. Ảnh bìa bài viết */}
                    {post.imageUrl && (
                        <div className="mb-5">
                            <img
                                src={`https://localhost:7020${post.imageUrl}`}
                                alt={post.title}
                                className="img-fluid rounded w-100"
                                style={{ maxHeight: '450px', objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    {/* 4. Nội dung bài viết (Có parse HTML từ CKEditor) */}
                    <div
                        className="blog-content"
                        style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
                        dangerouslySetInnerHTML={{ __html: post.content || post.Content }}
                    />

                </div>
            </div>
        </div>
    );
};

export default BlogDetail;