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
    // Đưa location lên trên cùng để có thể dùng ngay lúc khởi tạo State
    const location = useLocation();

    // 1. Quản lý State Dữ liệu
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Quản lý State Các Bộ Lọc
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    // SỬA QUAN TRỌNG 1: Khởi tạo searchQuery bằng giá trị trên URL ngay từ đầu
    const [searchQuery, setSearchQuery] = useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('keyword') || '';
    });

    // 3. Đọc từ khóa từ thanh địa chỉ (URL) nếu URL thay đổi
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const keywordFromUrl = params.get('keyword') || '';
        setSearchQuery(keywordFromUrl);
    }, [location.search]);

    // 4. Tải danh mục 1 lần duy nhất khi mở trang
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

    // 5. GỌI API TÌM KIẾM MỖI KHI BỘ LỌC THAY ĐỔI
    useEffect(() => {
        // SỬA QUAN TRỌNG 2: Dùng cờ ignore để chống lỗi Race Condition (API gọi trước nhưng trả về sau)
        let ignore = false;

        const fetchFilteredProducts = async () => {
            setLoading(true);
            try {
                const filteredData = await productService.searchProducts(
                    selectedCategoryId,
                    searchQuery,
                    priceRange.min,
                    priceRange.max
                );

                // Chỉ cập nhật kết quả nếu request này chưa bị hủy
                if (!ignore) {
                    setProducts(filteredData || []);
                }
            } catch (error) {
                console.error("Lỗi khi lọc sản phẩm:", error);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchFilteredProducts();

        // Cleanup: Hủy nhận kết quả của API cũ nếu người dùng gõ từ khóa mới
        return () => {
            ignore = true;
        };
    }, [selectedCategoryId, searchQuery, priceRange]);

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
                        searchQuery={searchQuery} // SỬA QUAN TRỌNG 3: Truyền state xuống Header
                        onSearch={setSearchQuery}
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