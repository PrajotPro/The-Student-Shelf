import React from 'react';
import { Link } from 'react-router-dom'; // <-- NEW IMPORT
import './ProductStyles.css';

const ProductCard = ({ product }) => {
  return (
    <div className="card product-card">
      <div className="product-image-placeholder">
        {/* Use the actual image URL provided by the seller */}
        <img src={product.imageUrl} alt={product.name} onError={(e) => { e.target.src = 'placeholder_url'; }} />
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        <p className="product-category">🏷️ {product.category || 'General'}</p>
        <p className="product-price">
          **₹{product.price.toLocaleString()}**
        </p>
        {/* Use Link component to navigate to the detail page */}
        <Link to={`/product/${product.id}`} className="btn btn-primary product-view-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;