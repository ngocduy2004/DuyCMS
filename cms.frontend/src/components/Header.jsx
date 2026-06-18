// components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
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
    return (
        <header className="solis-header sticky-top">
            <nav className="solis-nav container">
                <Link className="solis-brand" to="/">
                    <LensMark />
                    <span className="solis-brand-text">
                        SOLIS
                        <small>Eyewear</small>
                    </span>
                </Link>

                <button
                    className="solis-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#solisNavCollapse"
                    aria-controls="solisNavCollapse"
                    aria-expanded="false"
                    aria-label="Mở menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className="solis-collapse" id="solisNavCollapse">
                    <ul className="solis-links">
                        <li><Link to="/">Trang chủ</Link></li>
                        <li><Link to="/">Sản phẩm</Link></li>
                        <li><Link to="/blog">Tin tức</Link></li>
                    </ul>

                    <div className="solis-actions">
                        <label className="solis-search">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input type="search" placeholder="Tìm kính, gọng, kiểu dáng..." />
                        </label>
                        <Link to="/login" className="solis-login">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </nav>
            <div className="solis-horizon" aria-hidden="true"></div>
        </header>
    );
};



export default Header;