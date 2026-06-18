// components/Footer.jsx
import React, { useState } from 'react';
import '../assets/css/Footer.css';

// 1. COMPONENT ICON (Đã ép cứng kích thước 24x24 pixel)
const SocialIcon = ({ type }) => {
    const icons = {
        facebook: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.83c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" /></svg>
        ),
        twitter: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.92c-.74.33-1.53.55-2.36.65a4.1 4.1 0 0 0 1.8-2.27c-.8.47-1.69.81-2.63 1A4.07 4.07 0 0 0 11.9 9.3c0 .31.04.62.1.91A11.55 11.55 0 0 1 3.4 5.6a4.07 4.07 0 0 0 1.26 5.43 4.05 4.05 0 0 1-1.84-.5v.05a4.07 4.07 0 0 0 3.26 3.99c-.57.16-1.18.2-1.79.07a4.08 4.08 0 0 0 3.8 2.82A8.18 8.18 0 0 1 2 19.13a11.55 11.55 0 0 0 6.26 1.83c7.51 0 11.62-6.22 11.62-11.62l-.01-.53A8.3 8.3 0 0 0 22 5.92Z" /></svg>
        ),
        google: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 12.23c0-.7-.06-1.36-.18-2H12v3.78h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.9-1.75 2.97-4.32 2.97-7.3Z" /><path d="M12 22c2.7 0 4.96-.9 6.6-2.43l-3.22-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.6-4.12H2.7v2.59A10 10 0 0 0 12 22Z" /><path d="M6.4 13.91A6 6 0 0 1 6.09 12c0-.66.11-1.3.31-1.91V7.5H2.7A10 10 0 0 0 1.6 12c0 1.62.39 3.14 1.1 4.5l3.7-2.59Z" /><path d="M12 5.98c1.47 0 2.8.5 3.84 1.49l2.86-2.86A9.96 9.96 0 0 0 12 2a10 10 0 0 0-9.3 5.5l3.7 2.59C7.2 7.74 9.4 5.98 12 5.98Z" /></svg>
        ),
        instagram: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.41a4.4 4.4 0 0 1 1.64 1.06 4.4 4.4 0 0 1 1.06 1.64c.16.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22a4.4 4.4 0 0 1-1.06 1.64 4.4 4.4 0 0 1-1.64 1.06c-.42.16-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41a4.4 4.4 0 0 1-1.64-1.06 4.4 4.4 0 0 1-1.06-1.64c-.16-.42-.36-1.05-.41-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22a4.4 4.4 0 0 1 1.06-1.64A4.4 4.4 0 0 1 4.93 2.64c.42-.16 1.05-.36 2.22-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.8c-3.14 0-3.5.01-4.74.07-.96.04-1.48.2-1.82.34a2.6 2.6 0 0 0-.97.63 2.6 2.6 0 0 0-.63.97c-.14.34-.3.86-.34 1.82-.06 1.24-.07 1.6-.07 4.74s.01 3.5.07 4.74c.04.96.2 1.48.34 1.82.14.36.32.65.63.97.32.31.61.49.97.63.34.14.86.3 1.82.34 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.96-.04 1.48-.2 1.82-.34.36-.14.65-.32.97-.63.31-.32.49-.61.63-.97.14-.34.3-.86.34-1.82.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.04-.96-.2-1.48-.34-1.82a2.6 2.6 0 0 0-.63-.97 2.6 2.6 0 0 0-.97-.63c-.34-.14-.86-.3-1.82-.34-1.24-.06-1.6-.07-4.74-.07Zm0 3.06a4.98 4.98 0 1 1 0 9.96 4.98 4.98 0 0 1 0-9.96Zm0 1.8a3.18 3.18 0 1 0 0 6.36 3.18 3.18 0 0 0 0-6.36Zm6.34-2.32a1.16 1.16 0 1 1-2.32 0 1.16 1.16 0 0 1 2.32 0Z" /></svg>
        ),
        youtube: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.8 8.001a2.75 2.75 0 0 0-1.94-1.94C18.13 5.6 12 5.6 12 5.6s-6.13 0-7.86.46A2.75 2.75 0 0 0 2.2 8c-.46 1.74-.46 5.37-.46 5.37s0 3.63.46 5.37a2.75 2.75 0 0 0 1.94 1.94c1.73.46 7.86.46 7.86.46s6.13 0 7.86-.46a2.75 2.75 0 0 0 1.94-1.94c.46-1.74.46-5.37.46-5.37s0-3.63-.46-5.37ZM9.95 16.5v-7l6.06 3.5Z" /></svg>
        ),
    };
    // display: inline-block giúp icon không bị ép bẹp
    return <span style={{ display: 'inline-block', lineHeight: 0 }}>{icons[type]}</span>;
};

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Hook up to your newsletter API here
        console.log('Subscribe email:', email);
        setEmail('');
    };

    return (
        <footer className="solis-footer">
            {/* Newsletter banner */}
            <div className="solis-footer-newsletter">
                <div className="solis-footer-newsletter-overlay" />
                <div className="solis-footer-newsletter-content">
                    <h2 className="solis-footer-newsletter-title">ĐĂNG KÝ NHẬN TIN KHUYẾN MẠI</h2>
                    <form className="solis-footer-newsletter-form" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            className="solis-footer-newsletter-input"
                        />
                        <button type="submit" className="solis-footer-newsletter-btn">
                            Đăng ký
                        </button>
                    </form>
                </div>
            </div>

            {/* Main footer */}
            <div className="solis-footer-main">
                <div className="solis-footer-container">

                    {/* Brand / contact column */}
                    <div className="solis-footer-col solis-footer-brand">
                        <div className="solis-footer-logo">
                            <span className="solis-footer-logo-dot" />
                            <span className="solis-footer-logo-text">SOLIS</span>
                            <span className="solis-footer-logo-suffix">.Z</span>
                        </div>

                        <p className="solis-footer-text">
                            Địa chỉ: 245 Tân Sơn Nhì, phường Tân Sơn Nhì, Thành phố Hồ Chí Minh
                        </p>
                        <p className="solis-footer-text">
                            236 Lý Thường Kiệt, phường Diên Hồng, Thành phố Hồ Chí Minh
                        </p>
                        <p className="solis-footer-text">
                            Hotline: <a href="tel:0786496363">0786 49 6363</a>
                        </p>
                        <p className="solis-footer-text">
                            Email: <a href="mailto:matkinhsolis.vn@gmail.com">matkinhsolis.vn@gmail.com</a>
                        </p>

                        <div className="solis-footer-badge">
                            <div className="solis-footer-badge-icon">✓</div>
                            <div className="solis-footer-badge-text">
                                <span>ĐÃ THÔNG BÁO</span>
                                <span>BỘ CÔNG THƯƠNG</span>
                            </div>
                        </div>
                    </div>

                    {/* Support links */}
                    <div className="solis-footer-col">
                        <h3 className="solis-footer-heading">HỖ TRỢ KHÁCH HÀNG</h3>
                        <ul className="solis-footer-links">
                            <li><a href="/">Trang chủ</a></li>
                            <li><a href="/san-pham">Sản phẩm</a></li>
                            <li><a href="/tin-tuc">Tin tức</a></li>
                            <li><a href="/chinh-sach">Chính sách</a></li>
                            <li><a href="/lien-he">Liên hệ</a></li>
                            <li><a href="/khuyen-mai">Khuyến mãi</a></li>
                        </ul>
                    </div>

                    {/* Product links */}
                    <div className="solis-footer-col">
                        <h3 className="solis-footer-heading">KÍNH MẮT</h3>
                        <ul className="solis-footer-links">
                            <li><a href="/kinh-gong-kinh-can">Kính Gọng / Kính Cận</a></li>
                            <li><a href="/kinh-mat-kinh-ram">Kính Mát / Kính Râm</a></li>
                            <li><a href="/kinh-tre-em">Kính Trẻ Em</a></li>
                            <li><a href="/san-pham-cao-cap">Sản Phẩm Cao Cấp</a></li>
                            <li><a href="/trong-kinh">Tròng kính</a></li>
                            <li><a href="/nuoc-ve-sinh-trong-kinh">Nước vệ sinh tròng kính</a></li>
                        </ul>
                    </div>

                    {/* Follow us */}
                    <div className="solis-footer-col solis-footer-follow">
                        <h3 className="solis-footer-heading">THEO DÕI CHÚNG TÔI</h3>
                        <div className="solis-footer-follow-item">
                            <span className="solis-footer-follow-bar" />
                            <a href="https://facebook.com" target="_blank" rel="noreferrer">
                                Facebook
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="solis-footer-bottom">
                <div className="solis-footer-container solis-footer-bottom-inner">
                    <p className="solis-footer-copyright">
                        © Bản quyền thuộc về <a href="#">Cool Team</a> | Cung cấp bởi <a href="#">Sapo</a>
                    </p>
                    <div className="solis-footer-social">
                        <a href="#" aria-label="Facebook"><SocialIcon type="facebook" /></a>
                        <a href="#" aria-label="Twitter"><SocialIcon type="twitter" /></a>
                        <a href="#" aria-label="Google"><SocialIcon type="google" /></a>
                        <a href="#" aria-label="Instagram"><SocialIcon type="instagram" /></a>
                        <a href="#" aria-label="Youtube"><SocialIcon type="youtube" /></a>
                    </div>
                </div>
            </div>

            {/* Floating buttons */}
            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="solis-footer-float solis-footer-zalo" aria-label="Chat Zalo">
                Zalo
            </a>
            <button
                type="button"
                className="solis-footer-float solis-footer-totop"
                aria-label="Lên đầu trang"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                ↑
            </button>
        </footer>
    );
};

export default Footer;