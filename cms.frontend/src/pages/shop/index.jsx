// src/pages/shop/Shop.jsx
import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';
import { useLocation } from 'react-router-dom';
const Shop = () => {
    // 1. Quản lý State Dữ liệu
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Quản lý State Các Bộ Lọc
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    // 2. Lấy đối tượng location để đọc URL
    const location = useLocation();




    // 3. THÊM USEEFFECT NÀY VÀO: Đọc từ khóa từ thanh địa chỉ (URL)
    useEffect(() => {
        // Trích xuất tham số từ URL
        const params = new URLSearchParams(location.search);
        const keywordFromUrl = params.get('keyword');

        if (keywordFromUrl) {
            // Nếu trên URL có chữ ?keyword=... thì set vào biến tìm kiếm
            setSearchQuery(keywordFromUrl);
        } else {
            // Nếu không có (người dùng bấm thẳng nút Cửa hàng) thì reset trống
            setSearchQuery('');
        }
    }, [location.search]); // Chạy lại mỗi khi URL thay đổi

    // 3. Tải danh mục 1 lần duy nhất khi mở trang
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await categoryProductService.getAllCategoryProducts();
                setCategories(categoriesData || []);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    // 4. GỌI API TÌM KIẾM MỖI KHI BỘ LỌC THAY ĐỔI
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            setLoading(true);
            try {
                // Gọi ngầm API Search trên C#
                const filteredData = await productService.searchProducts(
                    selectedCategoryId,
                    searchQuery,
                    priceRange.min,
                    priceRange.max
                );
                setProducts(filteredData || []);
            } catch (error) {
                console.error("Lỗi khi lọc sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredProducts();
    }, [selectedCategoryId, searchQuery, priceRange]); // Mảng Dependency: Theo dõi 3 state này

    return (
        <div className="container py-5" style={{ paddingBottom: '80px' }}>
            <div className="row">

                {/* --- CỘT TRÁI: SIDEBAR (DANH MỤC & GIÁ) --- */}
                <div className="col-12 col-md-3 mb-4 mb-md-0">
                    <ShopSidebar
                        categories={categories}
                        activeCategoryId={selectedCategoryId}
                        onCategorySelect={setSelectedCategoryId}
                        onPriceChange={(min, max) => setPriceRange({ min, max })}
                    />
                </div>

                {/* --- CỘT PHẢI: TÌM KIẾM & LƯỚI SẢN PHẨM --- */}
                <div className="col-12 col-md-9">
                    <ShopHeader
                        totalCount={products.length}
                        onSearch={setSearchQuery} // Cập nhật từ khóa
                    />

                    <LoadingOrEmpty isLoading={loading} isEmpty={products.length === 0}>
                        <ProductList products={products} />
                    </LoadingOrEmpty>
                </div>

            </div>
        </div>
    );
};

export default Shop;