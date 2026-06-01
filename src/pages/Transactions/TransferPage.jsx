import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Send, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TransferPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    reason: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data } = await api.get('/accounts/my');
      setAccounts(data);
      if (data.length > 0) setForm(prev => ({ ...prev, fromAccountId: data[0].id }));
    } catch (err) {
      toast.error('Failed to load accounts');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/transactions/transfer', form);
      setStep(3);
      toast.success('Transfer successful');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '24px', border: 'none' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '8px' }}>Send Money</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ 
                width: '32px', height: '4px', 
                borderRadius: '2px',
                background: step >= i ? 'var(--color-accent)' : 'var(--color-bg-secondary)'
              }} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="input-group">
                <label className="input-label">Select Source Account</label>
                <select 
                  className="input-field"
                  value={form.fromAccountId}
                  onChange={e => setForm({ ...form, fromAccountId: e.target.value })}
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_type} - ****{acc.account_number.slice(-4)} (₹{parseFloat(acc.balance).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Recipient Account Number</label>
                <input 
                  className="input-field"
                  type="text"
                  placeholder="Enter 12-digit account number"
                  value={form.toAccountId}
                  onChange={e => setForm({ ...form, toAccountId: e.target.value })}
                />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(2)}>
                Next Step <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="input-group">
                <label className="input-label">Amount (₹)</label>
                <input 
                  className="input-field"
                  type="number"
                  placeholder="0.00"
                  style={{ fontSize: '1.5rem' }}
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Note (Optional)</label>
                <input 
                  className="input-field"
                  type="text"
                  placeholder="E.g. Rent, Gift"
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={handleTransfer} disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm Send'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--color-success)', marginBottom: '16px' }}>
                <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
              </div>
              <h3>Transaction Successful</h3>
              <p style={{ marginBottom: '24px' }}>₹{parseFloat(form.amount).toLocaleString()} has been sent successfully.</p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/')}>
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransferPage;
