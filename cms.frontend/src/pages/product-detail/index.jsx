// src/pages/product-detail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService';
import ProductInfo from './ProductInfo';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

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

    // 🚨 HÀM XỬ LÝ THÊM VÀO GIỎ HÀNG BẰNG LOCALSTORAGE
    const handleAddToCart = (selectedProduct, quantity) => {
        let cart = JSON.parse(localStorage.getItem('myCart')) || [];

        const existingItem = cart.find(item => item.productId === selectedProduct.id);

        // Đảm bảo lấy đúng tên biến tồn kho (đề phòng API trả về chữ hoa hoặc chữ thường)
        const currentStock = selectedProduct.stockQuantity || selectedProduct.StockQuantity || 0;

        if (existingItem) {
            // Kiểm tra xem số lượng trong giỏ + số lượng muốn thêm có vượt tồn kho không
            if (existingItem.quantity + quantity > currentStock) {
                alert(`Giỏ hàng của bạn đã có ${existingItem.quantity} cái. Kho chỉ còn ${currentStock} cái, không thể thêm nữa!`);
                return; // Dừng lại, không cho thêm
            }
            existingItem.quantity += quantity;
        } else {
            cart.push({
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                price: selectedProduct.price,
                imageUrl: selectedProduct.imageUrl,
                quantity: quantity,

                // 🚨 ĐÂY LÀ DÒNG QUAN TRỌNG NHẤT BỊ THIẾU LÚC NÃY: 
                // Bắt buộc phải nhét thêm số lượng tồn kho vào giỏ hàng
                stockQuantity: currentStock
            });
        }

        localStorage.setItem('myCart', JSON.stringify(cart));
        alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng thành công! 🛒`);

        // Kích hoạt event để Header tự động cập nhật số đếm giỏ hàng
        window.dispatchEvent(new Event('cartUpdated'));
    };

    if (loading) return <div className="text-center py-5">Đang tải chi tiết sản phẩm...</div>;
    if (!product) return <div className="text-center py-5">Không tìm thấy sản phẩm.</div>;

    return (
        <div className="container py-4">
            {/* 👉 TRUYỀN HÀM XUỐNG CHO FILE CON */}
            <ProductInfo product={product} onAddToCart={handleAddToCart} />
        </div>
    );
};

export default ProductDetail;