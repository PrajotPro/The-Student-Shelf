import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';
import ProductPage from './components/Product/ProductPage';
import SellerDashboard from './components/Seller/SellerDashboard';
import ProductDetail from './components/Product/ProductDetail'; // Ensure this is imported
import './App.css'; // Import the global styles

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<ProductPage />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={<SellerDashboard />} />
            {/* Add more routes as you create components */}
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;