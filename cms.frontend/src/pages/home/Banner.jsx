// components/Banner.jsx
import React from 'react';

const Banner = () => {
    return (
        <div className="banner-container mb-5">
            <img
                src="/images/barner.webp"
                alt="Solis Eyewear Banner"
                className="img-fluid"
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
            />
        </div>
    );
};

export default Banner;