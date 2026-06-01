import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Smartphone, Globe, ArrowRight, Info, CheckCircle, ShieldCheck, Landmark } from 'lucide-react';

const LandingHome = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-page)', color: 'var(--color-text-main)', fontFamily: 'Outfit, sans-serif' }}>
      {/* Top Banner */}
      <div style={{ background: 'var(--color-secondary)', color: '#fff', padding: '10px 5%', fontSize: '0.8rem', textAlign: 'center', fontWeight: '600', letterSpacing: '0.5px' }}>
        <ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />
        Official Secure Banking Portal of Digital Bank of India • Ensure you are on the correct URL before logging in.
      </div>

      {/* Header / Nav */}
      <nav className="portal-nav" style={{ position: 'relative', boxShadow: 'none', borderBottom: '1px solid var(--color-border)' }}>
        <div className="nav-brand">
          <div className="brand-logo">D</div>
          <div className="brand-text">
            <span className="brand-name">DIGITAL BANK</span>
            <span className="brand-sub">OF INDIA</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/help" style={{ textDecoration: 'none', color: 'var(--color-text-muted)', fontWeight: '600', fontSize: '0.9rem', padding: '10px 20px' }}>Help Desk</Link>
          <Link to="/login" className="btn btn-primary" style={{ padding: '10px 30px' }}>Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ padding: '80px 5%', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px', alignItems: 'center', background: 'white' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 15px', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '25px' }}>
            <CheckCircle size={16} /> Award Winning Digital Banking
          </div>
          <h1 style={{ color: 'var(--color-text-dark)', fontSize: '3.5rem', fontWeight: '800', marginBottom: '25px', lineHeight: '1.1', letterSpacing: '-1.5px' }}>
            The Future of <br/><span className="text-gradient">Indian Banking</span> is Here.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '40px', lineHeight: '1.6', fontWeight: '500', maxWidth: '600px' }}>
            Experience seamless digital financial services with Digital Bank of India. 
            Trusted by millions for reliability, security, and world-class innovation.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', padding: '15px 40px', fontSize: '1rem' }}>
              Open New Account <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ textDecoration: 'none', padding: '15px 40px', fontSize: '1rem' }}>
              Internet Banking
            </Link>
          </div>
        </div>

      </div>

      {/* Features Grid */}
      <div style={{ padding: '80px 5%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', background: 'var(--color-bg-page)' }}>
        {[
          { icon: <Shield size={28} />, title: 'High Security', desc: 'Advanced encryption and 2FA for every single transaction.', color: '#0d9488' },
          { icon: <Smartphone size={28} />, title: 'Mobile First', desc: 'Manage your finances on the go with our award-winning app.', color: '#6366f1' },
          { icon: <Globe size={28} />, title: 'Global Reach', desc: 'Seamless international transfers and currency exchange.', color: '#1e293b' },
          { icon: <Info size={28} />, title: '24/7 Support', desc: 'Dedicated personal bankers available round the clock.', color: '#d97706' }
        ].map((item, i) => (
          <div key={i} className="card" style={{ padding: '40px 30px' }}>
            <div style={{ color: item.color, marginBottom: '20px', background: `${item.color}15`, width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </div>
            <h4 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text-dark)' }}>{item.title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--color-secondary)', color: 'white', padding: '60px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--color-primary)', width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>D</div>
              <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>DBI</span>
            </div>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: '1.6' }}>
              Redefining the modern Indian banking experience with security, speed, and sophistication. 
              Join the future of finance today.
            </p>
          </div>
          <div>
            <h5 style={{ marginBottom: '20px', fontWeight: '700' }}>Quick Links</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
              <Link to="/help" style={{ color: 'inherit', textDecoration: 'none' }}>Help Center</Link>
              <Link to="/security" style={{ color: 'inherit', textDecoration: 'none' }}>Security Portal</Link>
              <Link to="/rates" style={{ color: 'inherit', textDecoration: 'none' }}>Interest Rates</Link>
            </div>
          </div>
          <div>
            <h5 style={{ marginBottom: '20px', fontWeight: '700' }}>Support</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
              <span>Toll Free: 1800-DBI-CARE</span>
              <span>Email: care@dbi.gov.in</span>
              <span>Locate Branch</span>
            </div>
          </div>
          <div>
            <h5 style={{ marginBottom: '20px', fontWeight: '700' }}>Legal</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Compliance</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', textAlign: 'center', fontSize: '0.85rem', opacity: 0.5 }}>
          © 2026 Digital Bank of India. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingHome;
