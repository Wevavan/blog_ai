import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <h1>🤖 IA Blog</h1>
          </Link>
          <ul className="nav-links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/categories">Catégories</Link></li>
            <li><Link to="/about">À propos</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
