import React from 'react';
import ProductCard from '../../components/ProductCard';

const ProductList = ({ products }) => {
    return (
        <div className="row g-4">
            {products.map((product) => (
                <div key={product.id} className="col-6 col-lg-4 mb-4">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};

export default ProductList;