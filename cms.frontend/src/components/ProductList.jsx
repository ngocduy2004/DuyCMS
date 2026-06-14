import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import { Link } from 'react-router-dom';

const ProductList = ({ categoryId }) => {
    // 1. Khai báo state để lưu danh sách sản phẩm
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Fetch dữ liệu khi categoryId thay đổi
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = categoryId
                    ? await productService.getByCategory(categoryId)
                    : await productService.getAllProducts();
                setProducts(data); // Cập nhật state 'products'
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    // 3. Xử lý trạng thái loading
    if (loading) return <div className="text-center my-4">Đang tải sản phẩm...</div>;

    // 4. Render danh sách sản phẩm
    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12 text-center text-muted">Không có sản phẩm nào.</div>
            ) : (
                products.map((item) => (
                    <div className="col-md-6 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border-0">
                            <img
                                src={item.imageUrl ? `https://localhost:7020${item.imageUrl}` : "https://placehold.co/400x400"}
                                className="card-img-top"
                                alt={item.name}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold">{item.name}</h5>
                                <p className="text-danger font-weight-bold">
                                    Giá: {item.price.toLocaleString('vi-VN')} đ
                                </p>
                                <Link to={`/product/${item.id}`} className="btn btn-outline-primary btn-block">
                                    <i className="fa-solid fa-eye mr-1"></i> Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;