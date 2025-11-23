import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import Categories from './pages/Categories';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import GenerateArticle from './pages/admin/GenerateArticle';
import ArticleList from './pages/admin/ArticleList';
import './styles/App.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div className="App">
                <Header />
                <main className="main-content">
                  <Home />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/article/:slug" element={
              <div className="App">
                <Header />
                <main className="main-content">
                  <ArticleDetail />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/categories" element={
              <div className="App">
                <Header />
                <main className="main-content">
                  <Categories />
                </main>
                <Footer />
              </div>
            } />

            {/* Admin Login */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="generate" element={<GenerateArticle />} />
              <Route path="articles" element={<ArticleList />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
