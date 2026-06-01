import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SystemStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline'

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Use the baseURL's root or a specific health endpoint
        await fetch('http://localhost:5000/health'); 
        setStatus('online');
      } catch (err) {
        setStatus('offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '4px 10px',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: status === 'online' ? '#10b981' : status === 'offline' ? '#ef4444' : '#f59e0b',
      boxShadow: status === 'online' ? '0 0 8px #10b981' : 'none',
    }
  };

  return (
    <div style={styles.container} title={status === 'online' ? 'Backend Connected' : 'Backend Disconnected'}>
      <div style={styles.dot}></div>
      <span style={{ color: 'rgba(255,255,255,0.7)' }}>
        SYSTEM: {status.toUpperCase()}
      </span>
    </div>
  );
};

export default SystemStatus;
