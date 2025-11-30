import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'; // <-- NEW IMPORTS
import AddProductForm from './AddProductForm';
import ProductList from './ProductList'; // <-- NEW COMPONENT
import './DashboardStyles.css';

const SellerDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [uid, setUid] = useState(null);
  const [listings, setListings] = useState([]); // <-- STATE for seller's listings
  const [loadingListings, setLoadingListings] = useState(true);

  // Function to fetch products for the current seller
  const fetchSellerProducts = async (userId) => {
    if (!userId) return;
    setLoadingListings(true);
    try {
      // Create a query: products collection, where the 'sellerId' field equals the current user's UID
      const q = query(collection(db, 'products'), where('sellerId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const productList = querySnapshot.docs.map(document => ({
        id: document.id,
        ...document.data(),
      }));
      setListings(productList);
    } catch (error) {
      console.error('Error fetching seller products:', error);
    } finally {
      setLoadingListings(false);
    }
  };

  // Auth Effect: Check user and fetch data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUid(currentUser.uid);
        fetchSellerProducts(currentUser.uid); // Fetch listings when user logs in
      } else {
        setUid(null);
        setListings([]);
        setLoadingListings(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handler to refresh the list after adding/deleting
  const handleProductChange = (actionType) => {
    setShowForm(false); // Close form if coming from AddProductForm
    if (uid) {
      fetchSellerProducts(uid);
    }
  };

  // Handler for deleting a product
  const handleDeleteProduct = async (productId) => {
      if (window.confirm('Are you sure you want to delete this listing?')) {
          try {
              await deleteDoc(doc(db, 'products', productId));
              handleProductChange('deleted'); // Refresh the list
          } catch (error) {
              console.error('Error deleting product:', error);
          }
      }
  };


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Seller Dashboard ⚙️</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✖️ Close Form' : '➕ Add New Product'}
        </button>
      </header>

      {showForm && (
        <div className="add-product-section card">
          {uid ? (
            <AddProductForm
              sellerId={uid}
              onProductAdded={handleProductChange} // Use the new handler
            />
          ) : (
            <p className="error-message">Please log in to add a product.</p>
          )}
        </div>
      )}

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          {/* ... Quick Links ... */}
        </aside>

        <section className="dashboard-main-area card">
          <h2>📝 My Current Listings ({listings.length})</h2>
          {loadingListings ? (
            <div className="loading-spinner"></div>
          ) : listings.length > 0 ? (
            <ProductList 
                products={listings} 
                onEdit={handleProductChange} // Placeholder for editing logic
                onDelete={handleDeleteProduct} // Pass the delete handler
            />
          ) : (
            <p className="no-listings-message">
                You haven't listed any products yet. Click "Add New Product" to start selling!
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default SellerDashboard;