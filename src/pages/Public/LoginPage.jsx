import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, User, Phone, ArrowRight, Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ phone: '', password: '', otp: '' });
  const [otpSessionToken, setOtpSessionToken] = useState('');
  
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ phone: form.phone, password: form.password });
      if (res.requires_2fa) {
        setOtpSessionToken(res.otp_session_token);
        setStep(2);
        toast.success('OTP sent to registered mobile');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtp({ otp_session_token: otpSessionToken, otp: form.otp });
      toast.success('Successfully Authenticated');
      
      const user = res.user;
      if (user.role === 'CUSTOMER') navigate('/customer/dashboard');
      else if (user.role === 'TELLER') navigate('/teller/dashboard');
      else if (user.role === 'BRANCH_MANAGER') navigate('/manager/dashboard');
      else if (user.role === 'AUDITOR') navigate('/auditor/dashboard');
      else if (user.role === 'KYC_OFFICER') navigate('/kyc/dashboard');
      else if (user.role === 'SYSTEM_ADMIN') navigate('/admin/dashboard');
      else navigate('/');

    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-page)', display: 'flex', flexDirection: 'column', fontFamily: 'Outfit, sans-serif' }}>
      {/* Official Header */}
      <header className="portal-nav">
        <Link to="/" style={{ textDecoration: 'none' }} className="nav-brand">
          <div className="brand-logo">D</div>
          <div className="brand-text">
            <span className="brand-name">DIGITAL BANK</span>
            <span className="brand-sub">OF INDIA</span>
          </div>
        </Link>
        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Secure Internet Banking</div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '0', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ background: 'var(--color-primary-soft)', padding: '30px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: '800' }}>Login to Online Banking</h2>
            <p style={{ margin: '5px 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Access your financial dashboard securely</p>
          </div>
          
          <div style={{ padding: '40px' }}>
            {/* Security Warning Banner */}
            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e', padding: '15px', borderRadius: 'var(--radius-md)', marginBottom: '30px', display: 'flex', gap: '12px', fontSize: '0.85rem', fontWeight: '500' }}>
              <AlertTriangle size={20} style={{ flexShrink: 0, color: 'var(--color-warning)' }} />
              <span>Please ensure you are on the official bank URL. Never share your OTP or Password with anyone.</span>
            </div>

            {step === 1 ? (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-dark)' }}>Phone Number / Staff ID</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                    <input 
                       className="input-field" 
                      style={{ paddingLeft: '40px', height: '45px' }}
                      type="text" 
                      required
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      placeholder="Enter Phone Number or Staff ID"
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-dark)' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                    <input 
                      className="input-field" 
                      style={{ paddingLeft: '40px', height: '45px' }}
                      type="password" 
                      required
                      value={form.password}
                      onChange={(e) => setForm({...form, password: e.target.value})}
                      placeholder="Enter Password"
                    />
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', height: '50px' }} disabled={loading}>
                  {loading ? <Loader2 className="spin" size={20} /> : 'Secure Login'}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none' }}>Open an account now</Link>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerify}>
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                  <label style={{ display: 'block', fontSize: '1rem', fontWeight: '700', marginBottom: '20px' }}>Verification Code</label>
                  <div className="otp-container">
                    <input 
                      className="input-field" 
                      style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '10px', height: '65px', color: 'var(--color-primary)', fontWeight: '800' }}
                      type="text" 
                      required
                      maxLength={6}
                      value={form.otp}
                      onChange={(e) => setForm({...form, otp: e.target.value})}
                      placeholder="000000"
                    />
                  </div>
                  <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                    A 6-digit code has been sent to your registered mobile number ending in <span style={{ fontWeight: '700', color: 'var(--color-text-dark)' }}>XXXX</span>
                  </p>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', height: '50px' }} disabled={loading}>
                  {loading ? <Loader2 className="spin" size={20} /> : 'Verify & Continue'}
                </button>
                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                  <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', width: '100%' }}>
                    <ChevronLeft size={18} /> Back to Credentials
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div style={{ background: 'var(--color-bg-page)', padding: '20px', borderTop: '1px solid var(--color-border)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
            <ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: '5px', color: 'var(--color-success)' }} />
            256-bit SSL Encrypted Connection
          </div>
        </div>
      </main>

      <footer style={{ padding: '30px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
          <Link to="/help" style={{ color: 'inherit', textDecoration: 'none' }}>Help Center</Link>
          <Link to="/security" style={{ color: 'inherit', textDecoration: 'none' }}>Security Tips</Link>
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
        </div>
        © 2026 Digital Bank of India. All Rights Reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
