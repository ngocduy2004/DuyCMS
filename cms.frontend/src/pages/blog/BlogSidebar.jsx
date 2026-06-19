// src/pages/blog/BlogSidebar.jsx
import React, { useState } from 'react';

const BlogSidebar = ({ categories = [], activeCategoryId, onCategorySelect, onSearch }) => {
    const [keyword, setKeyword] = useState('');

    // Xử lý khi nhấn nút tìm kiếm hoặc Enter
    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(keyword);
        }
    };

    // Tính tổng số bài viết cho mục "Tất cả"
    const totalAllPosts = categories.reduce((sum, item) => sum + (item.totalPosts || 0), 0);

    return (
        <div className="blog-sidebar pe-md-4">

            {/* Khối 1: Ô tìm kiếm bài viết */}
            <div className="mb-5">
                <h5 className="font-weight-bold mb-3 text-uppercase" style={{ letterSpacing: '1px', fontSize: '1.1rem' }}>
                    Tìm kiếm
                </h5>
                <form onSubmit={handleSearch}>
                    <div className="input-group shadow-sm rounded">
                        <input
                            type="text"
                            className="form-control border-end-0"
                            placeholder="Nhập từ khóa..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary bg-white border-start-0" type="submit">
                            <i className="fa-solid fa-magnifying-glass text-muted"></i>
                        </button>
                    </div>
                </form>
            </div>

            {/* Khối 2: Danh sách danh mục bài viết */}
            <div className="mb-5">
                <h5 className="font-weight-bold mb-3 text-uppercase" style={{ letterSpacing: '1px', fontSize: '1.1rem' }}>
                    Danh mục
                </h5>
                <ul className="list-group list-group-flush">
                    {/* Nút: Tất cả bài viết */}
                    <li className="list-group-item px-0 d-flex justify-content-between align-items-center bg-transparent border-bottom">
                        <button
                            className={`btn btn-link text-decoration-none p-0 text-start w-100 ${activeCategoryId === null ? 'text-primary font-weight-bold' : 'text-dark'
                                }`}
                            onClick={() => onCategorySelect(null)}
                        >
                            Tất cả tin tức
                        </button>
                        <span className="badge bg-secondary rounded-pill">{totalAllPosts}</span>
                    </li>

                    {/* Lặp qua danh sách danh mục từ Backend */}
                    {categories.map((cat) => (
                        <li key={cat.id} className="list-group-item px-0 d-flex justify-content-between align-items-center bg-transparent border-bottom">
                            <button
                                className={`btn btn-link text-decoration-none p-0 text-start w-100 ${activeCategoryId === cat.id ? 'text-primary font-weight-bold' : 'text-dark'
                                    }`}
                                onClick={() => onCategorySelect(cat.id)}
                            >
                                {cat.name}
                            </button>
                            {/* Hiển thị số lượng bài viết của từng danh mục */}
                            <span className="badge bg-secondary rounded-pill">{cat.totalPosts}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Khối 3 (Tùy chọn): Có thể thêm bài viết nổi bật hoặc banner quảng cáo ở đây sau */}

        </div>
    );
};

export default BlogSidebar;