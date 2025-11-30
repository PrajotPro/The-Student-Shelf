import React, { useState } from 'react';
import EditProductForm from './EditProductForm'; // <-- New Component for editing
import './DashboardStyles.css';

const ProductList = ({ products, onEdit, onDelete }) => {
  const [editingProduct, setEditingProduct] = useState(null); // State to hold product being edited

  const handleEditClick = (product) => {
    setEditingProduct(product);
  };

  const handleEditComplete = () => {
    setEditingProduct(null); // Close the edit form
    onEdit('edited'); // Trigger dashboard refresh
  };

  // If a product is currently being edited, show the edit form
  if (editingProduct) {
    return (
      <div className="edit-form-wrapper">
        <button className="btn btn-close-edit" onClick={() => setEditingProduct(null)}>
          &larr; Back to Listings
        </button>
        <EditProductForm 
            product={editingProduct} 
            onEditComplete={handleEditComplete} 
        />
      </div>
    );
  }

  // Display the list of products
  return (
    <div className="product-list-container">
      <table className="listings-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="listing-row">
              <td data-label="Product">
                <div className="product-info-cell">
                    <img src={product.imageUrl} alt={product.name} className="listing-thumbnail"/>
                    <span>{product.name}</span>
                </div>
              </td>
              <td data-label="Category">{product.category}</td>
              <td data-label="Price">₹{product.price.toLocaleString()}</td>
              <td data-label="Actions" className="action-buttons">
                <button 
                    className="btn btn-secondary btn-edit" 
                    onClick={() => handleEditClick(product)}
                >
                    Edit
                </button>
                <button 
                    className="btn btn-danger btn-delete" 
                    onClick={() => onDelete(product.id)}
                >
                    Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;