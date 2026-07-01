// src/components/BestSellingProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const BestSellingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                // Gọi API lấy 3 sản phẩm bán chạy nhất
                const response = await axios.get('https://localhost:7020/api/Products/bestsellers');
                setProducts(response.data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm bán chạy:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-danger" role="status"></div>
            </div>
        );
    }

    return (
        /* Dùng nền trắng (bg-white) để xen kẽ với nền xám (bg-light) của LatestProducts */
        <section className="py-5 bg-white">
            <div className="container">
                {/* Tiêu đề được thiết kế màu đỏ rực rỡ mang cảm giác HOT */}
                <div className="text-center mb-5 pb-2">
                    <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '2px', color: '#dc3545' }}>
                        🔥 Sản phẩm bán chạy 🔥
                    </h2>
                    <div style={{ width: '80px', height: '3px', backgroundColor: '#dc3545', margin: '12px auto 0' }}></div>
                    <p className="text-muted mt-3">Những mẫu gọng kính được săn lùng nhiều nhất tại Solis Z</p>
                </div>

                <div className="row g-4 px-2 justify-content-center">
                    {/* Render chính xác 3 thẻ sản phẩm */}
                    {products.length === 0 ? (
                        <p className="text-center text-muted">Đang cập nhật dữ liệu...</p>
                    ) : (
                        products.map((item) => (
                            /* SỬA LỖI Ở ĐÂY: Đổi col-lg-3 thành col-lg-4 col-md-6 col-sm-12 */
                            <div className="col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch" key={item.id}>
                                <div className="w-100 p-1">
                                    <ProductCard product={item} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default BestSellingProducts;