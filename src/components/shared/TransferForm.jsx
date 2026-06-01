import React, { useState } from 'react';
import apiService from '../../services/apiService';
import toast from 'react-hot-toast';
import { Send, AlertCircle } from 'lucide-react';

const TransferForm = ({ accounts, onSuccess }) => {
  const [formData, setFormData] = useState({
    from_account: '',
    to_account: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.from_account || !formData.to_account || !formData.amount) {
      return toast.error('Please fill all required fields');
    }

    setLoading(true);
    try {
      await apiService.transactions.transfer(formData);
      toast.success('Transfer Successful');
      setFormData({ from_account: '', to_account: '', amount: '', description: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ color: '#0054a6', marginBottom: '20px' }}>Initiate Fund Transfer</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label className="input-label" style={{ fontWeight: '700' }}>From Account</label>
          <select 
            className="input-field"
            value={formData.from_account}
            onChange={(e) => setFormData({...formData, from_account: e.target.value})}
          >
            <option value="">Select Account</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.account_type} - {acc.account_number} (Bal: ₹{parseFloat(acc.balance).toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label className="input-label" style={{ fontWeight: '700' }}>To Account Number / Beneficiary</label>
          <input 
            className="input-field"
            placeholder="Enter destination account number"
            value={formData.to_account}
            onChange={(e) => setFormData({...formData, to_account: e.target.value})}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label className="input-label" style={{ fontWeight: '700' }}>Amount (₹)</label>
          <input 
            className="input-field"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label className="input-label" style={{ fontWeight: '700' }}>Description (Optional)</label>
          <input 
            className="input-field"
            placeholder="e.g. Rent, Gift, etc."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '25px', display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
          <AlertCircle size={18} color="#ff9933" />
          <span>Double check the account number. Transfers are instantaneous and irreversible.</span>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '15px' }} disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Transfer'}
        </button>
      </form>
    </div>
  );
};

export default TransferForm;
