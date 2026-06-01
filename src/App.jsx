import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import CustomerLayout from './components/CustomerLayout';
import StaffLayout from './components/StaffLayout';

// --- Lazy Load Pages ---
// Public
const LandingHome = lazy(() => import('./pages/Public/LandingHome'));
const LoginPage = lazy(() => import('./pages/Public/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Public/RegisterPage'));
const VerifyOTPPage = lazy(() => import('./pages/Public/VerifyOTPPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Public/ForgotPasswordPage'));
const HelpDesk = lazy(() => import('./pages/Public/HelpDesk'));

// Customer
const CustomerDashboard = lazy(() => import('./pages/Customer/CustomerDashboard'));
const AccountDetails = lazy(() => import('./pages/Customer/AccountDetails'));
const TransferMoney = lazy(() => import('./pages/Customer/TransferMoney'));
const TransactionHistory = lazy(() => import('./pages/Customer/TransactionHistory'));
const OpenNewAccount = lazy(() => import('./pages/Customer/OpenNewAccount'));
const KYCSubmission = lazy(() => import('./pages/Customer/KYCSubmission'));
const ProfileSettings = lazy(() => import('./pages/Customer/ProfileSettings'));
const NotificationsPage = lazy(() => import('./pages/Customer/NotificationsPage'));

// Staff (Teller, Manager, Auditor, KYC, Admin)
const TellerDashboard = lazy(() => import('./pages/Teller/TellerDashboard'));
const ManagerDashboard = lazy(() => import('./pages/Manager/ManagerDashboard'));
const AuditorDashboard = lazy(() => import('./pages/Auditor/AuditorDashboard'));
const KYCReviewDashboard = lazy(() => import('./pages/KYC/KYCReviewDashboard'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const StaffManagement = lazy(() => import('./pages/Admin/StaffManagement'));
const CreateStaff = lazy(() => import('./pages/Admin/CreateStaff'));
const BranchManagement = lazy(() => import('./pages/Admin/BranchManagement'));
const BlueprintViewer = lazy(() => import('./pages/Admin/BlueprintViewer'));

// Shared
const NotFound = lazy(() => import('./pages/Shared/NotFound'));
const AccessDenied = lazy(() => import('./pages/Shared/AccessDenied'));

// Loading Placeholder
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--color-bg-page)' }}>
    <div className="spinner"></div>
  </div>
);

// --- Role Guard ---
const RoleGuard = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;

  // If roles are specified, check if user has one of them
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/403" />;
    }
  }

  const isStaff = ['TELLER', 'BRANCH_MANAGER', 'KYC_OFFICER', 'AUDITOR', 'SYSTEM_ADMIN'].includes(user.role);
  const Layout = isStaff ? StaffLayout : CustomerLayout;

  return (
    <Suspense fallback={<PageLoader />}>
      <Layout>{children}</Layout>
    </Suspense>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#112240', color: '#E6F1FF', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' },
        }} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Suspense fallback={<PageLoader />}><LandingHome /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>} />
          <Route path="/verify-otp" element={<Suspense fallback={<PageLoader />}><VerifyOTPPage /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense>} />
          <Route path="/help" element={<Suspense fallback={<PageLoader />}><HelpDesk /></Suspense>} />

          {/* Customer Routes */}
          <Route path="/customer/dashboard" element={<RoleGuard allowedRoles={['CUSTOMER']}><CustomerDashboard /></RoleGuard>} />
          <Route path="/customer/accounts" element={<RoleGuard allowedRoles={['CUSTOMER']}><AccountDetails /></RoleGuard>} />
          <Route path="/customer/accounts/:accountId" element={<RoleGuard allowedRoles={['CUSTOMER']}><AccountDetails /></RoleGuard>} />
          <Route path="/customer/transfer" element={<RoleGuard allowedRoles={['CUSTOMER']}><TransferMoney /></RoleGuard>} />
          <Route path="/customer/transactions" element={<RoleGuard allowedRoles={['CUSTOMER']}><TransactionHistory /></RoleGuard>} />
          <Route path="/customer/kyc" element={<RoleGuard allowedRoles={['CUSTOMER']}><KYCSubmission /></RoleGuard>} />
          <Route path="/customer/open-account" element={<RoleGuard allowedRoles={['CUSTOMER']}><OpenNewAccount /></RoleGuard>} />
          <Route path="/customer/notifications" element={<RoleGuard allowedRoles={['CUSTOMER']}><NotificationsPage /></RoleGuard>} />
          <Route path="/customer/profile" element={<RoleGuard allowedRoles={['CUSTOMER']}><ProfileSettings /></RoleGuard>} />
          
          {/* Staff Routes */}
          <Route path="/teller/dashboard" element={<RoleGuard allowedRoles={['TELLER']}><TellerDashboard /></RoleGuard>} />
          <Route path="/teller/search" element={<RoleGuard allowedRoles={['TELLER']}><TellerDashboard /></RoleGuard>} />
          <Route path="/teller/deposit" element={<RoleGuard allowedRoles={['TELLER']}><TellerDashboard /></RoleGuard>} />
          <Route path="/teller/withdraw" element={<RoleGuard allowedRoles={['TELLER']}><TellerDashboard /></RoleGuard>} />

          <Route path="/manager/dashboard" element={<RoleGuard allowedRoles={['BRANCH_MANAGER']}><ManagerDashboard /></RoleGuard>} />
          <Route path="/manager/approvals" element={<RoleGuard allowedRoles={['BRANCH_MANAGER']}><ManagerDashboard /></RoleGuard>} />
          <Route path="/manager/fraud" element={<RoleGuard allowedRoles={['BRANCH_MANAGER']}><ManagerDashboard /></RoleGuard>} />
          <Route path="/manager/config" element={<RoleGuard allowedRoles={['BRANCH_MANAGER']}><ManagerDashboard /></RoleGuard>} />
          <Route path="/manager/reports" element={<RoleGuard allowedRoles={['BRANCH_MANAGER']}><ManagerDashboard /></RoleGuard>} />

          <Route path="/auditor/dashboard" element={<RoleGuard allowedRoles={['AUDITOR']}><AuditorDashboard /></RoleGuard>} />
          <Route path="/auditor/logs" element={<RoleGuard allowedRoles={['AUDITOR']}><AuditorDashboard /></RoleGuard>} />
          <Route path="/auditor/verify" element={<RoleGuard allowedRoles={['AUDITOR']}><AuditorDashboard /></RoleGuard>} />
          <Route path="/auditor/reports/ctr" element={<RoleGuard allowedRoles={['AUDITOR']}><AuditorDashboard /></RoleGuard>} />

          <Route path="/kyc/dashboard" element={<RoleGuard allowedRoles={['KYC_OFFICER']}><KYCReviewDashboard /></RoleGuard>} />
          <Route path="/kyc/pending" element={<RoleGuard allowedRoles={['KYC_OFFICER']}><KYCReviewDashboard /></RoleGuard>} />
          <Route path="/kyc/expiring" element={<RoleGuard allowedRoles={['KYC_OFFICER']}><KYCReviewDashboard /></RoleGuard>} />

          <Route path="/admin/dashboard" element={<RoleGuard allowedRoles={['SYSTEM_ADMIN']}><AdminDashboard /></RoleGuard>} />
          <Route path="/admin/users" element={<RoleGuard allowedRoles={['SYSTEM_ADMIN']}><StaffManagement /></RoleGuard>} />
          <Route path="/admin/users/create" element={<RoleGuard allowedRoles={['SYSTEM_ADMIN']}><CreateStaff /></RoleGuard>} />
          <Route path="/admin/branches" element={<RoleGuard allowedRoles={['SYSTEM_ADMIN']}><BranchManagement /></RoleGuard>} />
          <Route path="/admin/keys" element={<RoleGuard allowedRoles={['SYSTEM_ADMIN']}><AdminDashboard /></RoleGuard>} />
          <Route path="/admin/blueprint" element={<RoleGuard allowedRoles={['SYSTEM_ADMIN']}><BlueprintViewer /></RoleGuard>} />

          {/* Shared / Error */}
          <Route path="/403" element={<Suspense fallback={<PageLoader />}><AccessDenied /></Suspense>} />
          <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
