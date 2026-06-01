const fs = require('fs');
const path = require('path');

const SCREENS = [
  { id:1, group:"Public", name:"LandingHome", route:"/", roles:["Public"], folder: "Public" },
  { id:2, group:"Public", name:"RegisterPage", route:"/register", roles:["Public"], folder: "Public" },
  { id:3, group:"Public", name:"LoginPage", route:"/login", roles:["Public"], folder: "Public" },
  { id:4, group:"Public", name:"VerifyOTPPage", route:"/verify-otp", roles:["Public"], folder: "Public" },
  { id:5, group:"Public", name:"ForgotPasswordPage", route:"/forgot-password", roles:["Public"], folder: "Public" },
  { id:6, group:"Customer", name:"CustomerDashboard", route:"/customer/dashboard", roles:["CUSTOMER"], folder: "Customer" },
  { id:7, group:"Customer", name:"AccountDetails", route:"/customer/accounts/:accountId", roles:["CUSTOMER"], folder: "Customer" },
  { id:8, group:"Customer", name:"TransferMoney", route:"/customer/transfer", roles:["CUSTOMER"], folder: "Customer" },
  { id:9, group:"Customer", name:"TransactionHistory", route:"/customer/transactions", roles:["CUSTOMER"], folder: "Customer" },
  { id:10, group:"Customer", name:"TransactionDetail", route:"/customer/transactions/:txnId", roles:["CUSTOMER"], folder: "Customer" },
  { id:11, group:"Customer", name:"AccountStatement", route:"/customer/statement", roles:["CUSTOMER"], folder: "Customer" },
  { id:12, group:"Customer", name:"OpenNewAccount", route:"/customer/open-account", roles:["CUSTOMER"], folder: "Customer" },
  { id:13, group:"Customer", name:"KYCSubmission", route:"/customer/kyc", roles:["CUSTOMER"], folder: "Customer" },
  { id:14, group:"Customer", name:"ProfileSettings", route:"/customer/profile", roles:["CUSTOMER"], folder: "Customer" },
  { id:15, group:"Customer", name:"NotificationsPage", route:"/customer/notifications", roles:["CUSTOMER"], folder: "Customer" },
  { id:16, group:"Teller", name:"TellerDashboard", route:"/teller/dashboard", roles:["TELLER"], folder: "Teller" },
  { id:17, group:"Teller", name:"CustomerSearch", route:"/teller/search", roles:["TELLER"], folder: "Teller" },
  { id:18, group:"Teller", name:"TellerAccountView", route:"/teller/accounts/:accountId", roles:["TELLER"], folder: "Teller" },
  { id:19, group:"Teller", name:"ProcessDeposit", route:"/teller/deposit", roles:["TELLER"], folder: "Teller" },
  { id:20, group:"Teller", name:"ProcessWithdrawal", route:"/teller/withdraw", roles:["TELLER"], folder: "Teller" },
  { id:21, group:"Manager", name:"ManagerDashboard", route:"/manager/dashboard", roles:["BRANCH_MANAGER"], folder: "Manager" },
  { id:22, group:"Manager", name:"PendingApprovals", route:"/manager/approvals", roles:["BRANCH_MANAGER"], folder: "Manager" },
  { id:23, group:"Manager", name:"AccountStatusManagement", route:"/manager/accounts/:accountId/status", roles:["BRANCH_MANAGER"], folder: "Manager" },
  { id:24, group:"Manager", name:"SetAccountLimits", route:"/manager/accounts/:accountId/limits", roles:["BRANCH_MANAGER"], folder: "Manager" },
  { id:25, group:"Manager", name:"BranchReports", route:"/manager/reports", roles:["BRANCH_MANAGER"], folder: "Manager" },
  { id:26, group:"Manager", name:"ReverseTransaction", route:"/manager/transactions/:txnId/reverse", roles:["BRANCH_MANAGER"], folder: "Manager" },
  { id:27, group:"Manager", name:"FraudAlertsReview", route:"/manager/fraud", roles:["BRANCH_MANAGER"], folder: "Manager" },
  { id:28, group:"Manager", name:"UpdateBranchConfig", route:"/manager/config", roles:["BRANCH_MANAGER"], folder: "Manager" },
  { id:29, group:"Auditor", name:"AuditorDashboard", route:"/auditor/dashboard", roles:["AUDITOR"], folder: "Auditor" },
  { id:30, group:"Auditor", name:"AuditLogExplorer", route:"/auditor/logs", roles:["AUDITOR"], folder: "Auditor" },
  { id:31, group:"Auditor", name:"EntityHistory", route:"/auditor/logs/:entityId", roles:["AUDITOR"], folder: "Auditor" },
  { id:32, group:"Auditor", name:"SignatureVerification", route:"/auditor/verify", roles:["AUDITOR"], folder: "Auditor" },
  { id:33, group:"Auditor", name:"GapDetection", route:"/auditor/gap-check", roles:["AUDITOR"], folder: "Auditor" },
  { id:34, group:"Auditor", name:"CTRReport", route:"/auditor/reports/ctr", roles:["AUDITOR"], folder: "Auditor" },
  { id:35, group:"Auditor", name:"STRReport", route:"/auditor/reports/str", roles:["AUDITOR"], folder: "Auditor" },
  { id:36, group:"KYC", name:"KYCReviewDashboard", route:"/kyc/dashboard", roles:["KYC_OFFICER"], folder: "KYC" },
  { id:37, group:"KYC", name:"KYCPendingQueue", route:"/kyc/pending", roles:["KYC_OFFICER"], folder: "KYC" },
  { id:38, group:"KYC", name:"KYCDocReview", route:"/kyc/:kycId/review", roles:["KYC_OFFICER"], folder: "KYC" },
  { id:39, group:"KYC", name:"KYCExpiryManagement", route:"/kyc/expiring", roles:["KYC_OFFICER"], folder: "KYC" },
  { id:40, group:"Admin", name:"AdminDashboard", route:"/admin/dashboard", roles:["SYSTEM_ADMIN"], folder: "Admin" },
  { id:41, group:"Admin", name:"StaffManagement", route:"/admin/users", roles:["SYSTEM_ADMIN"], folder: "Admin" },
  { id:42, group:"Admin", name:"CreateStaff", route:"/admin/users/create", roles:["SYSTEM_ADMIN"], folder: "Admin" },
  { id:43, group:"Admin", name:"ChangeRole", route:"/admin/users/:userId/role", roles:["SYSTEM_ADMIN"], folder: "Admin" },
  { id:44, group:"Admin", name:"RevokeSessions", route:"/admin/users/:userId/revoke", roles:["SYSTEM_ADMIN"], folder: "Admin" },
  { id:45, group:"Admin", name:"BranchConfigAdmin", route:"/admin/branches/:branchId/config", roles:["SYSTEM_ADMIN"], folder: "Admin" },
  { id:46, group:"Admin", name:"EncryptionKeys", route:"/admin/keys", roles:["SYSTEM_ADMIN"], folder: "Admin" },
  { id:47, group:"Shared", name:"ChangePassword", route:"/settings/change-password", roles:[], folder: "Shared" },
  { id:48, group:"Shared", name:"ActiveSessions", route:"/settings/sessions", roles:[], folder: "Shared" },
  { id:49, group:"Shared", name:"NotFound", route:"/*", roles:[], folder: "Shared" },
  { id:50, group:"Shared", name:"AccessDenied", route:"/403", roles:[], folder: "Shared" }
];

const template = (name, group) => `import React from 'react';

const ${name} = () => {
  return (
    <div className="page-container fade-in">
      <div className="glass card">
        <h1 className="text-gradient">${name.replace(/([A-Z])/g, ' $1').trim()}</h1>
        <p className="text-secondary">This is the ${group} screen for ${name.replace(/([A-Z])/g, ' $1').trim()}.</p>
        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ color: 'var(--color-accent)', marginBottom: '10px' }}>Screen Features</h3>
          <ul style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <li>Role-based access enforced</li>
            <li>Immutable audit logging active</li>
            <li>Security: Replay protection & Rate limiting enabled</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ${name};
`;

const baseDir = path.join(__dirname, 'src', 'pages');

SCREENS.forEach(screen => {
    const filePath = path.join(baseDir, screen.folder, `${screen.name}.jsx`);
    fs.writeFileSync(filePath, template(screen.name, screen.group));
    console.log(`Generated: ${filePath}`);
});
