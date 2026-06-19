import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';

const Shop = () => {
    // 1. Quản lý State Dữ liệu
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Quản lý State Bộ Lọc (Filters)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    // 3. Fetch dữ liệu lần đầu tiên (Tải Danh mục & Sản phẩm)
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // Chạy song song 2 API để tối ưu tốc độ
                const [categoriesData, productsData] = await Promise.all([
                    categoryProductService.getAllCategoryProducts(),
                    productService.getAllProducts()
                ]);
                setCategories(categoriesData || []);
                setProducts(productsData || []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu cửa hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // 4. Lọc lại dữ liệu (Mỗi khi thay đổi API category hoặc tìm kiếm/giá)
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            setLoading(true);
            try {
                // Lọc theo danh mục qua API (nếu có chọn)
                let currentProducts = selectedCategoryId
                    ? await productService.getByCategory(selectedCategoryId)
                    : await productService.getAllProducts();

                // Lọc thêm bằng Javascript cho Từ khóa tìm kiếm (Realtime)
                if (searchQuery) {
                    currentProducts = currentProducts.filter(p =>
                        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }

                // Lọc thêm bằng Javascript cho Khoảng Giá
                const min = parseFloat(priceRange.min);
                const max = parseFloat(priceRange.max);
                if (!isNaN(min)) {
                    currentProducts = currentProducts.filter(p => p.price >= min);
                }
                if (!isNaN(max)) {
                    currentProducts = currentProducts.filter(p => p.price <= max);
                }

                setProducts(currentProducts || []);
            } catch (error) {
                console.error("Lỗi khi lọc sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        // Bỏ qua lần render đầu tiên vì đã có fetchInitialData
        if (categories.length > 0) {
            fetchFilteredProducts();
        }
    }, [selectedCategoryId, searchQuery, priceRange]);

    return (
        <div className="container py-5" style={{ paddingBottom: '80px' }} >
            <div className="row">
                {/* Cột trái: Sidebar (Bộ lọc) */}
                <div className="col-12 col-md-3 mb-4 mb-md-0">
                    <ShopSidebar
                        categories={categories}
                        activeCategoryId={selectedCategoryId}
                        onCategorySelect={setSelectedCategoryId}
                        onPriceChange={(min, max) => setPriceRange({ min, max })}
                    />
                </div>

                {/* Cột phải: Không gian mua sắm */}
                <div className="col-12 col-md-9">
                    <ShopHeader
                        totalCount={products.length}
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