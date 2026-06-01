import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, Calendar, Lock, ShieldCheck, 
  ArrowRight, ArrowLeft, Loader2, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiService from '../../services/apiService';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    dob: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!form.full_name || !form.dob || !form.email || !form.mobile) {
      toast.error('Please fill all fields');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      toast.error('Mobile number must be 10 digits');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await apiService.auth.register({
        password: form.password,
        full_name: form.full_name,
        email: form.email,
        mobile: form.mobile,
        dob: form.dob
      });
      
      toast.success('Registration successful! Please login to continue.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
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
        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Digital Banking Registration</div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '580px', padding: '0', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
          
          {/* Progress Bar */}
          <div style={{ height: '6px', background: 'var(--color-primary-soft)', display: 'flex' }}>
            <div style={{ width: step === 1 ? '50%' : '100%', background: 'var(--color-primary)', transition: 'width 0.4s ease' }}></div>
          </div>

          <div style={{ background: 'var(--color-bg-white)', padding: '30px', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: '800' }}>Open Your Digital Account</h2>
            <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Step {step} of 2: {step === 1 ? 'Personal Details' : 'Security Setup'}</p>
          </div>
          
          <div style={{ padding: '40px' }}>
            {step === 1 ? (
              <div className="fade-in">
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-dark)' }}>Full Name (as per ID)</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                    <input 
                      name="full_name"
                      className="input-field" 
                      style={{ paddingLeft: '40px', height: '45px' }}
                      type="text" 
                      required
                      value={form.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter Full Name"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-dark)' }}>Date of Birth</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                      <input 
                        name="dob"
                        className="input-field" 
                        style={{ paddingLeft: '40px', height: '45px' }}
                        type="date" 
                        required
                        value={form.dob}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-dark)' }}>Mobile Number</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                      <input 
                        name="mobile"
                        className="input-field" 
                        style={{ paddingLeft: '40px', height: '45px' }}
                        type="tel" 
                        maxLength={10}
                        required
                        value={form.mobile}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '35px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-dark)' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                    <input 
                      name="email"
                      className="input-field" 
                      style={{ paddingLeft: '40px', height: '45px' }}
                      type="email" 
                      required
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="Enter Email ID"
                    />
                  </div>
                </div>

                <button onClick={handleNext} className="btn btn-primary" style={{ width: '100%', height: '50px' }}>
                  Continue to Step 2 <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="fade-in">

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-dark)' }}>Create Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                    <input 
                      name="password"
                      className="input-field" 
                      style={{ paddingLeft: '40px', height: '45px' }}
                      type="password" 
                      required
                      value={form.password}
                      onChange={handleInputChange}
                      placeholder="Min. 6 characters"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '35px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-dark)' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <ShieldCheck size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
                    <input 
                      name="confirmPassword"
                      className="input-field" 
                      style={{ paddingLeft: '40px', height: '45px' }}
                      type="password" 
                      required
                      value={form.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Repeat password"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1, height: '50px' }}>
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, height: '50px' }} disabled={loading}>
                    {loading ? <Loader2 className="spin" size={20} /> : 'Complete Registration'}
                  </button>
                </div>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none' }}>Login securely</Link>
              </p>
            </div>
          </div>
          
          <div style={{ background: 'var(--color-primary-soft)', padding: '20px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <CheckCircle2 size={20} color="var(--color-success)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-main)', fontWeight: '500' }}>Your identity and financial data are encrypted with bank-grade AES-256 protocols.</span>
          </div>
        </div>
      </main>

      <footer style={{ padding: '30px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', background: 'white' }}>
        © 2026 Digital Bank of India. Member FDIC. Equal Housing Lender.
      </footer>
    </div>
  );
};

export default RegisterPage;
