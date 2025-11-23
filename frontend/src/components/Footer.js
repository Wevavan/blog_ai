import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>IA Blog</h3>
            <p>Votre source d'information sur l'intelligence artificielle et le machine learning.</p>
          </div>
          <div className="footer-section">
            <h4>Catégories</h4>
            <ul>
              <li>Machine Learning</li>
              <li>Deep Learning</li>
              <li>NLP</li>
              <li>Computer Vision</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Liens</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/about">À propos</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} IA Blog. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
