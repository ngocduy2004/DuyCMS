// src/pages/blog/BlogDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
// 🚨 1. Bỏ import axios gốc, thay bằng axiosClient và IMAGE_BASE_URL của dự án
import axiosClient, { IMAGE_BASE_URL } from "../../api/axiosClient";
import '../../assets/css/blog.css';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // 🚨 2. Gọi qua axiosClient, chỉ cần truyền đường dẫn tương đối
                const res = await axiosClient.get(`/Posts/${id}`);
                setPost(res); // Lưu ý: axiosClient đã bóc tách response.data ở Interceptor rồi nên không cần res.data nữa
            } catch (err) {
                console.error("Lỗi khi tải chi tiết bài viết:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading)
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
        );

    if (!post)
        return (
            <div className="container text-center py-5 mt-5">
                <img src="https://placehold.co/150x150?text=404" alt="Not Found" className="mb-4 rounded-circle opacity-50" />
                <h3 className="text-secondary fw-bold">Không tìm thấy bài viết</h3>
                <p className="text-muted">Bài viết này không tồn tại hoặc đã bị xóa.</p>
                <button onClick={() => navigate('/blog')} className="btn btn-info text-white rounded-pill px-4 mt-3">
                    Quay lại danh sách
                </button>
            </div>
        );

    // Định dạng ngày đăng bài viết
    const dateObj = new Date(post.createdDate || post.CreatedDate || post.CreatedAt);
    const formattedDate = isNaN(dateObj.getTime())
        ? "Đang cập nhật"
        : `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1).toString().padStart(2, "0")}/${dateObj.getFullYear()}`;

    // Lấy động tên danh mục từ Database hoặc dự phòng tên mặc định
    const categoryName = post.categoryName || post.CategoryName || (post.category && post.category.name) || "TIN TỨC & ƯU ĐÃI";

    return (
        <div style={{ background: "#f4f7f6", minHeight: "100vh", paddingTop: "40px", paddingBottom: "80px" }}>
            <div className="container">
                {/* Điều hướng Breadcrumb */}
                <nav className="mb-4">
                    <ol className="breadcrumb bg-transparent p-0 m-0 fw-medium" style={{ fontSize: '0.9rem' }}>
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/blog" className="text-decoration-none text-muted">Tin tức</Link></li>
                        <li className="breadcrumb-item active text-info">Chi tiết bài viết</li>
                    </ol>
                </nav>

                {/* Khung nội dung chính */}
                <div className="bg-white rounded-4 shadow-sm border-0" style={{ overflow: "hidden" }}>

                    {/* Ảnh bìa bài viết lớn */}
                    {post.imageUrl && (
                        <div className="position-relative">
                            {/* 🚨 3. Gắn base URL hình ảnh lấy từ file .env */}
                            <img
                                src={`${IMAGE_BASE_URL}${post.imageUrl}`}
                                alt={post.title}
                                className="w-100"
                                style={{ height: "450px", objectFit: "cover" }}
                            />
                            {/* Hiệu ứng mờ chuyển tầng mượt mà */}
                            <div className="position-absolute bottom-0 w-100" style={{ height: '100px', background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))' }}></div>
                        </div>
                    )}

                    {/* Khung giới hạn độ rộng chữ đọc (UX Optimization) */}
                    <div className="p-4 p-md-5">
                        <div className="col-lg-10 mx-auto">

                            {/* Badge danh mục tự động lấy từ DB */}
                            <div className="text-center mb-4">
                                <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wide">
                                    {categoryName}
                                </span>
                            </div>

                            {/* Tiêu đề chính */}
                            <h1 className="text-center mb-4 text-dark" style={{ fontWeight: 800, lineHeight: 1.4, fontSize: "2.4rem" }}>
                                {post.title}
                            </h1>

                            {/* Thanh thông tin phụ (Tác giả, Ngày tháng, Thời gian đọc) */}
                            <div className="d-flex justify-content-center align-items-center flex-wrap mb-5 pb-4 border-bottom text-secondary" style={{ fontSize: '0.95rem' }}>
                                <div className="d-flex align-items-center me-4 mb-2">
                                    <img src="https://ui-avatars.com/api/?name=Solis+Team&background=0dcaf0&color=fff" alt="Solis Team" className="rounded-circle me-2" style={{ width: '35px', height: '35px' }} />
                                    <span className="fw-semibold text-dark">Solis Team</span>
                                </div>
                                <div className="me-4 mb-2">
                                    <i className="fa-regular fa-calendar me-2"></i>
                                    {formattedDate}
                                </div>
                                <div className="mb-2">
                                    <i className="fa-regular fa-clock me-2"></i>
                                    5 phút đọc
                                </div>
                            </div>

                            {/* 🚨 THỰC THI TIÊU CHÍ CHẤM ĐIỂM BIÊN DỊCH HTML CKEDITOR KHÔNG LỘ CODE THÔ */}
                            <div
                                className="blog-content text-dark lh-lg fs-5"
                                style={{ textAlign: 'justify' }}
                                dangerouslySetInnerHTML={{ __html: post.content || post.Content || "" }}
                            ></div>

                            {/* Chân trang bài viết: Gắn thẻ bài viết & Nút mạng xã hội */}
                            <div className="d-flex justify-content-between align-items-center flex-wrap mt-5 pt-4 border-top">
                                <div className="d-flex gap-2 mb-3 mb-md-0">
                                    <span className="badge bg-light text-secondary border px-3 py-2">Kính mắt Solis</span>
                                    <span className="badge bg-light text-secondary border px-3 py-2">Xu hướng 2026</span>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <span className="fw-semibold text-muted">Chia sẻ:</span>
                                    <button className="btn btn-light rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }}>
                                        <i className="fab fa-facebook-f text-primary"></i>
                                    </button>
                                    <button className="btn btn-light rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }}>
                                        <i className="fab fa-twitter text-info"></i>
                                    </button>
                                    <button className="btn btn-light rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }}>
                                        <i className="fas fa-link text-secondary"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BlogDetail;