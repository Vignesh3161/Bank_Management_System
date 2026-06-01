import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import TransferForm from '../../components/shared/TransferForm';
import TransactionTable from '../../components/shared/TransactionTable';
import toast from 'react-hot-toast';

const TransferMoney = () => {
  const [accounts, setAccounts] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: accs } = await apiService.accounts.getMyAccounts();
      setAccounts(accs);
      
      if (accs.length > 0) {
        const { data: txns } = await apiService.transactions.getHistory(accs[0].id);
        setRecentTxns(txns.slice(0, 5));
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
        <div>
          <TransferForm accounts={accounts} onSuccess={fetchData} />
        </div>
        
        <div>
          <div className="card">
            <h3 style={{ color: '#0054a6', marginBottom: '20px' }}>Recent Activity</h3>
            <TransactionTable transactions={recentTxns} loading={loading} />
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '20px' }}>
              View Full Statement
            </button>
          </div>

          <div className="card" style={{ marginTop: '20px', background: 'var(--color-secondary)', color: 'white' }}>
            <h4>Security Tip</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '10px' }}>
              The bank will never ask for your PIN or OTP over phone or email. 
              Always ensure you are using the official Digital Bank of India app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferMoney;
