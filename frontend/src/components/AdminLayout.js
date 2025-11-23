import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Admin.css';

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '8px 0 0 0' }}>
            {user?.username}
          </p>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? 'admin-nav-link active' : 'admin-nav-link'
            }
          >
            <span>📊</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/generate"
            className={({ isActive }) =>
              isActive ? 'admin-nav-link active' : 'admin-nav-link'
            }
          >
            <span>✨</span>
            Générer Article IA
          </NavLink>

          <NavLink
            to="/admin/articles"
            className={({ isActive }) =>
              isActive ? 'admin-nav-link active' : 'admin-nav-link'
            }
          >
            <span>📋</span>
            Gérer Articles
          </NavLink>

          <NavLink
            to="/"
            className="admin-nav-link"
          >
            <span>🏠</span>
            Voir le Blog
          </NavLink>
        </nav>

        <div className="admin-logout">
          <button onClick={handleLogout}>
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
