import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { UserPlus, Shield, Landmark, Key, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateStaff = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'TELLER',
    branch_id: 1
  });

  const roles = [
    { value: 'TELLER', label: 'Bank Teller (Cash Operations)' },
    { value: 'BRANCH_MANAGER', label: 'Branch Manager (Approvals)' },
    { value: 'AUDITOR', label: 'System Auditor (Read-only)' },
    { value: 'KYC_OFFICER', label: 'KYC Verification Officer' },
    { value: 'SYSTEM_ADMIN', label: 'System Administrator (HQ)' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.admin.createStaff(form);
      toast.success('Staff member created successfully');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create staff member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/admin/users')} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '20px' }}
        >
          <ArrowLeft size={16} /> Back to Staff List
        </button>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <div style={{ background: '#e7f0fd', padding: '12px', borderRadius: '8px', color: '#0054a6' }}>
              <UserPlus size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>Onboard New Staff</h2>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Assign roles and credentials to bank employees.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <Shield size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input 
                  className="input-field"
                  style={{ paddingLeft: '40px', width: '100%' }}
                  placeholder="e.g. j.doe_teller"
                  required
                  value={form.username}
                  onChange={e => setForm({...form, username: e.target.value})}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Password (Temporary)</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input 
                  type="password"
                  className="input-field"
                  style={{ paddingLeft: '40px', width: '100%' }}
                  placeholder="Leave empty for auto-generated"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>System Role</label>
                <select 
                  className="input-field"
                  style={{ width: '100%' }}
                  value={form.role}
                  onChange={e => setForm({...form, role: e.target.value})}
                >
                  {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Branch ID</label>
                <div style={{ position: 'relative' }}>
                  <Landmark size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                  <input 
                    type="number"
                    className="input-field"
                    style={{ paddingLeft: '40px', width: '100%' }}
                    value={form.branch_id}
                    onChange={e => setForm({...form, branch_id: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div style={{ background: '#fff4e5', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', gap: '12px' }}>
              <Shield size={20} color="#ff9933" />
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#663c00', lineHeight: '1.4' }}>
                <strong>Security Policy:</strong> New staff members will be forced to change their password on first login. Ensure they are assigned to the correct branch for audit tracking.
              </p>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
              disabled={loading}
            >
              {loading ? <Loader2 size={18} className="spin" /> : <><UserPlus size={18} /> Create Staff Account</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStaff;
