import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, CreditCard, Send, History, 
  UserCheck, PlusCircle, Bell, User, LogOut 
} from 'lucide-react';
import SystemStatus from './SystemStatus';

const CustomerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Accounts', path: '/customer/accounts', icon: <CreditCard size={20} /> },
    { name: 'Transfer', path: '/customer/transfer', icon: <Send size={20} /> },
    { name: 'History', path: '/customer/transactions', icon: <History size={20} /> },
    { name: 'KYC', path: '/customer/kyc', icon: <UserCheck size={20} /> },
    { name: 'Open Account', path: '/customer/open-account', icon: <PlusCircle size={20} /> },
    { name: 'Notifications', path: '/customer/notifications', icon: <Bell size={20} /> },
    { name: 'Profile', path: '/customer/profile', icon: <User size={20} /> }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="portal-container customer-portal">
      <nav className="portal-nav">
        <div className="nav-brand">
          <div className="brand-logo">D</div>
          <div className="brand-text">
            <span className="brand-name">DIGITAL BANK</span>
            <span className="brand-sub">OF INDIA</span>
          </div>
        </div>

        <div className="nav-links">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{user?.full_name || user?.username}</span>
            <span className="user-role">Premium Customer</span>
          </div>
          <button onClick={handleLogout} className="btn-logout" title="Sign Out">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="portal-content">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
