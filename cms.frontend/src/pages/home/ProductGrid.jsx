import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';

const ProductGrid = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. KHAI BÁO STATE PHÂN TRANG
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // 8 sản phẩm / 1 trang

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = categoryId
                    ? await productService.getByCategory(categoryId)
                    : await productService.getAllProducts();
                setProducts(data || []);
                setCurrentPage(1); // Reset về trang 1 nếu đổi danh mục
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    if (loading) return <div className="text-center my-4">Đang tải sản phẩm...</div>;

    // 2. TÍNH TOÁN CẮT MẢNG DỮ LIỆU CHO TRANG HIỆN TẠI
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    // Tính tổng số trang (Math.ceil để làm tròn lên)
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Tự động cuộn lên khi chuyển trang
    };

    return (
        <div className="container">
            {/* LƯỚI SẢN PHẨM */}
            <div className="row g-3">
                {products.length === 0 ? (
                    <div className="col-12 text-center text-muted">Không có sản phẩm nào.</div>
                ) : (
                    currentProducts.map((item) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id}>
                            <ProductCard product={item} />
                        </div>
                    ))
                )}
            </div>

            {/* 3. HIỂN THỊ THANH PHÂN TRANG */}
            {totalPages > 1 && (
                <nav aria-label="Page navigation" className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                Trước
                            </button>
                        </li>

                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                Sau
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default ProductGrid;