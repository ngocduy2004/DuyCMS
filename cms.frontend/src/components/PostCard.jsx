// src/components/PostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    console.log("Dữ liệu bài viết:", post);
    // Tách Ngày và Tháng từ dữ liệu bài viết (nếu không có thì lấy ngày hiện tại)
    const dateObj = post?.createdDate ? new Date(post.createdDate) : new Date();
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = `Tháng ${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

    return (
        <div className="card h-100 border-0 bg-transparent">
            {/* Khối Hình Ảnh (Có relative để chứa cục Ngày/Tháng) */}
            <div className="position-relative overflow-hidden">
                <Link to={`/blog/${post?.id || '#'}`}>
                    <img
                        src={post?.imageUrl ? `https://localhost:7020${post.imageUrl}` : "https://placehold.co/400x400?text=Solis+Image"}
                        className="card-img-top w-100"
                        alt={post?.title || 'Bài viết Solis'}
                        style={{ aspectRatio: '5/5', objectFit: 'cover' }}
                    />
                </Link>

                {/* Cục Badge Ngày Tháng màu xanh */}
                <div
                    className="position-absolute d-flex flex-column align-items-center justify-content-center text-white"
                    style={{
                        bottom: '10px',
                        left: '10px',
                        backgroundColor: '#3bb4f6',
                        padding: '6px 12px',
                        minWidth: '55px'
                    }}
                >
                    <span style={{ fontSize: '1.15rem', fontWeight: 'bold', lineHeight: '1' }}>{day}</span>
                    <span style={{ fontSize: '0.65rem', whiteSpace: 'nowrap', marginTop: '3px' }}>{month}</span>
                </div>
            </div>

            {/* Khối Nội Dung (px-0 để lề chữ sát với lề ảnh) */}
            <div className="card-body px-0 pt-3 pb-0">
                <h6 className="card-title font-weight-bold mb-2" style={{ fontSize: '1.05rem', lineHeight: '1.4' }}>
                    <Link to={`/blog/${post?.id || '#'}`} className="text-dark text-decoration-none">
                        {post?.title || 'Đang cập nhật tiêu đề bài viết...'}
                    </Link>
                </h6>

                <p className="text-muted mb-2 d-flex align-items-center" style={{ fontSize: '0.8rem' }}>
                    <i className="fa-solid fa-user me-2" style={{ color: '#3bb4f6' }}></i>
                    {/* Vì Model C# không có trường Author, ta tạm để mặc định là Solis */}
                    Đăng bởi: Solis
                </p>

                <p className="card-text text-muted" style={{
                    fontSize: '0.85rem',
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {/* GỌI ĐÚNG TRƯỜNG content (chữ c viết thường) TỪ API */}
                    {post?.content || post?.Content || 'Đang cập nhật nội dung...'}
                </p>
            </div>
        </div>
    );
};

export default PostCard;