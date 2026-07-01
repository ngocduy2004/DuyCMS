import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';

const ProductGrid = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = categoryId
                    ? await productService.getByCategory(categoryId)
                    : await productService.getAllProducts();
                setProducts(data || []);
                setCurrentPage(1);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
                <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
        );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    return (
        /* Đổi từ py-4 thành py-5 và thêm my-4 để tạo khoảng không gian "thở" rất rộng ở trên và dưới */
        <div className="container py-5 my-4">
            <style>{`
                .custom-pagination .page-item .page-link {
                    color: #555;
                    border: none;
                    margin: 0 4px;
                    border-radius: 50%;
                    width: 42px;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    background-color: transparent;
                }
                .custom-pagination .page-item.active .page-link {
                    background-color: #222;
                    color: #fff;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                }
                .custom-pagination .page-item .page-link:hover:not(.active) {
                    background-color: #f0f0f0;
                    color: #222;
                }
                .custom-pagination .page-item.disabled .page-link {
                    color: #ccc;
                    background-color: transparent;
                }
            `}</style>

            {/* THÊM TIÊU ĐỀ Ở ĐÂY */}
            <div className="text-center mb-5 pb-2">
                <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '2px', color: '#222' }}>
                    Sản phẩm nổi bật
                </h2>
                {/* Đường gạch chân trang trí (Màu cyan/info cho hợp với màu logo của bạn) */}
                <div style={{ width: '60px', height: '3px', backgroundColor: '#00bcd4', margin: '12px auto 0' }}></div>
            </div>

            {/* LƯỚI SẢN PHẨM */}
            <div className="row g-4 px-2"> {/* Thêm px-2 để shadow của card 2 bên rìa không bị cắt */}
                {products.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <img src="https://placehold.co/100x100?text=Empty" alt="Trống" className="mb-3 rounded-circle opacity-25" />
                        <h4 className="text-secondary fw-bold">Không có sản phẩm nào</h4>
                        <p className="text-muted">Danh mục này hiện chưa có sản phẩm. Vui lòng quay lại sau!</p>
                    </div>
                ) : (
                    currentProducts.map((item) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 d-flex align-items-stretch" key={item.id}>
                            <div className="w-100 p-1"> {/* Thêm p-1 để thẻ có không gian bung tỏa bóng đổ (shadow) khi hover */}
                                <ProductCard product={item} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* HIỂN THỊ THANH PHÂN TRANG */}
            {totalPages > 1 && (
                <nav aria-label="Page navigation" className="mt-5 pt-4">
                    <ul className="pagination custom-pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                <i className="fa-solid fa-chevron-left"></i>
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
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default ProductGrid;