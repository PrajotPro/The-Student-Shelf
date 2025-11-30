import React, { useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import '../Auth/AuthForm.css'; // Reuse form styles
import './DashboardStyles.css'; // Reuse form styles

const categories = ['Instruments', 'Books', 'Electronics', 'Apparel', 'Others'];

const EditProductForm = ({ product, onEditComplete }) => {
  // Initialize state with existing product data
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    imageUrl: product.imageUrl,
    category: product.category,
    phoneNo: product.phoneNo || '',
    whatsappNo: product.whatsappNo || '',
    email: product.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateContact = () => {
    const { phoneNo, whatsappNo, email } = formData;
    return phoneNo || whatsappNo || email;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic Validation
    if (!formData.name || !formData.price || !formData.description || !formData.imageUrl || !formData.category) {
      setError('Please fill in all product fields.');
      return;
    }
    if (!validateContact()) {
        setError('At least one contact detail is mandatory.');
        return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, 'products', product.id);

      // Prepare updated data
      const updatedData = {
        ...formData,
        price: Number(formData.price),
        updatedAt: new Date().toISOString(), // Optional: Track last update time
      };

      await updateDoc(docRef, updatedData);

      setSuccess('Product updated successfully! ✅');
      setTimeout(() => {
        onEditComplete(); // Close form and refresh parent list
      }, 1500);

    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card auth-form product-form-card edit-form">
      <h3>Editing: {product.name}</h3>
      {error && <p className="error-message">🚨 {error}</p>}
      {success && <p className="success-message">✅ {success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Product Details Section (similar to AddProductForm) */}
        <fieldset>
            <legend>Product Details</legend>
            <div className="input-group">
                <label>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            {/* ... other product fields (price, category, image, description) ... */}
            <div className="input-row">
                <div className="input-group price-input">
                    <label>Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} min="1" required />
                </div>
                <div className="input-group category-input">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} required className="styled-select">
                        <option value="" disabled>Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="input-group">
                <label>Image Link (URL)</label>
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required placeholder="e.g., https://example.com/image.jpg" />
            </div>
            <div className="input-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required placeholder="Condition, features, size, etc." />
            </div>
        </fieldset>

        {/* Contact Details Section (similar to AddProductForm) */}
        <fieldset>
            <legend>Contact Details (One required)</legend>
            <div className="input-row contact-row">
                <div className="input-group">
                    <label>Phone No / Whatsapp</label>
                    <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Required" />
                </div>
               
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Optional" />
                </div>
            </div>
        </fieldset>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;