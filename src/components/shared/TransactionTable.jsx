import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const TransactionTable = ({ transactions, loading }) => {
  if (loading) return <div className="text-muted" style={{ padding: '20px', textAlign: 'center' }}>Loading transactions...</div>;
  if (!transactions || transactions.length === 0) return <div className="text-muted" style={{ padding: '20px', textAlign: 'center' }}>No recent transactions found.</div>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th style={{ padding: '12px', color: '#666' }}>Type</th>
            <th style={{ padding: '12px', color: '#666' }}>Description</th>
            <th style={{ padding: '12px', color: '#666' }}>Date</th>
            <th style={{ padding: '12px', color: '#666', textAlign: 'right' }}>Amount</th>
            <th style={{ padding: '12px', color: '#666' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '12px' }}>
                {txn.type === 'DEBIT' ? (
                  <div style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ArrowUpRight size={16} /> DR
                  </div>
                ) : (
                  <div style={{ color: '#28a745', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ArrowDownLeft size={16} /> CR
                  </div>
                )}
              </td>
              <td style={{ padding: '12px', fontWeight: '500' }}>{txn.description || 'Inter-account Transfer'}</td>
              <td style={{ padding: '12px', color: '#666' }}>{new Date(txn.created_at).toLocaleDateString()}</td>
              <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: txn.type === 'DEBIT' ? '#dc3545' : '#28a745' }}>
                {txn.type === 'DEBIT' ? '-' : '+'}₹{parseFloat(txn.amount).toLocaleString()}
              </td>
              <td style={{ padding: '12px' }}>
                <span className={`badge ${txn.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                  {txn.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
