# 🏦 Digital Bank of India — Secure Customer

> **Digital Bank of India Frontend**: A premium, high-fidelity React customer banking application featuring secure multi-step account opening wizards, real-time transaction ledger history, instant client-side optimistic logout (0ms delay), dynamic regulatory KYC guard checks, and robust cryptographic session state synchronization.

---

## 🚀 Live Production Endpoints
The frontend connects directly to the highly secure production banking servers hosted on Vercel:
* **Primary Core Production Backend API**: `https://bank-management-system-backend-five.vercel.app/api`
* **Alternate Staging Backend (main branch)**: `https://bank-management-system-backend-git-main-vignesh3161s-projects.vercel.app/api`
* **Alternate Deployment Backend (hash build)**: `https://bank-management-system-backend-8ibg3qz68-vignesh3161s-projects.vercel.app/api`

---

## ✨ Key Architectural Features

### 1. 💎 Premium Glassmorphism UI/UX
* Designed with a dark modern color system tailored with green/teal accent badges matching the "Digital Bank of India" theme.
* Custom font systems, rich hover transitions, and fluid micro-animations providing a premium and state-of-the-art native feel.

### 2. 🛡️ Dynamic KYC Verification Guard
* Real-time API hooks automatically check the logged-in customer's compliance KYC verification status upon mounting the account open screens.
* Dynamically handles three distinct pending and rejected KYC states (`PENDING`, `SUBMITTED`, `REJECTED`, or `NOT_SUBMITTED`) and renders compliance dashboards with a quick navigation gateway pointing straight to the secure KYC upload forms.

### 3. 🪄 Step-by-Step Account Opening Wizard
* A secure 3-step compliance flow built specifically for verified customers:
  * **Step 1 (Tier Selection)**: Elegant interactive card layouts comparing Savings and Current accounts, complete with visual interest metrics, transaction limits, and popularity tags.
  * **Step 2 (Compliance Review)**: A clear disclosure interface highlighting digital reserve bank rules, security audits, and terms authorization.
  * **Step 3 (Success Activation)**: Displays a success screen featuring the new digital account number and a quick copy-to-clipboard button.

### 4. 💸 Transaction Ledger & History
* Real-time money transfers between digital accounts with instantaneous ledger tracking.
* A robust, read-only transaction history log matching ledger credit/debit records without the overhead of mutating security headers (bypassing Replay Attack nonces for non-mutating operations).

### 5. ⚡ Optimistic Instant Logout (0ms)
* Client-side logout logic is fully decoupled from API responses.
* Clears local cache tokens and context state instantly inside React `AuthContext`, immediately redirecting the user to the login screen in **0ms**, while performing backend JWT blacklisting securely in a fire-and-forget background task.

---

## 🛠️ Local Development & Setup

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (version 18 or higher) and [npm](https://www.npmjs.com/) installed on your local machine.

### 2. Environment Configuration
Create a `.env` file in the root of the `/frontend` directory and define the backend API URL. For production testing, use the primary Vercel backend:

```env
# Production Vercel Core Backend
VITE_API_URL=https://bank-management-system-backend-five.vercel.app/api
```

For local backend development, switch the value:
```env
# Local Development Backend
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation
Navigate into the frontend project folder and install the required library dependencies:
```bash
npm install
```

### 4. Run the Dev Server
Launch Vite's hot-reloading development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to experience the application.

---

## 🏗️ Tech Stack
* **Core Library**: React (v18+)
* **Build System**: Vite
* **Styling & Assets**: Premium Vanilla CSS + Lucide Icons
* **API Client**: Axios (with centralized JWT request interceptors)
* **Toast Telemetry**: React Hot Toast
* **Routing**: React Router DOM (with secure `RoleGuard` middleware protection)
