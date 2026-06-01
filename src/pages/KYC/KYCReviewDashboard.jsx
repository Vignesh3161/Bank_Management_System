import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const KYCReviewDashboard = () => {
  const [pendingKYC, setPendingKYC] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    try {
      const { data } = await apiService.kyc.getPending();
      setPendingKYC(data);
    } catch (err) {
      toast.error('Failed to load KYC queue');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, decision) => {
    try {
      await apiService.kyc.review(id, decision, 'Verified by Officer');
      toast.success(`KYC ${decision} successfully`);
      fetchKYC();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="card">
        <h3 style={{ color: '#0054a6', marginBottom: '20px' }}>KYC Verification Queue</h3>
        {loading ? (
          <p>Loading queue...</p>
        ) : pendingKYC.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '12px' }}>Customer Name</th>
                <th style={{ padding: '12px' }}>Document Type</th>
                <th style={{ padding: '12px' }}>Submitted On</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingKYC.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{item.full_name}</td>
                  <td style={{ padding: '12px' }}>{item.document_type}</td>
                  <td style={{ padding: '12px' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                      <Eye size={14} /> View
                    </button>
                    <button onClick={() => handleAction(item.id, 'APPROVED')} className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#28a745' }}>
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button onClick={() => handleAction(item.id, 'REJECTED')} className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#dc3545' }}>
                      <XCircle size={14} /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <CheckCircle size={48} color="#28a745" style={{ opacity: 0.3, marginBottom: '15px' }} />
            <p className="text-muted">No pending KYC applications in queue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCReviewDashboard;
