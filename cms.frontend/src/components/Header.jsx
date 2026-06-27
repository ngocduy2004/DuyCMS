import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import customerService from '../services/customerService';
import '../assets/css/Header.css';

const LensMark = () => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
            <linearGradient id="solisGradient" x1="0" y1="0" x2="34" y2="34">
                <stop offset="0%" stopColor="#E2A33D" />
                <stop offset="100%" stopColor="#D9643A" />
            </linearGradient>
        </defs>
        <circle cx="10" cy="17" r="8.5" fill="url(#solisGradient)" />
        <circle cx="24" cy="17" r="8.5" fill="none" stroke="#1C1F26" strokeWidth="1.6" />
        <path d="M18.2 17H19.8" stroke="#1C1F26" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M1.2 14L4 13.2" stroke="#1C1F26" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M32.8 14L30 13.2" stroke="#1C1F26" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const Header = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 🚨 STATE GIỎ HÀNG
    const [cartCount, setCartCount] = useState(0);

    // Hàm đếm số lượng sp trong LocalStorage
    const updateCartCount = () => {
        try {
            const cart = JSON.parse(localStorage.getItem('myCart')) || [];
            const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(total);
        } catch (e) {
            setCartCount(0);
        }
    };

    const fetchUserData = async () => {
        // 🚨 CHỐT CHẶN BẢO VỆ CONSOLE:
        // Nếu không có thông tin user trong LocalStorage (chưa đăng nhập) -> Thoát luôn, KHÔNG gọi API nữa
        if (!localStorage.getItem('customer')) {
            setCurrentUser(null);
            return;
        }

        try {
            const response = await customerService.getProfile();
            const data = response.data || response;
            setCurrentUser(data);
        } catch (error) {
            setCurrentUser(null);
            // Xóa luôn rác nếu phiên đăng nhập bị lỗi/hết hạn
            localStorage.removeItem('customer');
            localStorage.removeItem('myCart');
        }
    };

    useEffect(() => {
        fetchUserData();
        updateCartCount(); // Lấy số lượng khi vừa load trang

        // Lắng nghe sự kiện
        window.addEventListener('profileUpdated', fetchUserData);
        window.addEventListener('cartUpdated', updateCartCount); // Tự cập nhật khi giỏ hàng đổi

        return () => {
            window.removeEventListener('profileUpdated', fetchUserData);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
            try {
                await customerService.logout();
            } catch (error) {
                console.error("Lỗi đăng xuất", error);
            } finally {
                localStorage.removeItem('customer'); // Xóa user cũ

                // 🚨 QUAN TRỌNG NHẤT: Quét sạch giỏ hàng và ghi chú của tài khoản cũ
                localStorage.removeItem('myCart');
                localStorage.removeItem('checkoutNotes');

                setCurrentUser(null);
                setCartCount(0); // Reset số lượng trên icon giỏ hàng về 0 ngay lập tức

                navigate('/');
                window.location.reload(); // Load lại toàn bộ trang để web sạch sẽ 100%
            }
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            navigate(keyword.trim() !== '' ? `/shop?keyword=${encodeURIComponent(keyword.trim())}` : '/shop');
        }
    };

    return (
        <header className="solis-header sticky-top">
            <nav className="solis-nav container">
                <Link className="solis-brand" to="/">
                    <LensMark />
                    <span className="solis-brand-text">SOLIS <small>Eyewear</small></span>
                </Link>

                <button className="solis-toggler" type="button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span><span></span><span></span>
                </button>

                <div className={`solis-collapse ${isMenuOpen ? 'show' : ''}`} id="solisNavCollapse">
                    <ul className="solis-links">
                        <li><Link to="/">Trang chủ</Link></li>
                        <li><Link to="/shop">Cửa hàng</Link></li>
                        <li><Link to="/blog">Tin tức</Link></li>
                    </ul>

                    <div className="solis-actions">
                        <label className="solis-search">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="search"
                                placeholder="Tìm kính, gọng..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </label>

                        {/* 🚨 ICON GIỎ HÀNG */}
                        <Link to="/cart" className="position-relative ms-3 text-dark">
                            <i className="fa-solid fa-cart-shopping fs-5"></i>
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {currentUser ? (
                            <div
                                className="d-flex align-items-center ms-3 position-relative"
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Ảnh Avatar */}
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName || currentUser.FullName)}&background=D9643A&color=fff&rounded=true&size=36`}
                                    alt="Avatar"
                                    className="rounded-circle shadow-sm"
                                    style={{ width: '36px', height: '36px', marginRight: '8px' }}
                                />

                                {/* Hiển thị tên (xử lý cả viết hoa và viết thường) */}
                                <span className="fw-medium">
                                    {currentUser.fullName || currentUser.FullName || "Tài khoản"}
                                </span>

                                {/* Chỉ 1 khối dropdown duy nhất */}
                                {showDropdown && (
                                    <div
                                        className="dropdown-menu show shadow-sm border-0"
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0,
                                            display: "block",
                                            minWidth: "150px"
                                        }}
                                    >
                                        <Link to="/profile" className="dropdown-item">
                                            Tài khoản
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="dropdown-item text-danger"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="solis-login ms-3">Đăng nhập</Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;