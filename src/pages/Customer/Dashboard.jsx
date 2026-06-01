import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, 
  CreditCard, Shield, Plus, 
  History, Search, Eye, EyeOff 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data } = await api.get('/accounts/my');
      setAccounts(data);
    } catch (err) {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + parseFloat(curr.balance), 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Welcome back, {user?.username}</h1>
          <p>Here's what's happening with your money today.</p>
        </div>
        <button className="btn btn-secondary">
          <Plus size={18} /> New Account
        </button>
      </header>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Total Balance Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card" 
          style={{ 
            background: 'linear-gradient(135deg, #112240 0%, #0A192F 100%)',
            borderLeft: '4px solid var(--color-accent)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div className="badge badge-success">Total Balance</div>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            {showBalance ? `₹${totalBalance.toLocaleString()}` : '••••••••'}
          </h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-success)' }}>
            <ArrowUpRight size={16} /> +2.4% from last month
          </p>
        </motion.div>

        {/* Account Quick Views */}
        {accounts.map(acc => (
          <motion.div key={acc.id} whileHover={{ scale: 1.02 }} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--color-accent-soft)', padding: '8px', borderRadius: '12px', color: 'var(--color-accent)' }}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 style={{ marginBottom: '0' }}>{acc.account_type}</h3>
                  <p style={{ fontSize: '0.8rem' }}>**** {acc.account_number.slice(-4)}</p>
                </div>
              </div>
              <div className={`badge ${acc.status === 'ACTIVE' ? 'badge-success' : 'badge-error'}`}>
                {acc.status}
              </div>
            </div>
            <h2 style={{ marginBottom: '0' }}>
              {showBalance ? `₹${parseFloat(acc.balance).toLocaleString()}` : '••••••••'}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Transactions */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3>Recent Transactions</h3>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
              <History size={16} /> View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Placeholder for transactions */}
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: i % 2 === 0 ? 'rgba(100, 255, 218, 0.1)' : 'rgba(255, 100, 124, 0.1)', padding: '10px', borderRadius: '50%', color: i % 2 === 0 ? '#64FFDA' : '#FF647C' }}>
                    {i % 2 === 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 500 }}>{i % 2 === 0 ? 'Deposit' : 'Transfer to Rahul'}</h4>
                    <p style={{ fontSize: '0.8rem' }}>May 09, 2026</p>
                  </div>
                </div>
                <h4 style={{ color: i % 2 === 0 ? '#64FFDA' : '#FF647C' }}>
                  {i % 2 === 0 ? '+' : '-'} ₹{ (i * 1000).toLocaleString() }
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ background: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}>
            <h3>Security Center</h3>
            <p style={{ color: 'var(--color-bg-primary)', opacity: 0.8, marginBottom: '16px', fontSize: '0.9rem' }}>
              Your account is 85% secure. Complete your KYC to unlock full features.
            </p>
            <button 
              className="btn" 
              style={{ background: 'var(--color-bg-primary)', color: 'white', width: '100%' }}
              onClick={() => navigate('/kyc')}
            >
              <Shield size={18} /> Verify KYC
            </button>
          </div>

          <div className="glass-card">
            <h3>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flexDirection: 'column', padding: '16px' }}
                onClick={() => navigate('/transfer')}
              >
                <ArrowUpRight size={24} /> <span>Send</span>
              </button>
              <button className="btn btn-secondary" style={{ flexDirection: 'column', padding: '16px' }}>
                <ArrowDownLeft size={24} /> <span>Receive</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
