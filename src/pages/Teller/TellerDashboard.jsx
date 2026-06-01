import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountLookup from '../../components/shared/AccountLookup';
import { User, Wallet, History, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const TellerDashboard = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <div className="page-container fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <AccountLookup onAccountFound={(acc) => setSelectedAccount(acc)} />
          
          {selectedAccount && (
            <div className="card fade-in" style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: '#e7f0fd', padding: '20px', borderRadius: '50%', color: '#0054a6' }}>
                  <User size={40} />
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>{selectedAccount.full_name || 'Customer Name'}</h2>
                  <p className="text-muted">A/c: {selectedAccount.account_number}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0 0 5px 0' }}>Current Balance</p>
                  <h3 style={{ margin: 0, color: '#28a745' }}>₹{parseFloat(selectedAccount.balance).toLocaleString()}</h3>
                </div>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0 0 5px 0' }}>Account Status</p>
                  <span className="badge badge-success">{selectedAccount.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card">
            <h3 style={{ color: '#0054a6', marginBottom: '20px' }}>Teller Operations</h3>
            {!selectedAccount ? (
              <p className="text-muted">Please search and select an account to perform operations.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <button className="btn btn-secondary" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }} onClick={() => navigate('/teller/deposit')}>
                  <ArrowDownCircle size={32} />
                  <span>Cash Deposit</span>
                </button>
                <button className="btn btn-secondary" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }} onClick={() => navigate('/teller/withdraw')}>
                  <ArrowUpCircle size={32} />
                  <span>Cash Withdrawal</span>
                </button>
                <button className="btn btn-secondary" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }} onClick={() => navigate(`/teller/accounts/${selectedAccount.id}`)}>
                  <History size={32} />
                  <span>Full History</span>
                </button>
                <button className="btn btn-secondary" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }} onClick={() => navigate('/kyc/dashboard')}>
                  <User size={32} />
                  <span>KYC Review</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TellerDashboard;
