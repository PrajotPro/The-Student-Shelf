import React, { useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import '../Auth/AuthForm.css'; // Use form styles
import './DashboardStyles.css'; // Use dashboard utility styles

const categories = ['Instruments', 'Books', 'Electronics', 'Apparel', 'Others'];

const initialFormData = {
  name: '',
  price: '',
  description: '',
  imageUrl: '',
  category: '',
  phoneNo: '',
  whatsappNo: '',
  email: '',
};

const AddProductForm = ({ sellerId, onProductAdded }) => {
  const [formData, setFormData] = useState(initialFormData);
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

    // Input Validation
    if (!formData.name || !formData.price || !formData.description || !formData.imageUrl || !formData.category) {
      setError('Please fill in all product fields (Name, Price, Description, Image Link, Category).');
      return;
    }
    if (!validateContact()) {
      setError('At least one contact detail (Phone, WhatsApp, or Email) is mandatory.');
      return;
    }

    try {
      setLoading(true);
      const productData = {
        ...formData,
        price: Number(formData.price), // Ensure price is stored as a number
        sellerId: sellerId,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'products'), productData);

      setSuccess('Product listed successfully! 🎉');
      setFormData(initialFormData);
      setTimeout(() => {
        onProductAdded(); // Close the form after success
      }, 1500);

    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form product-form-card">
      <h3>List a New Product</h3>
      {error && <p className="error-message">🚨 {error}</p>}
      {success && <p className="success-message">✅ {success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Product Details Section */}
        <fieldset>
            <legend>Product Details</legend>
            <div className="input-group">
                <label>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
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

        {/* Contact Details Section */}
        <fieldset>
            <legend>Contact Details (One required)</legend>
            <div className="input-row contact-row">
                <div className="input-group">
                    <label>Phone No / WhatsApp No</label>
                    <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="required" />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Optional" />
                </div>
            </div>
        </fieldset>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'List Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;