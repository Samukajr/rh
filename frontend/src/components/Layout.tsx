import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/employees', label: 'Funcionários', icon: '👥' },
    { path: '/time-tracking', label: 'Ponto Eletrônico', icon: '⏰' },
    { path: '/leave-requests', label: 'Solicitações de Férias', icon: '🏖️' },
    { path: '/medical-certificates', label: 'Atestados Médicos', icon: '🏥' },
    { path: '/payslips', label: 'Folhas de Pagamento', icon: '💰' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="header-title">RH Plus</h1>
        </div>
        
        <div className="header-right">
          <div className="user-menu">
            <button className="user-button" onClick={toggleProfileMenu}>
              <div className="user-avatar">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {profileMenuOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <div className="profile-name">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="profile-email">{user?.email}</div>
                  <div className="profile-role">{user?.role}</div>
                </div>
                <div className="profile-divider"></div>
                <button onClick={handleLogout} className="logout-button">
                  <span className="logout-icon">🚪</span>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="layout-body">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`nav-item ${isActivePath(item.path) ? 'nav-item-active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;