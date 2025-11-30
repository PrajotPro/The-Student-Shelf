import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import ProductCard from './ProductCard';
import './ProductStyles.css';

const categories = ['All', 'Instruments', 'Books', 'Electronics', 'Apparel', 'Others'];

const ProductPage = () => {
  const [allProducts, setAllProducts] = useState([]); // Stores all products fetched from Firestore
  const [filteredProducts, setFilteredProducts] = useState([]); // Stores products currently displayed
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // --- 1. Data Fetching ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllProducts(productList);
        setFilteredProducts(productList); // Initially show all products
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- 2. Filtering Logic ---
  useEffect(() => {
    let results = allProducts;

    // Filter by Category
    if (selectedCategory !== 'All') {
      results = results.filter(product => product.category === selectedCategory);
    }

    // Filter by Search Term (case-insensitive search on name and description)
    if (searchTerm.trim()) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      results = results.filter(
        product =>
          product.name.toLowerCase().includes(lowerCaseSearch) ||
          product.description.toLowerCase().includes(lowerCaseSearch)
      );
    }

    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, allProducts]);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="product-page-container">
      <h1>Marketplace Listings 📚</h1>
      <p className="sub-header">Find great deals on pre-loved student gear.</p>
      
      {/* Search and Filter Bar */}
      <div className="filter-bar">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select styled-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat === 'All' ? 'All' : cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="no-products">
            No products match your current search and filter criteria. Try adjusting your selections!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;