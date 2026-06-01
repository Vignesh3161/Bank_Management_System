import React, { useState } from 'react';
import { Search, User, CreditCard } from 'lucide-react';
import apiService from '../../services/apiService';
import toast from 'react-hot-toast';

const AccountLookup = ({ onAccountFound }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const { data } = await apiService.accounts.search(query);
      if (data && data.length > 0) {
        onAccountFound(data[0]); // Select first match for now
        toast.success('Account Found');
      } else {
        toast.error('No account found');
      }
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ background: '#f8f9fa' }}>
      <h4 style={{ color: '#0054a6', marginBottom: '15px' }}>Customer Account Lookup</h4>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#adb5bd' }} />
          <input 
            className="input-field" 
            style={{ paddingLeft: '40px' }}
            placeholder="Account Number or Mobile"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default AccountLookup;
