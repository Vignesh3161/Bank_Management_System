import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Send, Shield, Settings, LogOut, Landmark } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} />, roles: ['CUSTOMER'] },
    { label: 'Transfer', path: '/transfer', icon: <Send size={18} />, roles: ['CUSTOMER'] },
    { label: 'KYC', path: '/kyc', icon: <Shield size={18} />, roles: ['CUSTOMER'] },
    { label: 'Staff Panel', path: '/admin', icon: <Settings size={18} />, roles: ['TELLER', 'BRANCH_MANAGER', 'AUDITOR', 'SYSTEM_ADMIN'] },
  ];

  return (
    <nav className="glass" style={{ 
      margin: '16px 24px', 
      padding: '12px 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: '16px',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Landmark color="var(--color-accent)" size={24} />
        <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>Core<span style={{ color: 'var(--color-accent)' }}>Bank</span></span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {navItems.filter(item => item.roles.includes(user.role)).map(item => (
          <NavLink 
            key={item.path} 
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'var(--transition-fast)',
              color: isActive ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
              background: isActive ? 'var(--color-accent)' : 'transparent',
            })}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.username}</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>{user.role}</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ 
            background: 'rgba(255,100,124,0.1)', 
            color: '#FF647C', 
            border: 'none', 
            padding: '8px', 
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
