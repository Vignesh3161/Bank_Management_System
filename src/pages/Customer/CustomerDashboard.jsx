import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRightLeft, History, ShieldCheck, 
  ExternalLink, CreditCard, Landmark, TrendingUp,
  ArrowUpRight, ArrowDownLeft, Plus, PlusCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data } = await apiService.accounts.getMyAccounts();
      setAccounts(data);
    } catch (err) {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      {/* Header Section */}
      <div style={{ 
        marginBottom: '40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ flex: '1', minWidth: '280px' }}>
          <h1 style={{ color: 'var(--color-text-dark)', margin: 0, fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px' }}>
            Welcome back, <span className="text-gradient">{accounts[0]?.customer_name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '8px 0 0', fontSize: '1rem', fontWeight: '500' }}>
            Here is what's happening with your accounts today.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary">
            <TrendingUp size={18} />
            <span>Markets</span>
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/customer/open-account')}>
            <Plus size={18} />
            <span>New Account</span>
          </button>
        </div>
      </div>

      {/* Account Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '20px', fontWeight: '600' }}>Preparing your financial dashboard...</p>
          </div>
        ) : accounts.length > 0 ? (
          accounts.map((acc, idx) => (
            <div key={acc.id} className="card" style={{ 
              border: 'none',
              background: idx === 0 ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' : 'white',
              color: idx === 0 ? 'white' : 'inherit',
              boxShadow: idx === 0 ? '0 20px 40px rgba(0, 82, 204, 0.2)' : 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {idx === 0 && (
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    padding: '10px', 
                    background: idx === 0 ? 'rgba(255,255,255,0.2)' : 'var(--color-primary-soft)',
                    borderRadius: '12px',
                    color: idx === 0 ? 'white' : 'var(--color-primary)'
                  }}>
                    <Landmark size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', opacity: idx === 0 ? 0.8 : 1, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {acc.account_type}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Active Account</h4>
                  </div>
                </div>
                <div className={`badge ${idx === 0 ? '' : 'badge-success'}`} style={{ background: idx === 0 ? 'rgba(255,255,255,0.2)' : '' }}>
                  {acc.status}
                </div>
              </div>

              <div style={{ marginBottom: '35px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '500', opacity: 0.8 }}>Current Balance</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '5px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>₹</span>
                  <h2 style={{ margin: 0, fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1px' }}>
                    {parseFloat(acc.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </h2>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: idx === 0 ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', opacity: 0.6 }}>Account Number</span>
                  <code style={{ fontSize: '1.1rem', fontWeight: '600', letterSpacing: '1px' }}>
                    •••• {acc.account_number.slice(-4)}
                  </code>
                </div>
                <button 
                  onClick={() => navigate(`/customer/accounts/${acc.id}`)}
                  className="btn" 
                  style={{ 
                    padding: '8px 16px', 
                    background: idx === 0 ? 'white' : 'var(--color-primary)',
                    color: idx === 0 ? 'var(--color-primary)' : 'white',
                    fontSize: '0.85rem'
                  }}
                >
                  Details <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}>
            <div style={{ marginBottom: '20px', color: 'var(--color-primary)' }}>
              <PlusCircle size={48} />
            </div>
            <h3>No active accounts found</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '25px' }}>Start your banking journey by opening a new account today.</p>
            <button className="btn btn-primary" onClick={() => navigate('/customer/open-account')}>
              Open Your First Account
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-text-dark)' }}>Quick Actions</h3>
          <Link to="/customer/services" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}>
            View All Services
          </Link>
        </div>
        
        <div className="action-grid">
          <Link to="/customer/transfer" className="action-card">
            <div className="action-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <ArrowRightLeft size={30} />
            </div>
            <span>Send Money</span>
          </Link>
          <Link to="/customer/transactions" className="action-card">
            <div className="action-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <History size={30} />
            </div>
            <span>Statement</span>
          </Link>
          <Link to="/customer/kyc" className="action-card">
            <div className="action-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <ShieldCheck size={30} />
            </div>
            <span>Verification</span>
          </Link>
          <Link to="/customer/accounts" className="action-card">
            <div className="action-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <CreditCard size={30} />
            </div>
            <span>My Cards</span>
          </Link>
          <Link to="/customer/transfer" className="action-card">
            <div className="action-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
              <ArrowDownLeft size={30} />
            </div>
            <span>Receive</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;
