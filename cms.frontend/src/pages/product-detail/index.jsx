// src/pages/product-detail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService';
import ProductInfo from './ProductInfo';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🚨 STATE QUẢN LÝ THÔNG BÁO (TOAST)
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState('success'); // 'success' hoặc 'warning'

    // Hàm hiển thị thông báo góc màn hình
    const showToast = (message, type = 'warning') => {
        setToastMessage(message);
        setToastType(type);
        setTimeout(() => {
            setToastMessage(null);
        }, 3500); // Tự động tắt sau 3.5 giây
    };

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await productService.getDetail(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // 🚨 HÀM XỬ LÝ THÊM VÀO GIỎ HÀNG
    const handleAddToCart = (selectedProduct, quantity) => {
        let cart = JSON.parse(localStorage.getItem('myCart')) || [];

        // Đảm bảo lấy đúng tên biến tồn kho (đề phòng API trả về chữ hoa/thường)
        const currentStock = selectedProduct.stockQuantity || selectedProduct.StockQuantity || 0;

        // 1. CHỐT CHẶN 1: Nếu chọn số lượng lớn hơn tồn kho thực tế
        if (quantity > currentStock) {
            // 👉 Báo lỗi chính xác theo tiêu chí chấm điểm
            showToast("Số lượng sản phẩm trong kho không đủ!", "warning");
            return;
        }

        const existingItem = cart.find(item => item.productId === selectedProduct.id);

        if (existingItem) {
            // 2. CHỐT CHẶN 2: Nếu trong giỏ đã có, cộng thêm số vừa chọn mà vượt tồn kho
            if (existingItem.quantity + quantity > currentStock) {
                // 👉 Báo lỗi chính xác theo tiêu chí chấm điểm
                showToast("Số lượng sản phẩm trong kho không đủ!", "warning");
                return; // Dừng lại, không cho thêm
            }
            // Nếu hợp lệ thì cộng dồn số lượng
            existingItem.quantity += quantity;
        } else {
            // Thêm sản phẩm mới vào giỏ
            cart.push({
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                price: selectedProduct.price,
                imageUrl: selectedProduct.imageUrl,
                quantity: quantity,
                stockQuantity: currentStock // Bắt buộc lưu tồn kho để trang Giỏ hàng dùng lại
            });
        }

        // Lưu vào LocalStorage
        localStorage.setItem('myCart', JSON.stringify(cart));

        // Thông báo thành công
        showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng thành công! 🛒`, "success");

        // Kích hoạt event để Header tự động cập nhật số đếm giỏ hàng
        window.dispatchEvent(new Event('cartUpdated'));
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '50vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    if (!product) return <div className="text-center py-5">Không tìm thấy sản phẩm.</div>;

    return (
        <div className="container py-4 position-relative">

            {/* ================= GIAO DIỆN THÔNG BÁO NỔI (TOAST) ================= */}
            {toastMessage && (
                <div
                    className="position-fixed p-3"
                    style={{ top: '80px', right: '20px', zIndex: 9999, transition: 'all 0.3s ease-in-out' }}
                >
                    <div className={`alert bg-white shadow-lg border-start border-${toastType === 'success' ? 'success' : 'warning'} border-4 d-flex align-items-center rounded-3 p-3`} role="alert" style={{ minWidth: '300px' }}>

                        {/* Icon trạng thái */}
                        <div className={`bg-${toastType === 'success' ? 'success' : 'warning'} bg-opacity-10 text-${toastType === 'success' ? 'success' : 'warning'} rounded-circle d-flex align-items-center justify-content-center me-3`} style={{ width: '40px', height: '40px' }}>
                            <i className={`fa-solid ${toastType === 'success' ? 'fa-check' : 'fa-triangle-exclamation'} fs-5`}></i>
                        </div>

                        {/* Nội dung thông báo */}
                        <div>
                            <h6 className="fw-bold mb-1 text-dark">
                                {toastType === 'success' ? 'Thành công' : 'Lưu ý'}
                            </h6>
                            <p className="mb-0 text-muted small">{toastMessage}</p>
                        </div>

                        {/* Nút tắt */}
                        <button
                            type="button"
                            className="btn-close ms-auto"
                            onClick={() => setToastMessage(null)}
                        ></button>
                    </div>
                </div>
            )}

            {/* 👉 TRUYỀN HÀM XUỐNG CHO FILE CON */}
            <ProductInfo product={product} onAddToCart={handleAddToCart} showToast={showToast} />
        </div>
    );
};

export default ProductDetail;