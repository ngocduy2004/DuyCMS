// src/components/LatestProducts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; // Trỏ đúng đường dẫn tới component ProductCard của bạn

const LatestProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                // Gọi API lấy 3 sản phẩm mới nhất
                const response = await axios.get('https://localhost:7020/api/Products/latest');
                setProducts(response.data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm mới nhất:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-info" role="status"></div>
            </div>
        );
    }

    return (
        <section className="latest-products-section py-5 bg-light">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold" style={{ letterSpacing: '2px', color: '#222' }}>
                        HÀNG MỚI VỀ
                    </h2>
                    <p className="text-muted">Khám phá những mẫu kính mới nhất tuần này</p>
                </div>

                <div className="row justify-content-center">
                    {/* Render chính xác 3 thẻ sản phẩm */}
                    {products.map((product) => (
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestProducts;