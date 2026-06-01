import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Shield, Upload, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const KYCPage = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('PENDING'); // PENDING, SUBMITTED, VERIFIED, REJECTED
  const [form, setForm] = useState({ document_type: 'AADHAAR', document_content: '' });
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/kyc/submit', form);
      setStatus('SUBMITTED');
      toast.success('KYC documents submitted for review');
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <Shield size={48} color="var(--color-accent)" /> Identity Verification
        </h1>
        <p>Required by banking regulations to unlock all features.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        {/* Status Card */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3>Verification Status</h3>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '16px', 
            padding: '20px', borderRadius: '16px', 
            background: 'rgba(255,255,255,0.03)', marginTop: '16px' 
          }}>
            {status === 'VERIFIED' ? <CheckCircle color="var(--color-success)" size={32} /> : 
             status === 'SUBMITTED' ? <Loader2 className="spin" color="var(--color-warning)" size={32} /> :
             <AlertTriangle color="var(--color-text-dim)" size={32} />}
            <div>
              <h4 style={{ color: status === 'VERIFIED' ? 'var(--color-success)' : 'white' }}>{status}</h4>
              <p style={{ fontSize: '0.8rem' }}>
                {status === 'PENDING' ? 'Action required: Upload documents' : 
                 status === 'SUBMITTED' ? 'Review in progress (24-48h)' : 
                 'Identity successfully verified'}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="glass-card">
          <h3>Upload Documents</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
            <div className="input-group">
              <label className="input-label">Document Type</label>
              <select className="input-field" value={form.document_type} onChange={e => setForm({...form, document_type: e.target.value})}>
                <option value="AADHAAR">Aadhaar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="PASSPORT">Passport</option>
              </select>
            </div>
            
            <div style={{ 
              border: '2px dashed rgba(255,255,255,0.1)', 
              borderRadius: '16px', padding: '40px', 
              textAlign: 'center', marginBottom: '24px',
              cursor: 'pointer'
            }}>
              <Upload size={32} style={{ color: 'var(--color-text-dim)', marginBottom: '12px' }} />
              <p style={{ fontSize: '0.9rem' }}>Drag and drop files or click to browse</p>
              <p style={{ fontSize: '0.7rem', marginTop: '4px' }}>PDF, JPG, PNG (Max 5MB)</p>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading || status !== 'PENDING'}>
              {loading ? <Loader2 className="spin" /> : 'Submit for Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;
