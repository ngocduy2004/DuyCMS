import React from 'react';

const LoadingOrEmpty = ({ isLoading, isEmpty, children }) => {
    // 1. Trạng thái đang tải API (Loading)
    if (isLoading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '50vh' }}>
                <div className="spinner-border text-dark mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="text-muted fw-medium">Đang cập nhật danh sách sản phẩm...</p>
            </div>
        );
    }

    // 2. Trạng thái trống (Empty State - KHÔNG CÓ SẢN PHẨM)
    if (isEmpty) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center py-5 text-center" style={{ minHeight: '50vh' }}>

                {/* Hình ảnh minh họa chiếc hộp trống đẹp mắt */}
                <img
                    src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
                    alt="Không có sản phẩm"
                    className="mb-4"
                    style={{ width: '150px', opacity: 0.8, filter: 'grayscale(20%)' }}
                />

                {/* 🚨 DÒNG CHỮ YÊU CẦU BẮT BUỘC TỪ TIÊU CHÍ CHẤM ĐIỂM */}
                <h5 className="text-dark fw-bold mb-4" style={{ fontSize: '1.25rem' }}>
                    Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.
                </h5>

                {/* Nút Xóa bộ lọc giúp người dùng quay lại danh sách gốc nhanh chóng */}
                <button
                    className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold shadow-sm mt-2"
                    onClick={() => window.location.href = '/shop'} // Tải lại trang Cửa hàng
                >
                    <i className="fa-solid fa-rotate-left me-2"></i> Xóa tất cả bộ lọc
                </button>

            </div>
        );
    }

    // 3. Render danh sách lưới sản phẩm nếu có dữ liệu
    return <>{children}</>;
};

export default LoadingOrEmpty;