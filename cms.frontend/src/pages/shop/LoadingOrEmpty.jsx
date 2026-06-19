import React from 'react';

const LoadingOrEmpty = ({ isLoading, isEmpty, children }) => {
    // 1. Trạng thái đang tải API
    if (isLoading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="text-muted">Đang cập nhật danh sách sản phẩm...</p>
            </div>
        );
    }

    // 2. Trạng thái trống (Không tìm thấy sản phẩm)
    if (isEmpty) {
        return (
            <div className="text-center py-5">
                <img
                    src="https://placehold.co/150x150?text=No+Data"
                    alt="No products"
                    className="mb-4 opacity-50"
                    style={{ borderRadius: '50%' }}
                />
                <h5 className="text-muted mb-2">Rất tiếc, không tìm thấy sản phẩm nào!</h5>
                <p className="text-secondary small">Vui lòng thử điều chỉnh lại bộ lọc giá, danh mục hoặc từ khóa tìm kiếm.</p>
            </div>
        );
    }

    // 3. Render danh sách nếu có dữ liệu
    return <>{children}</>;
};

export default LoadingOrEmpty;