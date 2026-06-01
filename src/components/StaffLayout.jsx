import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SystemStatus from './SystemStatus';

const StaffLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavItems = (role) => {
    const items = [
      // Teller
      { name: 'Dashboard', path: '/teller/dashboard', roles: ['TELLER'] },
      { name: 'Customer Search', path: '/teller/search', roles: ['TELLER'] },
      { name: 'Process Deposit', path: '/teller/deposit', roles: ['TELLER'] },
      { name: 'Process Withdrawal', path: '/teller/withdraw', roles: ['TELLER'] },
      
      // Manager
      { name: 'Dashboard', path: '/manager/dashboard', roles: ['BRANCH_MANAGER'] },
      { name: 'Approvals', path: '/manager/approvals', roles: ['BRANCH_MANAGER'] },
      { name: 'Fraud Alerts', path: '/manager/fraud', roles: ['BRANCH_MANAGER'] },
      { name: 'Branch Config', path: '/manager/config', roles: ['BRANCH_MANAGER'] },
      { name: 'Reports', path: '/manager/reports', roles: ['BRANCH_MANAGER'] },

      // Auditor
      { name: 'Dashboard', path: '/auditor/dashboard', roles: ['AUDITOR'] },
      { name: 'Audit Logs', path: '/auditor/logs', roles: ['AUDITOR'] },
      { name: 'Verify Signatures', path: '/auditor/verify', roles: ['AUDITOR'] },
      { name: 'Reports', path: '/auditor/reports/ctr', roles: ['AUDITOR'] },

      // KYC
      { name: 'KYC Dashboard', path: '/kyc/dashboard', roles: ['KYC_OFFICER'] },
      { name: 'Pending Queue', path: '/kyc/pending', roles: ['KYC_OFFICER'] },
      { name: 'Expiry Mgmt', path: '/kyc/expiring', roles: ['KYC_OFFICER'] },

      // Admin
      { name: 'Admin Dashboard', path: '/admin/dashboard', roles: ['SYSTEM_ADMIN'] },
      { name: 'Staff Mgmt', path: '/admin/users', roles: ['SYSTEM_ADMIN'] },
      { name: 'Encryption Keys', path: '/admin/keys', roles: ['SYSTEM_ADMIN'] },
      { name: 'App Blueprint', path: '/admin/blueprint', roles: ['SYSTEM_ADMIN'] },
    ];
    return items.filter(item => item.roles.includes(role));
  };

  const navItems = getNavItems(user?.role);

  return (
    <div className="staff-portal">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <div className="logo-box">ACB</div>
            <div className="brand-text">
              <span className="name">CORE HQ</span>
              <span className="status">Command Center</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="staff-profile">
            <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <div className="info">
              <span className="username">{user?.username}</span>
              <span className="role">{user?.role?.replace('_', ' ')}</span>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-exit">
            Terminate Session
          </button>
        </div>
      </aside>

      <main className="main-viewport">
        <header className="viewport-header">
          <h1>{navItems.find(i => i.path === location.pathname)?.name || 'Command Center'}</h1>
          <div className="system-metrics" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <SystemStatus />
          </div>
        </header>
        <div className="viewport-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;
