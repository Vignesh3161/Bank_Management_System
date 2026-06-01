import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { Landmark, Plus, Edit2, Trash2, Shield, Save, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBranch, setEditingBranch] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    branch_name: '',
    daily_limit: 1000000,
    upi_limit: 500000,
    teller_limit: 2000000,
    is_active: true
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await apiService.admin.listBranches();
      setBranches(res.data);
    } catch (err) {
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingBranch) {
        await apiService.admin.updateBranch(editingBranch.id, form);
        toast.success('Branch updated successfully');
      } else {
        await apiService.admin.createBranch(form);
        toast.success('Branch created successfully');
      }
      fetchBranches();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this branch?')) return;
    try {
      await apiService.admin.deleteBranch(id);
      toast.success('Branch deactivated');
      fetchBranches();
    } catch (err) {
      toast.error('Deactivation failed');
    }
  };

  const resetForm = () => {
    setForm({
      branch_name: '',
      daily_limit: 1000000,
      upi_limit: 500000,
      teller_limit: 2000000,
      is_active: true
    });
    setEditingBranch(null);
    setShowCreateForm(false);
  };

  const startEdit = (branch) => {
    setEditingBranch(branch);
    setForm({
      branch_name: branch.branch_name,
      daily_limit: branch.daily_limit,
      upi_limit: branch.upi_limit,
      teller_limit: branch.teller_limit,
      is_active: branch.is_active
    });
    setShowCreateForm(true);
  };

  return (
    <div className="page-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 className="text-gradient" style={{ margin: 0 }}>Branch Management</h1>
          <p className="text-muted">Register and configure bank branch networks.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => { resetForm(); setShowCreateForm(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Add New Branch
        </button>
      </div>

      {showCreateForm && (
        <div className="card fade-in" style={{ marginBottom: '30px', border: '1px solid var(--color-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>{editingBranch ? 'Edit Branch' : 'Register New Branch'}</h3>
            <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Branch Name</label>
              <input 
                className="input-field"
                value={form.branch_name}
                onChange={e => setForm({...form, branch_name: e.target.value})}
                placeholder="e.g. Mumbai Main HQ"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Daily Trans. Limit (₹)</label>
              <input 
                type="number"
                className="input-field"
                value={form.daily_limit}
                onChange={e => setForm({...form, daily_limit: parseFloat(e.target.value)})}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">UPI Limit (₹)</label>
              <input 
                type="number"
                className="input-field"
                value={form.upi_limit}
                onChange={e => setForm({...form, upi_limit: parseFloat(e.target.value)})}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Teller Limit (₹)</label>
              <input 
                type="number"
                className="input-field"
                value={form.teller_limit}
                onChange={e => setForm({...form, teller_limit: parseFloat(e.target.value)})}
                required
              />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {loading ? <Loader2 size={18} className="spin" /> : <><Save size={18} /> {editingBranch ? 'Update' : 'Register'}</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !branches.length ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Loader2 size={40} className="spin" style={{ color: 'var(--color-accent)' }} />
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {branches.map(branch => (
            <div key={branch.id} className="card hover-effect" style={{ 
              borderTop: '1px solid var(--color-border)',
              borderRight: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              borderLeft: `4px solid ${branch.is_active ? 'var(--color-success)' : '#ccc'}` 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#e7f0fd', padding: '10px', borderRadius: '8px', color: '#0054a6' }}>
                    <Landmark size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{branch.branch_name}</h3>
                    <code style={{ fontSize: '0.7rem', color: '#999' }}>{branch.id}</code>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button className="btn-icon" onClick={() => startEdit(branch)} title="Edit Config"><Edit2 size={16} /></button>
                  {branch.is_active && (
                    <button className="btn-icon text-danger" onClick={() => handleDeactivate(branch.id)} title="Deactivate Branch"><Trash2 size={16} /></button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <p className="text-muted" style={{ margin: '0 0 4px 0', fontSize: '0.7rem' }}>Daily Limit</p>
                  <span style={{ fontWeight: 600 }}>₹{parseFloat(branch.daily_limit).toLocaleString()}</span>
                </div>
                <div style={{ padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <p className="text-muted" style={{ margin: '0 0 4px 0', fontSize: '0.7rem' }}>UPI Limit</p>
                  <span style={{ fontWeight: 600 }}>₹{parseFloat(branch.upi_limit).toLocaleString()}</span>
                </div>
                <div style={{ padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <p className="text-muted" style={{ margin: '0 0 4px 0', fontSize: '0.7rem' }}>Teller Max</p>
                  <span style={{ fontWeight: 600 }}>₹{parseFloat(branch.teller_limit).toLocaleString()}</span>
                </div>
                <div style={{ padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '4px' }}>
                  <p className="text-muted" style={{ margin: '0 0 4px 0', fontSize: '0.7rem' }}>Status</p>
                  {branch.is_active ? 
                    <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Active</span> :
                    <span style={{ color: '#999', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} /> Inactive</span>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
