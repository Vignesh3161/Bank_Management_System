import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { Users, Shield, Database, Activity, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, logs: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // In a real scenario, we might have a specific stats endpoint
      const { data: users } = await apiService.admin.getStaff();
      setStats({
        users: users.length,
        logs: 'Live',
        alerts: '0 Active'
      });
    } catch (err) {
      toast.error('Failed to load admin metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: '#e7f0fd', padding: '15px', borderRadius: '8px', color: '#0054a6' }}>
            <Users size={28} />
          </div>
          <div>
            <h4 className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>Staff Members</h4>
            <h2 style={{ margin: 0 }}>{stats.users}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: '#fff4e5', padding: '15px', borderRadius: '8px', color: '#ff9933' }}>
            <Shield size={28} />
          </div>
          <div>
            <h4 className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>Security Status</h4>
            <h2 style={{ margin: 0 }}>Active</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: '#eafaf1', padding: '15px', borderRadius: '8px', color: '#28a745' }}>
            <Database size={28} />
          </div>
          <div>
            <h4 className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>Audit Trail</h4>
            <h2 style={{ margin: 0 }}>{stats.logs}</h2>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#0054a6' }}>System Management</h3>
          <Activity size={20} color="#6c757d" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button className="btn btn-secondary" style={{ textAlign: 'left', padding: '15px' }} onClick={() => navigate('/admin/users')}>Manage Staff Users</button>
          <button className="btn btn-secondary" style={{ textAlign: 'left', padding: '15px' }} onClick={() => navigate('/admin/branches')}>Branch Configurations</button>
          <button className="btn btn-secondary" style={{ textAlign: 'left', padding: '15px' }} onClick={() => navigate('/admin/keys')}>Encryption Key Management</button>
          <button className="btn btn-secondary" style={{ textAlign: 'left', padding: '15px' }} onClick={() => navigate('/admin/blueprint')}>App Blueprint Viewer</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
