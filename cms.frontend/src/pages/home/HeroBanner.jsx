import React, { useState, useEffect, useRef } from 'react';
import bannerService from '../../services/bannerService';
// 🚨 1. IMPORT IMAGE_BASE_URL TỪ AXIOSCLIENT
import { IMAGE_BASE_URL } from '../../api/axiosClient';

const HeroBanner = () => {
    const [banners, setBanners] = useState([]);
    const carouselRef = useRef(null);

    // 🚨 (Đã xóa dòng const BACKEND_URL = 'https://localhost:7020'; ở đây)

    useEffect(() => {
        bannerService.getActiveBanners().then(data => {
            setBanners(data);
        });
    }, []);

    useEffect(() => {
        let carouselInstance = null;

        if (banners.length > 0 && carouselRef.current && window.bootstrap) {
            carouselInstance = new window.bootstrap.Carousel(carouselRef.current, {
                interval: 5000, // Tăng lên 5 giây để người dùng kịp đọc nội dung
                ride: 'carousel',
                pause: 'hover'
            });

            carouselInstance.cycle();
        }

        // Dọn dẹp an toàn hơn để tránh lỗi bộ nhớ trong React
        return () => {
            if (carouselInstance) {
                carouselInstance.dispose();
            }
        };
    }, [banners]);

    if (banners.length === 0) {
        return (
            <div className="container-fluid px-0 mb-5">
                <div className="bg-light d-flex justify-content-center align-items-center w-100" style={{ height: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0 mb-5 position-relative">

            {/* 🌟 ĐOẠN STYLE CSS NÀY CHÍNH LÀ CHÌA KHÓA CHO SỰ MƯỢT MÀ */}
            <style>
                {`
                /* Tăng thời gian chuyển cảnh từ 0.6s lên 1.2s, tạo cảm giác mờ dần rất êm */
                .carousel-fade .carousel-item {
                    transition: opacity 1.2s ease-in-out !important;
                }
                /* Hiệu ứng thu phóng nhẹ cho 2 nút bấm trái/phải khi di chuột vào */
                .carousel-control-prev-icon, .carousel-control-next-icon {
                    transition: transform 0.3s ease;
                }
                .carousel-control-prev:hover .carousel-control-prev-icon, 
                .carousel-control-next:hover .carousel-control-next-icon {
                    transform: scale(1.2);
                }
                `}
            </style>

            <div id="heroCarousel" ref={carouselRef} className="carousel slide carousel-fade">

                {/* Các dấu chấm chỉ thị */}
                <div className="carousel-indicators">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target="#heroCarousel"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : undefined}
                            aria-label={`Slide ${index + 1}`}
                            style={{ width: '30px', height: '4px', borderRadius: '2px' }} // Tùy chỉnh nhẹ dấu chấm
                        ></button>
                    ))}
                </div>

                {/* Nội dung ảnh */}
                <div className="carousel-inner">
                    {banners.map((banner, index) => (
                        <div key={banner.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                            <a href={banner.targetUrl || "#"} target={banner.targetUrl ? "_blank" : "_self"} rel="noreferrer">
                                <img
                                    // 🚨 2. SỬ DỤNG IMAGE_BASE_URL ĐỂ NỐI CHUỖI 
                                    src={`${IMAGE_BASE_URL}${banner.imageUrl}`}
                                    className="d-block w-100"
                                    alt={banner.title}
                                    style={{ maxHeight: '550px', objectFit: 'cover' }}
                                />
                            </a>
                        </div>
                    ))}
                </div>

                {/* Nút Trái / Phải */}
                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '1.2rem' }}></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '1.2rem' }}></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
};

export default HeroBanner;