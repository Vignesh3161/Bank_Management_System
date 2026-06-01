import api from './api';

const apiService = {
  // --- Auth Section ---
  auth: {
    login: (creds) => api.post('/auth/login', creds),
    verifyOtp: (data) => api.post('/auth/verify-otp', data),
    logout: () => api.post('/auth/logout'),
    register: (data) => api.post('/auth/register', data),
  },

  // --- Accounts Section ---
  accounts: {
    getMyAccounts: () => api.get('/accounts/my'),
    getAccountDetails: (id) => api.get(`/accounts/${id}`),
    openAccount: (data) => api.post('/accounts/open', data),
    getStatement: (id) => api.get(`/accounts/${id}/statement`),
    updateStatus: (id, status) => api.patch(`/accounts/${id}/status`, { status }),
    updateLimits: (id, limits) => api.put(`/accounts/${id}/limits`, limits),
    search: (query) => api.get(`/accounts/search?q=${query}`),
  },

  // --- Transactions Section ---
  transactions: {
    transfer: (data) => api.post('/transactions/transfer', data),
    deposit: (data) => api.post('/transactions/deposit', data),
    withdraw: (data) => api.post('/transactions/withdraw', data),
    getHistory: (accountId) => api.get(`/transactions/${accountId}/history`),
    getPendingApprovals: () => api.get('/transactions/pending-approval'),
    approve: (txnId) => api.post(`/transactions/${txnId}/approve`),
    reverse: (txnId) => api.post(`/transactions/${txnId}/reverse`),
    getDetails: (txnId) => api.get(`/transactions/${txnId}`),
  },

  // --- KYC Section ---
  kyc: {
    getStatus: () => api.get('/kyc/status'),
    getPending: () => api.get('/kyc/pending'),
    submit: (data) => api.post('/kyc/submit', data),
    review: (kycId, decision, comments) => api.post(`/kyc/${kycId}/review`, { decision, comments }),
    getDoc: (kycId) => api.get(`/kyc/${kycId}/document`),
  },

  // --- Admin Section ---
  admin: {
    getStaff: () => api.get('/admin/users'),
    createStaff: (data) => api.post('/admin/users/create', data),
    updateRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
    
    // Branches
    listBranches: () => api.get('/admin/branches'),
    createBranch: (data) => api.post('/admin/branches', data),
    updateBranch: (branchId, data) => api.put(`/admin/branches/${branchId}`, data),
    deleteBranch: (branchId) => api.delete(`/admin/branches/${branchId}`),
    
    getBranchConfig: (branchId) => api.get(`/admin/branches/${branchId}/config`),
    updateBranchConfig: (branchId, config) => api.put(`/admin/branches/${branchId}/config`, config),
  },

  // --- Audit & Security ---
  audit: {
    getLogs: (params) => api.get('/audit/logs', { params }),
    getStats: () => api.get('/audit/stats'),
  },

  fraud: {
    getAlerts: () => api.get('/fraud/alerts'),
    resolveAlert: (alertId, action) => api.post(`/fraud/alerts/${alertId}/resolve`, { action }),
  }
};

export default apiService;
