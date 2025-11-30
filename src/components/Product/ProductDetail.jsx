import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- Hook to get ID from URL
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import './ProductStyles.css'; // Reuse existing styles

const ProductDetail = () => {
  const { productId } = useParams(); // Get the ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          setError('');
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("An error occurred while fetching product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="product-detail-container"><p className="error-message">{error}</p></div>;
  }

  // Helper function to render contact info
  const renderContact = () => {
    const contacts = [
      { key: 'phoneNo', label: '📞 Phone', value: product.phoneNo },
      { key: 'whatsappNo', label: '🟢 WhatsApp', value: product.whatsappNo },
      { key: 'email', label: '📧 Email', value: product.email }
    ];

    return contacts.map(contact => 
      contact.value ? (
        <li key={contact.key}>
          <strong>{contact.label}:</strong> 
          <span className="contact-value"> {contact.value}</span>
        </li>
      ) : null
    );
  };

  return (
    <div className="product-detail-container">
      <div className="detail-card">
        <div className="detail-image-box">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="product-main-image" 
          />
          <span className="product-category-tag">{product.category}</span>
        </div>
        
        <div className="detail-content">
          <h1>{product.name}</h1>
          <p className="detail-price">
            Selling Price: **₹{product.price.toLocaleString()}**
          </p>
          
          <hr />

          <h2>📚 Description</h2>
          <p className="detail-description">{product.description}</p>
          
          <hr />
          
          <h2>🤝 Seller Contact</h2>
          <ul className="contact-list">
            {renderContact()}
          </ul>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;