import React, { useState } from 'react';
import { 
  Search, Phone, Mail, MapPin, 
  ChevronDown, ShieldCheck, ArrowRight,
  Info, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpDesk = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    { 
      q: "Is my data secure with Digital Bank of India?", 
      a: "Yes. We use 256-bit AES encryption for all data at rest and RSA digital signatures for every transaction. Our servers are protected by military-grade firewalls and real-time fraud monitoring systems." 
    },
    { 
      q: "How do I reset my Internet Banking password?", 
      a: "You can use the 'Forgot Password' link on the login page. You will need your registered mobile number to receive a secure OTP for reset." 
    },
    { 
      q: "What are the daily transaction limits?", 
      a: "By default, savings accounts have a daily limit of ₹1,00,000 for transfers. You can request a limit increase through your Profile settings." 
    },
    { 
      q: "How can I report a fraudulent transaction?", 
      a: "Immediately freeze your account from the 'Accounts' section and contact our 24/7 fraud helpline at 1800-DBI-FRAUD." 
    }
  ];

  const contactMethods = [
    { icon: <Phone size={24} />, title: "General Inquiries", detail: "1800-DBI-CARE", sub: "Toll Free (24/7)", color: "var(--color-primary)" },
    { icon: <Mail size={24} />, title: "Email Support", detail: "care@dbi.gov.in", sub: "Response within 2hrs", color: "var(--color-accent)" },
    { icon: <ShieldCheck size={24} />, title: "Fraud Reporting", detail: "1800-DBI-FRAUD", sub: "Instant Response", color: "var(--color-error)" },
    { icon: <MapPin size={24} />, title: "Locate Branch", detail: "Find nearest ATM/Branch", sub: "Across 28 States", color: "var(--color-warning)" }
  ];

  return (
    <div className="page-container fade-in" style={{ padding: '40px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-text-dark)', marginBottom: '15px' }}>
          How can we <span className="text-gradient">help you</span> today?
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
          Search our knowledge base or reach out to our dedicated support team.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '700px', margin: '0 auto 80px', position: 'relative' }}>
        <Search size={24} style={{ position: 'absolute', left: '25px', top: '22px', color: 'var(--color-text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search for topics (e.g. KYC, Transfer, Interest rates)"
          style={{ 
            width: '100%', 
            padding: '22px 25px 22px 65px', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--color-border)',
            fontSize: '1.1rem',
            boxShadow: 'var(--shadow-md)',
            outline: 'none'
          }}
        />
      </div>

      {/* FAQs Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px', alignItems: 'start', marginBottom: '80px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-text-dark)', marginBottom: '20px' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Quick answers to common questions about our services and digital banking platform.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ padding: '15px 30px', textDecoration: 'none' }}>
              Access Portal <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="card" 
                style={{ padding: '20px 25px', cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: i === activeFaq ? 'var(--color-primary)' : 'var(--color-text-dark)' }}>{faq.q}</h4>
                  <ChevronDown size={20} style={{ 
                    transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0)', 
                    transition: '0.3s',
                    color: i === activeFaq ? 'var(--color-primary)' : 'var(--color-text-muted)'
                  }} />
                </div>
                {activeFaq === i && (
                  <p style={{ margin: '15px 0 0', color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6', borderTop: '1px solid var(--color-border)', paddingTop: '15px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
      </div>

      {/* Contact Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '60px' }}>
        {contactMethods.map((method, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: method.color + '15', 
              color: method.color,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              {method.icon}
            </div>
            <h5 style={{ fontWeight: '800', marginBottom: '8px' }}>{method.title}</h5>
            <div style={{ fontWeight: '700', color: 'var(--color-text-dark)', fontSize: '0.95rem' }}>{method.detail}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '5px' }}>{method.sub}</div>
          </div>
        ))}
      </div>

      {/* Security Tip */}
      <div style={{ background: 'var(--color-secondary)', color: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '50%' }}>
          <AlertCircle size={40} color="var(--color-warning)" />
        </div>
        <div>
          <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Security Awareness</h4>
          <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
            Digital Bank of India will never ask for your OTP, Password, or PIN via email, SMS, or phone call. 
            If you receive such a request, report it immediately to our fraud department.
          </p>
        </div>
      </div>

      <footer style={{ marginTop: '80px', textAlign: 'center', paddingBottom: '40px', borderTop: '1px solid var(--color-border)', paddingTop: '40px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          © 2026 Digital Bank of India. Member FDIC. Equal Housing Lender.
        </div>
      </footer>
    </div>
  );
};

export default HelpDesk;
