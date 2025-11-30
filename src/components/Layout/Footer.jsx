import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} 📚 Student Shelf. Built with ReactJS & Firebase.</p>
      </div>
    </footer>
  );
};

export default Footer;