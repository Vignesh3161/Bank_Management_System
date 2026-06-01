import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { UserPlus, Edit, Trash2, Shield, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const StaffManagement = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data } = await apiService.admin.getStaff();
      setStaff(data);
    } catch (err) {
      toast.error('Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="card" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ color: '#0054a6', margin: 0 }}>Human Resource Management</h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>Manage bank staff, roles, and access permissions.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', gap: '10px' }} onClick={() => navigate('/admin/users/create')}>
          <UserPlus size={18} /> Add New Staff
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading staff data...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '12px' }}>Staff Name</th>
                <th style={{ padding: '12px' }}>Username / ID</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Branch</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{user.full_name || 'System Staff'}</td>
                  <td style={{ padding: '12px' }}>{user.username}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge" style={{ background: '#e7f0fd', color: '#0054a6' }}>{user.role}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{user.branch || 'Main HQ'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" style={{ padding: '5px' }} title="Edit Role">
                      <Shield size={14} />
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '5px' }} title="Send Notice">
                      <Mail size={14} />
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '5px', color: '#dc3545' }} title="Deactivate">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
