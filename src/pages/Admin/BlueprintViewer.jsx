import { useState } from "react";

const ROLES = ["ALL","CUSTOMER","TELLER","BRANCH_MANAGER","AUDITOR","KYC_OFFICER","SYSTEM_ADMIN"];

const ROLE_STYLE = {
  CUSTOMER:       { bg:"#EEEDFE", text:"#3C3489", border:"#CECBF6" },
  TELLER:         { bg:"#E1F5EE", text:"#085041", border:"#9FE1CB" },
  BRANCH_MANAGER: { bg:"#FAEEDA", text:"#633806", border:"#FAC775" },
  AUDITOR:        { bg:"#F1EFE8", text:"#444441", border:"#CFCCC0" },
  KYC_OFFICER:    { bg:"#FAECE7", text:"#712B13", border:"#F5C4B3" },
  SYSTEM_ADMIN:   { bg:"#FCF0F0", text:"#791F1F", border:"#F5BFBF" },
  Public:         { bg:"#EAF3DE", text:"#27500A", border:"#B4D98C" },
};

const SCREENS = [
  // ─────────────────────────────────────────────
  // PUBLIC (no login needed)
  // ─────────────────────────────────────────────
  {
    id:1, group:"Public", name:"Landing / Home",
    route:"/",
    roles:["Public"],
    desc:"Bank's public homepage — about the bank, account types, features, CTA to register or login.",
    components:["Hero banner","Account types comparison","Features section","Register / Login buttons"],
    apis:[],
    notes:"No authentication needed. React Router redirects logged-in users away from this page.",
    status:"Implemented"
  },
  {
    id:2, group:"Public", name:"Register",
    route:"/register",
    roles:["Public"],
    desc:"New customer self-registration form. Collects name, mobile, email, DOB, password. Submits to POST /api/auth/register.",
    components:["Multi-step form (Step 1: personal, Step 2: contact, Step 3: password)","Strength meter for password","Mobile OTP verification before submission","Terms & conditions checkbox","Submit button with loading state"],
    apis:["POST /api/auth/register"],
    notes:"After successful registration customer is redirected to KYC screen. Account cannot open until KYC done.",
    status:"Placeholder"
  },
  {
    id:3, group:"Public", name:"Login",
    route:"/login",
    roles:["Public"],
    desc:"Step 1 of 2FA login — username + password. On success shows OTP input screen.",
    components:["Username field","Password field with show/hide toggle","Login button","Forgot password link","Error message (wrong credentials)","Account locked message after 5 failures"],
    apis:["POST /api/auth/login"],
    notes:"Rate limited 5 attempts per 15 min. After 5 failures shows 'Account locked' message with contact info.",
    status:"Implemented"
  },
  {
    id:4, group:"Public", name:"OTP Verification",
    route:"/verify-otp",
    roles:["Public"],
    desc:"Step 2 of 2FA login — enter 6-digit TOTP OTP sent via SMS. Completes login and issues JWT.",
    components:["6-digit OTP input (auto-focus each box)","30-second countdown timer","Resend OTP button (active after 30s)","Back to login link","Error: wrong OTP / expired OTP"],
    apis:["POST /api/auth/verify-otp"],
    notes:"OTP expires in 30 seconds. After 3 wrong OTP entries, this OTP is invalidated — must request a new one.",
    status:"Placeholder"
  },
  {
    id:5, group:"Public", name:"Forgot Password",
    route:"/forgot-password",
    roles:["Public"],
    desc:"Enter registered mobile number → OTP sent → enter new password. Resets forgotten password.",
    components:["Mobile number input","OTP input (after mobile submitted)","New password + confirm password fields","Password strength indicator","Success message → redirect to login"],
    apis:["POST /api/auth/forgot-password","POST /api/auth/reset-password"],
    notes:"Server returns same response whether mobile found or not — prevents mobile number enumeration.",
    status:"Placeholder"
  },

  // ─────────────────────────────────────────────
  // CUSTOMER SCREENS
  // ─────────────────────────────────────────────
  {
    id:6, group:"Customer", name:"Customer Dashboard",
    route:"/customer/dashboard",
    roles:["CUSTOMER"],
    desc:"Main home screen after login. Shows all accounts, recent transactions, quick actions.",
    components:["Account cards (balance, account number, type)","Recent 5 transactions list","Quick action buttons: Transfer, Pay, Statement","Total balance across all accounts","Notification bell with unread count","KYC status banner if not verified"],
    apis:["GET /api/accounts/my","GET /api/transactions/:id/history"],
    notes:"If KYC status = PENDING, show prominent banner directing to KYC submission. Transfer button disabled until KYC verified.",
    status:"Implemented"
  },
  {
    id:7, group:"Customer", name:"Account Details",
    route:"/customer/accounts/:accountId",
    roles:["CUSTOMER"],
    desc:"Full details of one specific account — balance, limits, account info, linked nominee.",
    components:["Account number (copy button)","IFSC code (copy button)","Current balance (toggle show/hide)","Account type badge","Daily limit remaining bar","Nominee details","Account status badge (Active/Frozen)","Action buttons: Transfer, Withdraw request, Statement"],
    apis:["GET /api/accounts/:accountId","GET /api/accounts/:accountId/balance"],
    notes:"Balance hidden by default — tap eye icon to reveal. IDOR prevented: can only see own accounts.",
    status:"Placeholder"
  },
  {
    id:8, group:"Customer", name:"Transfer Money",
    route:"/customer/transfer",
    roles:["CUSTOMER"],
    desc:"Initiate a money transfer to another account. Multi-step: enter details → review → OTP confirm → success.",
    components:["Step 1: From account selector, To account number input, Amount, Description","Step 2: Review screen (show all details before confirm)","Step 3: OTP confirmation input","Step 4: Success screen with transaction ID and download receipt","Saved payees list","Daily limit remaining indicator"],
    apis:["POST /api/transactions/transfer","POST /api/auth/verify-otp (for transaction OTP)"],
    notes:"Transfer above ₹25,000 requires OTP re-verification. Nonce sent in every request header for replay prevention.",
    status:"Implemented"
  },
  {
    id:9, group:"Customer", name:"Transaction History",
    route:"/customer/transactions",
    roles:["CUSTOMER"],
    desc:"Full paginated transaction history with filters — all transactions for all accounts.",
    components:["Date range picker filter","Transaction type filter (all/credit/debit)","Account filter (if multiple accounts)","Transaction rows with: date, type badge, description, amount (green/red), running balance","Pagination / infinite scroll","Download statement button","Search by description or amount"],
    apis:["GET /api/transactions/:accountId/history"],
    notes:"Cursor-based pagination — no offset. Each transaction shows ledger entry type (DEBIT/CREDIT) with colour coding.",
    status:"Placeholder"
  },
  {
    id:10, group:"Customer", name:"Transaction Detail",
    route:"/customer/transactions/:txnId",
    roles:["CUSTOMER"],
    desc:"Full details of a single transaction — amounts, accounts, channel, timestamp, reference number.",
    components:["Transaction ID (copy)","Date and time","From/To account numbers","Amount","Transaction type and channel badge","Status badge (Completed/Failed/Reversed)","Reference/UTR number","Download receipt button"],
    apis:["GET /api/transactions/:txnId"],
    notes:"Reference/UTR number used for dispute resolution with other banks. Receipt is a PDF with bank letterhead.",
    status:"Placeholder"
  },
  {
    id:11, group:"Customer", name:"Account Statement",
    route:"/customer/statement",
    roles:["CUSTOMER"],
    desc:"Download formal bank statement for a selected date range as PDF.",
    components:["Account selector","Date range picker (from / to)","Statement format selector (PDF / CSV)","Preview summary: opening balance, closing balance, total debits, credits","Download button","Email statement option"],
    apis:["GET /api/accounts/:accountId/statement"],
    notes:"PDF includes bank letterhead, account holder name, all transactions with running balance. Uses ledger_entries balance_after for running balance.",
    status:"Placeholder"
  },
  {
    id:12, group:"Customer", name:"Open New Account",
    route:"/customer/open-account",
    roles:["CUSTOMER"],
    desc:"Open an additional account (savings/current/FD). Only available if KYC is VERIFIED.",
    components:["Account type selector with comparison (Savings vs Current vs FD)","Initial deposit amount input","Nominee details form","Terms acceptance checkbox","Submit — account number generated instantly on success","Success screen with new account number and IFSC"],
    apis:["POST /api/accounts/open"],
    notes:"Disabled if kyc_status !== VERIFIED. FD accounts show tenure and interest rate calculator.",
    status:"Placeholder"
  },
  {
    id:13, group:"Customer", name:"KYC Submission",
    route:"/customer/kyc",
    roles:["CUSTOMER"],
    desc:"Upload Aadhaar, PAN, and selfie for KYC verification. Shows current KYC status.",
    components:["Current KYC status banner (Pending/Verified/Rejected/Expired)","Aadhaar upload (front + back)","PAN card upload","Live selfie capture (camera — not gallery picker)","Upload progress indicators","Rejection reason display if rejected","Re-upload option if rejected","Expiry countdown if near expiry"],
    apis:["POST /api/kyc/submit","GET /api/kyc/status"],
    notes:"Selfie must be live capture — no file picker for selfie (prevents photo spoofing). Files encrypted server-side before storage.",
    status:"Implemented"
  },
  {
    id:14, group:"Customer", name:"Profile & Settings",
    route:"/customer/profile",
    roles:["CUSTOMER"],
    desc:"View and update personal profile, change password, manage notification preferences.",
    components:["Profile info (name, masked mobile, masked email — read only)","Change password section (current → new → confirm)","Notification preferences (SMS on/off, Email on/off, Push on/off per category)","Active sessions list with logout-all button","Linked devices list"],
    apis:["POST /api/auth/change-password","POST /api/notifications/preferences"],
    notes:"Name and contact info are read-only (set by KYC — cannot be self-edited). Logout-all blacklists all JWTs in Redis instantly.",
    status:"Placeholder"
  },
  {
    id:15, group:"Customer", name:"Notifications",
    route:"/customer/notifications",
    roles:["CUSTOMER"],
    desc:"Inbox of all notifications — OTPs sent, transaction alerts, KYC updates, security alerts.",
    components:["Notification list (newest first)","Type badges: OTP / Transaction / KYC / Security","Mark all read button","Filter by type","Notification detail on click","Empty state illustration"],
    apis:["GET /api/notifications/my"],
    notes:"OTP content is masked after 30 seconds. Transaction notifications show amount and account last 4 digits only.",
    status:"Placeholder"
  },

  // ─────────────────────────────────────────────
  // TELLER SCREENS
  // ─────────────────────────────────────────────
  {
    id:16, group:"Teller", name:"Teller Dashboard",
    route:"/teller/dashboard",
    roles:["TELLER"],
    desc:"Teller's main work screen — quick search, pending approvals waiting for manager, today's summary.",
    components:["Customer account search bar (name or account number)","Today's transaction count and total amount processed","Pending large transactions (flagged for manager approval)","Quick action buttons: Deposit, Withdrawal, New Account","Shift summary: total deposits, withdrawals, count"],
    apis:["GET /api/accounts/search"],
    notes:"All accounts searched are scoped to teller's branch_id. Every search is logged in audit_log.",
    status:"Implemented"
  },
  {
    id:17, group:"Teller", name:"Customer Account Search",
    route:"/teller/search",
    roles:["TELLER"],
    desc:"Search for any customer account within the branch by name or account number.",
    components:["Search input (real-time as-you-type)","Results list: name, account number, account type, status badge","Click result → go to Account Detail","Recent searches list","No results / not found state"],
    apis:["GET /api/accounts/search"],
    notes:"Results scoped to branch. Every account opened is logged. Teller cannot see accounts from other branches.",
    status:"Placeholder"
  },
  {
    id:18, group:"Teller", name:"View Customer Account (Teller)",
    route:"/teller/accounts/:accountId",
    roles:["TELLER"],
    desc:"Full account view for a customer — same info as customer sees plus teller-specific actions.",
    components:["Customer name and KYC status badge","Account number, balance, type, status","Transaction history (last 20)","Action buttons: Deposit, Withdraw, View Full History","Account freeze status warning if frozen","Teller ID shown in header (accountability)"],
    apis:["GET /api/accounts/:accountId","GET /api/transactions/:accountId/history"],
    notes:"Access is logged in audit_log with teller ID and timestamp every time account is opened.",
    status:"Placeholder"
  },
  {
    id:19, group:"Teller", name:"Process Cash Deposit",
    route:"/teller/deposit",
    roles:["TELLER"],
    desc:"Cash deposit form — teller selects account, enters amount, confirms, prints receipt.",
    components:["Account number input / select from recent search","Amount input with currency formatting","Denomination breakdown (optional — ₹500 notes × N etc.)","Review step: account holder name, amount confirmation","Confirm button with teller PIN re-entry","Success: transaction ID + print receipt button"],
    apis:["POST /api/transactions/deposit"],
    notes:"If amount exceeds branch cash limit → auto-routes to manager approval queue. Teller ID recorded in initiated_by.",
    status:"Placeholder"
  },
  {
    id:20, group:"Teller", name:"Process Cash Withdrawal",
    route:"/teller/withdraw",
    roles:["TELLER"],
    desc:"Cash withdrawal — verify customer identity, check limits, process, print receipt.",
    components:["Account number input","Customer identity verification step (check ID physically)","Amount input","Balance check (show available vs requested)","Daily limit remaining indicator","Confirm with teller PIN","Success: transaction ID + print receipt"],
    apis:["POST /api/transactions/withdraw"],
    notes:"System checks status (ACTIVE/FROZEN), balance, daily limit before allowing. Frozen accounts show clear blocked message.",
    status:"Placeholder"
  },

  // ─────────────────────────────────────────────
  // BRANCH MANAGER SCREENS
  // ─────────────────────────────────────────────
  {
    id:21, group:"Branch Manager", name:"Manager Dashboard",
    route:"/manager/dashboard",
    roles:["BRANCH_MANAGER"],
    desc:"Branch overview — pending approvals, today's statistics, alerts, teller activity.",
    components:["Pending approvals count (urgent badge if >5)","Today's total transaction volume","Fraud alerts count badge","Active teller sessions count","Charts: hourly transaction volume, transaction type breakdown","Branch performance vs yesterday"],
    apis:["GET /api/transactions/pending-approval","GET /api/fraud/alerts","GET /api/audit/logs"],
    notes:"Pending approvals sorted by oldest first — SLA: must be reviewed within 2 hours.",
    status:"Placeholder"
  },
  {
    id:22, group:"Branch Manager", name:"Pending Approvals",
    route:"/manager/approvals",
    roles:["BRANCH_MANAGER"],
    desc:"List of all transactions initiated by tellers that exceeded the limit and await manager sign-off.",
    components:["Approval queue list (oldest first)","Each item: amount, teller name, customer name, account, time waiting","Expand to see full transaction details","Approve button (green) + Reject button (red)","Mandatory reason field for rejection","Bulk approve option for low-risk items"],
    apis:["GET /api/transactions/pending-approval","POST /api/transactions/:txnId/approve","POST /api/transactions/:txnId/reject"],
    notes:"Manager's user_id written to transactions.approved_by permanently. Maker-checker audit trail created on every decision.",
    status:"Placeholder"
  },
  {
    id:23, group:"Branch Manager", name:"Freeze / Unfreeze Account",
    route:"/manager/accounts/:accountId/status",
    roles:["BRANCH_MANAGER"],
    desc:"Change an account's status — freeze for investigation, unfreeze after clearance, close on request.",
    components:["Account summary (owner, balance, current status)","Status selector: Active / Frozen / Closed","Mandatory reason text input","Confirmation dialog with summary","Action log showing previous status changes"],
    apis:["PATCH /api/accounts/:accountId/status"],
    notes:"Reason is mandatory — audit_log entry includes reason. Customer notified via SMS automatically.",
    status:"Placeholder"
  },
  {
    id:24, group:"Branch Manager", name:"Set Account Limits",
    route:"/manager/accounts/:accountId/limits",
    roles:["BRANCH_MANAGER"],
    desc:"Override daily transfer, UPI, ATM, NEFT limits for a specific account.",
    components:["Account selector","Limit type tabs: Daily Debit / UPI / NEFT / RTGS / ATM","Current limit (from branch config)","Override amount input","Valid until date (optional — time-limited override)","Save button + reset to branch default button"],
    apis:["PUT /api/accounts/:accountId/limits"],
    notes:"Override stored in transaction_limits table. Expires automatically if valid_until set. Manager ID recorded.",
    status:"Placeholder"
  },
  {
    id:25, group:"Branch Manager", name:"Branch Reports",
    route:"/manager/reports",
    roles:["BRANCH_MANAGER"],
    desc:"Daily and weekly branch reports — volume, teller performance, transaction breakdown.",
    components:["Date range selector","Total transactions chart (daily)","Transaction type breakdown (pie chart)","Teller-wise performance table","Top accounts by volume","Export as PDF / Excel button","Fraud alerts summary"],
    apis:["GET /api/audit/logs"],
    notes:"Reports scoped to manager's branch only. Cannot see other branches.",
    status:"Placeholder"
  },
  {
    id:26, group:"Branch Manager", name:"Reverse Transaction",
    route:"/manager/transactions/:txnId/reverse",
    roles:["BRANCH_MANAGER"],
    desc:"Reverse a completed transaction — for errors, wrong amounts, wrong accounts.",
    components:["Transaction summary (original details)","Reason for reversal input (mandatory)","Impact preview: what balances will change","Confirmation dialog","Success: new reversal transaction ID"],
    apis:["POST /api/transactions/:txnId/reverse"],
    notes:"Original transaction preserved with status=REVERSED. New counter transaction created. Full audit trail of original + reversal.",
    status:"Placeholder"
  },
  {
    id:27, group:"Branch Manager", name:"Fraud Alerts Review",
    route:"/manager/fraud",
    roles:["BRANCH_MANAGER"],
    desc:"Review and act on fraud alerts raised by the automated detection system.",
    components:["Alert list sorted by risk score (highest first)","Alert type badge: VELOCITY / GEO_ANOMALY / AML / LARGE_CASH","Risk score bar (0–100)","Transaction detail on click","Dismiss (false positive) + Escalate (genuine)","Mandatory resolution note","Account freeze shortcut button"],
    apis:["GET /api/fraud/alerts","POST /api/fraud/alerts/:alertId/review","POST /api/fraud/alerts/:alertId/block-account"],
    notes:"Mandatory note for both dismiss and escalate — prevents officers dismissing without justification.",
    status:"Placeholder"
  },
  {
    id:28, group:"Branch Manager", name:"Update Branch Config",
    route:"/manager/config",
    roles:["BRANCH_MANAGER"],
    desc:"Update branch transaction limits, teller cash limits, AML thresholds.",
    components:["Max teller transaction limit input","Default daily debit limit","Default UPI limit","AML alert threshold","Save changes button","Change history log (last 10 config changes)"],
    apis:["PUT /api/admin/branch/:branchId/config"],
    notes:"Changes take effect immediately. Every change logged in audit_log with manager ID.",
    status:"Placeholder"
  },

  // ─────────────────────────────────────────────
  // AUDITOR SCREENS
  // ─────────────────────────────────────────────
  {
    id:29, group:"Auditor", name:"Auditor Dashboard",
    route:"/auditor/dashboard",
    roles:["AUDITOR"],
    desc:"Read-only overview — system-wide transaction volume, pending STR drafts, signature verification status.",
    components:["Total transactions today (system-wide)","Last signature batch result (verified vs tampered)","Pending STR drafts count","CTR due this week count","Audit log gap status (last check)","Recent high-risk fraud alert count"],
    apis:["GET /api/audit/logs","GET /api/fraud/alerts"],
    notes:"All data read-only. No action buttons except navigation. Auditor cannot modify anything.",
    status:"Placeholder"
  },
  {
    id:30, group:"Auditor", name:"Audit Log Explorer",
    route:"/auditor/logs",
    roles:["AUDITOR"],
    desc:"Query the immutable audit log with powerful filters. Full history of every action in the system.",
    components:["Date range filter","Entity type filter (Account/Transaction/KYC/User)","Actor filter (who did the action)","Action type filter","Results table: log_id, timestamp, action, entity, actor, IP","Expand row for metadata detail","Export results as CSV"],
    apis:["GET /api/audit/logs","GET /api/audit/logs/:entityId"],
    notes:"log_id shown in results — auditor can visually spot gaps (e.g. 1000 → 1002 = row deleted).",
    status:"Placeholder"
  },
  {
    id:31, group:"Auditor", name:"Entity Full History",
    route:"/auditor/logs/:entityId",
    roles:["AUDITOR"],
    desc:"Complete chronological audit history for one specific account, transaction, or user.",
    components:["Entity type and ID header","Full timeline of all events","Each event: timestamp, action, actor, IP, role","Expandable metadata per event","RSA signature verify button for transactions","Export as PDF for regulatory submission"],
    apis:["GET /api/audit/logs/:entityId","GET /api/transactions/:txnId/verify-signature"],
    notes:"Used in fraud investigations — 'show me everything that happened to account X'. Tamper-proof timeline.",
    status:"Placeholder"
  },
  {
    id:32, group:"Auditor", name:"RSA Signature Verification",
    route:"/auditor/verify",
    roles:["AUDITOR"],
    desc:"Manually trigger RSA signature verification for a date range or single transaction.",
    components:["Date range selector for batch verify","Single transaction ID input for individual verify","Trigger verification button","Progress bar (batch can take minutes)","Results: total checked / valid / tampered","Tampered list (transaction IDs) if any found","Download verification report"],
    apis:["GET /api/transactions/:txnId/verify-signature","POST /api/audit/verify-batch"],
    notes:"Batch runs automatically nightly at 2AM via Bull queue. This screen allows manual trigger during investigations.",
    status:"Placeholder"
  },
  {
    id:33, group:"Auditor", name:"Audit Gap Detection",
    route:"/auditor/gap-check",
    roles:["AUDITOR"],
    desc:"Check for missing sequence numbers in audit_log — detects if any rows were deleted.",
    components:["Date range to check","Run gap check button","Result: CLEAN (no gaps) or GAPS FOUND","Gap list: missing log_id values with surrounding context","Severity of gaps (1 gap = suspicious, 10+ gaps = critical)","Export gap report for RBI submission"],
    apis:["GET /api/audit/gap-check"],
    notes:"BIGSERIAL PK on audit_log makes this possible. UUID PKs on other tables do not support gap detection.",
    status:"Placeholder"
  },
  {
    id:34, group:"Auditor", name:"CTR Report Generator",
    route:"/auditor/reports/ctr",
    roles:["AUDITOR"],
    desc:"Generate Cash Transaction Report for RBI — all cash transactions above ₹10 lakh in a period.",
    components:["Period selector (month/quarter/custom)","Preview: list of CTR-eligible transactions","Transaction details per row (account, amount, date, KYC info)","Total count and amount summary","Generate report button (RBI XML/JSON format)","Download + Submit status tracker"],
    apis:["GET /api/audit/reports/ctr"],
    notes:"RBI deadline: submit within 7 working days of transaction. Report auto-formatted per RBI FIU-IND specification.",
    status:"Placeholder"
  },
  {
    id:35, group:"Auditor", name:"STR Report Generator",
    route:"/auditor/reports/str",
    roles:["AUDITOR"],
    desc:"Generate Suspicious Transaction Report for RBI — from escalated fraud alerts.",
    components:["Period selector","Escalated fraud alerts list (input for STR)","Edit reason/description per alert","Preview report in RBI format","Generate draft button","Officer review + digital signature step","Submit status + submission reference number"],
    apis:["GET /api/audit/reports/str"],
    notes:"Officer reviews each STR before submission. Cannot submit without review. Digital signature applied to final report.",
    status:"Placeholder"
  },

  // ─────────────────────────────────────────────
  // KYC OFFICER SCREENS
  // ─────────────────────────────────────────────
  {
    id:36, group:"KYC Officer", name:"KYC Review Dashboard",
    route:"/kyc/dashboard",
    roles:["KYC_OFFICER"],
    desc:"KYC officer's main screen — pending review queue, today's processed count, expiry alerts.",
    components:["Pending review count (urgent if >10)","Today's approved / rejected counts","Cases expiring in 7 days alert","Average face match score for pending cases","Oldest pending case timer (SLA: 24 hours)","Quick stats: auto-approved today, manual-approved today"],
    apis:["GET /api/kyc/pending","GET /api/kyc/expiring-soon"],
    notes:"SLA: RBI requires KYC processing within 24 hours of submission. Oldest pending shown prominently.",
    status:"Placeholder"
  },
  {
    id:37, group:"KYC Officer", name:"KYC Pending Queue",
    route:"/kyc/pending",
    roles:["KYC_OFFICER"],
    desc:"List of all KYC cases awaiting manual review — sorted oldest first for SLA compliance.",
    components:["Case list: customer name (masked), submission date, face score, doc quality score","Age indicator (hours since submitted)","Priority badge if near 24-hour SLA breach","Click to open full review","Filter: by score range, by date","Count summary"],
    apis:["GET /api/kyc/pending"],
    notes:"Face score 60-90% ends up here. Below 60% = auto-rejected, never appears in queue. Sorted oldest first.",
    status:"Placeholder"
  },
  {
    id:38, group:"KYC Officer", name:"KYC Document Review",
    route:"/kyc/:kycId/review",
    roles:["KYC_OFFICER"],
    desc:"Full KYC review screen — view documents, see face match score, make approve/reject decision.",
    components:["Aadhaar image viewer (from signed URL — expires 5 min)","PAN card image viewer","Selfie image viewer","Face match score gauge","OCR extracted data vs submitted data comparison","Approve button","Request additional documents button","Reject button with mandatory reason dropdown + custom text","Every document view logged automatically"],
    apis:["GET /api/kyc/:kycId/document","POST /api/kyc/:kycId/review"],
    notes:"Documents served via 5-minute signed URLs — never stored in browser. Every document open = audit_log entry with officer ID.",
    status:"Placeholder"
  },
  {
    id:39, group:"KYC Officer", name:"KYC Expiry Management",
    route:"/kyc/expiring",
    roles:["KYC_OFFICER"],
    desc:"Customers whose KYC expires in the next 30 days — send reminders, track re-KYC status.",
    components:["Expiry list: customer name (masked), account, days until expiry","Risk category badge (HIGH/LOW — different expiry rules)","Reminder sent status","Send reminder button (triggers SMS/email)","Bulk remind all button","Filter: by days remaining, by risk category"],
    apis:["GET /api/kyc/expiring-soon"],
    notes:"Accounts frozen 7 days after KYC expires if not renewed. This screen allows proactive management.",
    status:"Placeholder"
  },

  // ─────────────────────────────────────────────
  // SYSTEM ADMIN SCREENS
  // ─────────────────────────────────────────────
  {
    id:40, group:"System Admin", name:"Admin Dashboard",
    route:"/admin/dashboard",
    roles:["SYSTEM_ADMIN"],
    desc:"System health overview — server status, DB connections, Redis health, queue depths, error rates.",
    components:["API health status (green/yellow/red)","DB connection pool gauge (active/idle/waiting)","Redis memory usage bar","Bull queue depth per queue (pending/active/failed)","API error rate chart (last 1 hour)","Response time P50/P95/P99 metrics","Active user sessions count"],
    apis:["GET /api/admin/health"],
    notes:"Admin cannot see any financial data here. Pure infrastructure view. Alert thresholds trigger SMS to admin.",
    status:"Implemented"
  },
  {
    id:41, group:"System Admin", name:"Staff User Management",
    route:"/admin/users",
    roles:["SYSTEM_ADMIN"],
    desc:"List all bank staff accounts — view roles, status, last login, create new accounts.",
    components:["Users table: username, role badge, branch, last login, active status","Create new user button","Filter by role, by branch, by active status","Deactivate toggle per user","Role change button per user","Dormant accounts highlight (no login 90 days)","Bulk deactivate option"],
    apis:["GET /api/admin/users","PATCH /api/admin/users/:userId/deactivate"],
    notes:"Passwords never shown. Sensitive fields masked. Admin cannot see totp_secret or password_hash.",
    status:"Implemented"
  },
  {
    id:42, group:"System Admin", name:"Create Staff Account",
    route:"/admin/users/create",
    roles:["SYSTEM_ADMIN"],
    desc:"Create a new teller, manager, KYC officer, or auditor account with minimum required role.",
    components:["Full name input","Username input (auto-suggest from name)","Role selector (principle of least privilege enforced)","Branch assignment selector","Temp password auto-generated (shown once)","Email for onboarding notification","Submit — sends onboarding email with temp password"],
    apis:["POST /api/admin/users"],
    notes:"Temp password expires in 24 hours. User forced to change password on first login. Role cannot be SYSTEM_ADMIN from this form.",
    status:"Implemented"
  },
  {
    id:43, group:"System Admin", name:"Change Staff Role",
    route:"/admin/users/:userId/role",
    roles:["SYSTEM_ADMIN"],
    desc:"Promote a teller to manager, or change any staff role. All active sessions revoked.",
    components:["User summary (name, current role, branch)","New role selector","Impact warning: 'All active sessions will be revoked'","Reason input (mandatory)","Confirm button","Success: user must re-login with new role"],
    apis:["PATCH /api/admin/users/:userId/role"],
    notes:"All active JTIs blacklisted in Redis on role change. New JWT with correct role issued on next login.",
    status:"Placeholder"
  },
  {
    id:44, group:"System Admin", name:"Revoke All User Sessions",
    route:"/admin/users/:userId/revoke",
    roles:["SYSTEM_ADMIN"],
    desc:"Emergency: instantly revoke all active sessions for any user — security incident response.",
    components:["User details","Active sessions count and list (device, IP, last used)","Revoke all button (red, confirmation required)","Reason input (mandatory)","Success: all sessions terminated instantly"],
    apis:["POST /api/admin/users/:userId/revoke-sessions"],
    notes:"Useful when staff credentials are compromised. All JTIs blacklisted in Redis immediately — takes effect in <1ms.",
    status:"Placeholder"
  },
  {
    id:45, group:"System Admin", name:"Branch Management",
    route:"/admin/branches",
    roles:["SYSTEM_ADMIN"],
    desc:"Central console for managing bank branch network, limits, and operational status.",
    components:["List of all branches with health status","Limit configuration (Daily, UPI, Teller)","New branch registration form","Soft-delete (deactivation) toggle"],
    apis:["GET /api/admin/branches","POST /api/admin/branches","PUT /api/admin/branches/:id","DELETE /api/admin/branches/:id"],
    notes:"Changes to limits affect all users associated with the branch immediately.",
    status:"Implemented"
  },
  {
    id:46, group:"System Admin", name:"Encryption Key Management",
    route:"/admin/keys",
    roles:["SYSTEM_ADMIN"],
    desc:"View AES key version history. Trigger key rotation (re-encrypt all data with new key).",
    components:["Current key version","Key creation date","Key rotation trigger button","Rotation progress bar (can take hours for large data)","Key version history table","Next scheduled rotation date"],
    apis:[],
    notes:"Key rotation: generate new AES key → re-encrypt all encrypted fields in batches → mark old key deprecated. Never shows actual key value.",
    status:"Implemented"
  },

  // ─────────────────────────────────────────────
  // SHARED SCREENS (all authenticated roles)
  // ─────────────────────────────────────────────
  {
    id:47, group:"Shared", name:"Change Password",
    route:"/settings/change-password",
    roles:["CUSTOMER","TELLER","BRANCH_MANAGER","AUDITOR","KYC_OFFICER","SYSTEM_ADMIN"],
    desc:"Change password for any logged-in user. Verifies current password. Blacklists all active sessions.",
    components:["Current password field","New password field with strength meter","Confirm new password field","Submit button","Warning: 'You will be logged out of all devices'"],
    apis:["POST /api/auth/change-password"],
    notes:"On success: all JWTs blacklisted, user redirected to login. Security best practice.",
    status:"Placeholder"
  },
  {
    id:48, group:"Shared", name:"Active Sessions",
    route:"/settings/sessions",
    roles:["CUSTOMER","TELLER","BRANCH_MANAGER","AUDITOR","KYC_OFFICER","SYSTEM_ADMIN"],
    desc:"View all active login sessions. Logout specific device or all devices.",
    components:["Sessions list: device type, browser, IP, location, last active time","Current session highlighted","Logout this device button per session","Logout all other devices button","Suspicious session alert if unknown IP/device"],
    apis:["POST /api/auth/logout"],
    notes:"Helps customers detect if their account is being accessed from unknown devices.",
    status:"Placeholder"
  },
  {
    id:49, group:"Shared", name:"404 Not Found",
    route:"/*",
    roles:["Public","CUSTOMER","TELLER","BRANCH_MANAGER","AUDITOR","KYC_OFFICER","SYSTEM_ADMIN"],
    desc:"Standard 404 page for invalid routes.",
    components:["404 message","Back to dashboard button","Contact support link"],
    apis:[],
    notes:"React Router catch-all route. Redirects to role-appropriate dashboard on 'Go Home'.",
    status:"Implemented"
  },
  {
    id:50, group:"Shared", name:"403 Access Denied",
    route:"/403",
    roles:["CUSTOMER","TELLER","BRANCH_MANAGER","AUDITOR","KYC_OFFICER","SYSTEM_ADMIN"],
    desc:"Shown when a user tries to access a page they don't have permission for.",
    components:["Access denied message","Current role display","Back button","Contact admin link"],
    apis:[],
    notes:"Protected Route component redirects here when JWT role doesn't match required role.",
    status:"Implemented"
  },
];

const GROUPS = ["Public","Customer","Teller","Branch Manager","Auditor","KYC Officer","System Admin","Shared"];
const GROUP_COLOR = {
  "Public":         { color:"#27500A", bg:"#EAF3DE", border:"#B4D98C" },
  "Customer":       { color:"#3C3489", bg:"#EEEDFE", border:"#CECBF6" },
  "Teller":         { color:"#085041", bg:"#E1F5EE", border:"#9FE1CB" },
  "Branch Manager": { color:"#633806", bg:"#FAEEDA", border:"#FAC775" },
  "Auditor":        { color:"#444441", bg:"#F1EFE8", border:"#CFCCC0" },
  "KYC Officer":    { color:"#712B13", bg:"#FAECE7", border:"#F5C4B3" },
  "System Admin":   { color:"#791F1F", bg:"#FCF0F0", border:"#F5BFBF" },
  "Shared":         { color:"#185FA5", bg:"#E6F1FB", border:"#A8CFF5" },
};

const roleToGroup = {
  "CUSTOMER":"Customer","TELLER":"Teller","BRANCH_MANAGER":"Branch Manager",
  "AUDITOR":"Auditor","KYC_OFFICER":"KYC Officer","SYSTEM_ADMIN":"System Admin",
  "Public":"Public"
};

export default function App() {
  const [activeRole, setActiveRole]   = useState("ALL");
  const [openScreen, setOpenScreen]   = useState(null);
  const [search, setSearch]           = useState("");
  const [onlyImplemented, setOnlyImplemented] = useState(true);

  const filtered = SCREENS.filter(s => {
    const roleMatch = activeRole === "ALL" ||
      s.roles.some(r => r === activeRole ||
        (activeRole === "BRANCH_MANAGER" && r === "BRANCH_MANAGER") ||
        (activeRole === "KYC_OFFICER" && r === "KYC_OFFICER") ||
        (activeRole === "SYSTEM_ADMIN" && r === "SYSTEM_ADMIN"));
    const searchMatch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase()) ||
      s.route.toLowerCase().includes(search.toLowerCase());
    const implementedMatch = !onlyImplemented || s.status === "Implemented";
    
    return roleMatch && searchMatch && implementedMatch;
  });

  const grouped = {};
  filtered.forEach(s => {
    const g = s.group;
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(s);
  });

  const totalScreens = SCREENS.length;

  const roleCounts = {};
  SCREENS.forEach(s => s.roles.forEach(r => {
    roleCounts[r] = (roleCounts[r]||0) + 1;
  }));

  return (
    <div style={{padding:"1rem 0", fontFamily:"var(--font-sans)"}}>

      {/* Header */}
      <div style={{marginBottom:14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <div style={{fontSize:15,fontWeight:500,color:"var(--color-text-primary)",marginBottom:3}}>
            All {totalScreens} frontend screens — role-based access map
          </div>
          <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>
            Click any screen to see its components, APIs it calls, and implementation notes.
          </div>
        </div>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-background-secondary)', padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--color-border-secondary)'}}>
          <input 
            type="checkbox" 
            id="implemented-filter"
            checked={onlyImplemented} 
            onChange={(e) => setOnlyImplemented(e.target.checked)} 
            style={{cursor: 'pointer'}}
          />
          <label htmlFor="implemented-filter" style={{fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-primary)', cursor: 'pointer'}}>
            Only Implemented
          </label>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        {[
          [String(totalScreens),"Total screens"],
          ["5","Public screens"],
          ["10","Customer screens"],
          ["5","Teller screens"],
          ["8","Manager screens"],
          ["7","Auditor screens"],
          ["4","KYC Officer"],
          ["7","Admin screens"],
        ].map(([n,l])=>(
          <div key={l} style={{background:"var(--color-background-secondary)",borderRadius:8,
            padding:"7px 12px",textAlign:"center"}}>
            <div style={{fontSize:16,fontWeight:500,color:"var(--color-text-primary)"}}>{n}</div>
            <div style={{fontSize:10,color:"var(--color-text-secondary)",marginTop:1}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{marginBottom:10}}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search screens by name, route, or description..."
          style={{width:"100%",padding:"7px 12px",fontSize:12,borderRadius:8,
            border:"0.5px solid var(--color-border-secondary)",
            background:"var(--color-background-secondary)",
            color:"var(--color-text-primary)",outline:"none"}} />
      </div>

      {/* Role filter */}
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
        {["ALL","Public","CUSTOMER","TELLER","BRANCH_MANAGER","AUDITOR","KYC_OFFICER","SYSTEM_ADMIN"].map(role=>{
          const gname = roleToGroup[role] || role;
          const gc = GROUP_COLOR[gname] || GROUP_COLOR["Shared"];
          const isOn = activeRole === role;
          return (
            <button key={role} onClick={()=>setActiveRole(role)}
              style={{padding:"4px 12px",fontSize:11,fontWeight:500,borderRadius:12,cursor:"pointer",
                border:`0.5px solid ${isOn ? gc.border : "var(--color-border-secondary)"}`,
                background: isOn ? gc.bg : "var(--color-background-secondary)",
                color: isOn ? gc.color : "var(--color-text-secondary)"}}>
              {role === "ALL" ? "All roles" : role === "BRANCH_MANAGER" ? "Manager" :
               role === "KYC_OFFICER" ? "KYC Officer" : role === "SYSTEM_ADMIN" ? "Admin" :
               role.charAt(0)+role.slice(1).toLowerCase()}
              {role !== "ALL" && <span style={{marginLeft:5,opacity:.7}}>
                ({roleCounts[role] || roleCounts[roleToGroup[role]] || "–"})
              </span>}
            </button>
          );
        })}
      </div>

      <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:12}}>
        Showing {filtered.length} of {totalScreens} screens
      </div>

      {/* Grouped screens */}
      {Object.entries(grouped).map(([grp, screens])=>{
        const gc = GROUP_COLOR[grp] || GROUP_COLOR["Shared"];
        return (
          <div key={grp} style={{marginBottom:20}}>
            {/* Group header */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,
              padding:"8px 12px",background:gc.bg,borderRadius:8,
              border:`0.5px solid ${gc.border}`}}>
              <div style={{fontSize:13,fontWeight:500,color:gc.color,flex:1}}>
                {grp}
              </div>
              <div style={{fontSize:11,fontWeight:500,padding:"2px 9px",borderRadius:8,
                background:"var(--color-background-primary)",color:gc.color,
                border:`0.5px solid ${gc.border}`}}>
                {screens.length} screens
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {screens.map(screen=>{
                const isOpen = openScreen === screen.id;
                return (
                  <div key={screen.id} style={{
                    borderTop: `0.5px solid ${isOpen?gc.border:"var(--color-border-tertiary)"}`,
                    borderRight: `0.5px solid ${isOpen?gc.border:"var(--color-border-tertiary)"}`,
                    borderBottom: `0.5px solid ${isOpen?gc.border:"var(--color-border-tertiary)"}`,
                    borderLeft: `3px solid ${gc.color}`,
                    borderRadius:10,overflow:"hidden",
                    background:"var(--color-background-primary)"
                  }}>

                    {/* Row */}
                    <div onClick={()=>setOpenScreen(isOpen?null:screen.id)}
                      style={{display:"flex",alignItems:"center",gap:10,
                        padding:"10px 14px",cursor:"pointer"}}>
                      <div style={{minWidth:22,fontSize:11,fontWeight:500,
                        color:"var(--color-text-tertiary)"}}>
                        {String(screen.id).padStart(2,"0")}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600, fontSize:13, color:"var(--color-text-primary)", display: 'flex', alignItems: 'center', gap: '8px'}}>
                          {screen.name}
                          <span style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: screen.status === 'Implemented' ? '#e1f5ee' : '#f1f1f1',
                            color: screen.status === 'Implemented' ? '#085041' : '#666',
                            border: `1px solid ${screen.status === 'Implemented' ? '#9fe1cb' : '#ddd'}`
                          }}>
                            {screen.status}
                          </span>
                        </div>
                        <div style={{fontSize:11,fontFamily:"monospace",color:"var(--color-text-tertiary)",marginTop:1}}>
                          {screen.route}
                        </div>
                      </div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)",
                        flex:2,display:window.innerWidth>500?"flex":"none",alignItems:"center"}}>
                        {screen.desc.length>70?screen.desc.slice(0,70)+"...":screen.desc}
                      </div>
                      <div style={{display:"flex",gap:4,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
                        {screen.roles.slice(0,2).map(r=>{
                          const rs = ROLE_STYLE[r]||ROLE_STYLE["Public"];
                          return (
                            <span key={r} style={{fontSize:9,fontWeight:500,padding:"1px 6px",
                              borderRadius:5,background:rs.bg,color:rs.text,border:`0.5px solid ${rs.border}`}}>
                              {r==="BRANCH_MANAGER"?"MANAGER":r==="KYC_OFFICER"?"KYC":r==="SYSTEM_ADMIN"?"ADMIN":r}
                            </span>
                          );
                        })}
                        {screen.roles.length>2&&(
                          <span style={{fontSize:9,color:"var(--color-text-tertiary)"}}>
                            +{screen.roles.length-2}
                          </span>
                        )}
                      </div>
                      <span style={{fontSize:11,color:"var(--color-text-tertiary)",flexShrink:0}}>
                        {isOpen?"▴":"▾"}
                      </span>
                    </div>

                    {/* Expanded detail */}
                    {isOpen&&(
                      <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",padding:"14px 16px"}}>

                        {/* Description */}
                        <div style={{marginBottom:12}}>
                          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",
                            textTransform:"uppercase",letterSpacing:".04em",marginBottom:5}}>
                            Screen purpose
                          </div>
                          <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.75}}>
                            {screen.desc}
                          </div>
                        </div>

                        {/* Roles */}
                        <div style={{marginBottom:12}}>
                          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",
                            textTransform:"uppercase",letterSpacing:".04em",marginBottom:5}}>
                            Who can access
                          </div>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            {screen.roles.map(r=>{
                              const rs=ROLE_STYLE[r]||ROLE_STYLE["Public"];
                              return (
                                <span key={r} style={{fontSize:11,fontWeight:500,padding:"3px 10px",
                                  borderRadius:8,background:rs.bg,color:rs.text,border:`0.5px solid ${rs.border}`}}>
                                  {r}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Components */}
                        <div style={{marginBottom:12}}>
                          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",
                            textTransform:"uppercase",letterSpacing:".04em",marginBottom:5}}>
                            UI components on this screen
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:3}}>
                            {screen.components.map((c,ci)=>(
                              <div key={ci} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                                <span style={{color:gc.color,fontSize:11,flexShrink:0,marginTop:1}}>→</span>
                                <span style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.5}}>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* APIs */}
                        {screen.apis.length>0&&(
                          <div style={{marginBottom:12}}>
                            <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",
                              textTransform:"uppercase",letterSpacing:".04em",marginBottom:5}}>
                              APIs called
                            </div>
                            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                              {screen.apis.map((api,ai)=>{
                                const method=api.split(" ")[0];
                                const methodColor={
                                  GET:{bg:"#E1F5EE",text:"#085041"},
                                  POST:{bg:"#EEEDFE",text:"#3C3489"},
                                  PUT:{bg:"#FAEEDA",text:"#633806"},
                                  PATCH:{bg:"#E6F1FB",text:"#0C447C"},
                                  DELETE:{bg:"#FAECE7",text:"#712B13"},
                                }[method]||{bg:"#F0F0F0",text:"#444"};
                                return (
                                  <span key={ai} style={{fontSize:11,fontFamily:"monospace",
                                    padding:"3px 10px",borderRadius:6,
                                    background:methodColor.bg,color:methodColor.text}}>
                                    {api}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        <div style={{padding:"10px 12px",background:gc.bg,borderRadius:8,
                          border:`0.5px solid ${gc.border}`}}>
                          <div style={{fontSize:11,fontWeight:500,color:gc.color,marginBottom:3}}>
                            Implementation note
                          </div>
                          <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.6}}>
                            {screen.notes}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length===0&&(
        <div style={{textAlign:"center",padding:"2rem",color:"var(--color-text-tertiary)"}}>
          No screens match your filter.
        </div>
      )}
    </div>
  );
}
