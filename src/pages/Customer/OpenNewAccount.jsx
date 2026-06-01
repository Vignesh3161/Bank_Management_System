import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, AlertCircle, ArrowRight, ArrowLeft, 
  CheckCircle, Copy, Sparkles, HelpCircle, 
  ChevronRight, BadgeInfo, Landmark
} from 'lucide-react';
import apiService from '../../services/apiService';
import toast from 'react-hot-toast';

const OpenNewAccount = () => {
  const navigate = useNavigate();
  const [kycStatus, setKycStatus] = useState('LOADING'); // LOADING, VERIFIED, PENDING, SUBMITTED, REJECTED, NONE
  const [kycDetails, setKycDetails] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState('SAVINGS');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const { data } = await apiService.kyc.getStatus();
      setKycStatus(data.status); // e.g. VERIFIED, PENDING, REJECTED, NOT_SUBMITTED
      setKycDetails(data.details);
    } catch (err) {
      console.error(err);
      setKycStatus('NONE');
    }
  };

  const handleOpenAccount = async () => {
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions to proceed.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await apiService.accounts.openAccount({ account_type: accountType });
      toast.success("Account opened successfully!");
      setCreatedAccount(data);
      setCurrentStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to open account.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const accountOptions = [
    {
      id: 'SAVINGS',
      name: 'Premium Savings Account',
      tagline: 'Ideal for personal wealth & daily high-yield savings.',
      features: [
        '4.5% Annual Interest Rate, paid monthly',
        'Zero balance requirement for Premium tier',
        'Free Platinum Debit Card & Cheque book',
        '24/7 Priority customer support access'
      ],
      limits: 'Daily limit: ₹1,00,000',
      badge: 'Most Popular',
      color: '#0D9488' // teal
    },
    {
      id: 'CURRENT',
      name: 'Business Current Account',
      tagline: 'Best suited for entrepreneurs, businesses & high transactions.',
      features: [
        'Unlimited monthly deposits & withdrawals',
        'Commercial overdraft facility (subject to approval)',
        'Bulk pay-out & vendor payment integrations',
        'Monthly e-statements with deep analytical insights'
      ],
      limits: 'Daily limit: ₹5,00,000',
      badge: 'Business Class',
      color: '#2563EB' // blue
    }
  ];

  if (kycStatus === 'LOADING') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '15px' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>Verifying security credentials & KYC status...</p>
      </div>
    );
  }

  // 1. KYC NOT VERIFIED VIEW
  if (kycStatus !== 'VERIFIED') {
    const getKycStatusInfo = () => {
      switch (kycStatus) {
        case 'SUBMITTED':
        case 'PENDING':
          return {
            title: 'KYC Verification In Progress',
            desc: 'Your Know-Your-Customer (KYC) documents have been submitted and are currently undergoing secure review by our compliance desk.',
            alertColor: '#EAB308',
            btnText: 'Check KYC Status Updates',
            icon: <BadgeInfo size={40} color="#EAB308" />
          };
        case 'REJECTED':
          return {
            title: 'KYC Document Rejected',
            desc: `Unfortunately, your previous KYC documents were rejected. Reason: "${kycDetails?.reject_reason || 'Incomplete or blurry document scans'}"`,
            alertColor: '#EF4444',
            btnText: 'Re-submit KYC Verification',
            icon: <AlertCircle size={40} color="#EF4444" />
          };
        default:
          return {
            title: 'KYC Verification Required',
            desc: 'Under reserve bank regulations, you must verify your identity with a secure KYC (Aadhaar/PAN) submission before opening digital bank accounts.',
            alertColor: '#3B82F6',
            btnText: 'Initiate Secure KYC Process',
            icon: <Landmark size={40} color="#3B82F6" />
          };
      }
    };

    const info = getKycStatusInfo();

    return (
      <div className="page-container fade-in" style={{ maxWidth: '750px', margin: '0 auto', padding: '20px' }}>
        <div className="glass card" style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative', overflow: 'hidden' }}>
          
          {/* Subtle gradient background highlight */}
          <div style={{
            position: 'absolute', top: '-10%', left: '-10%', width: '30%', height: '30%',
            background: `radial-gradient(circle, ${info.alertColor}15 0%, transparent 70%)`,
            zIndex: 0, pointerEvents: 'none'
          }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 1, position: 'relative' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {info.icon}
            </div>

            <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '12px' }}>{info.title}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '580px', marginBottom: '30px' }}>
              {info.desc}
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '500px',
              textAlign: 'left', marginBottom: '35px'
            }}>
              <h4 style={{ color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.95rem' }}>
                <ShieldCheck size={16} color="var(--color-accent)" /> 
                Why is identity verification mandatory?
              </h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                To combat money laundering, guarantee cryptographic transaction signatures, and ensure compliant branch operations, we enforce automated KYC verification for all Premium and Core accounts.
              </p>
            </div>

            <button 
              onClick={() => navigate('/customer/kyc')} 
              style={{
                background: `linear-gradient(135deg, ${info.alertColor}dd, ${info.alertColor}99)`,
                color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '12px',
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px',
                cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 4px 15px ${info.alertColor}20`,
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${info.alertColor}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = `0 4px 15px ${info.alertColor}20`;
              }}
            >
              {info.btnText}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. STAGE 1 & 2: ACCOUNT SELECTION & CONFIRMATION
  return (
    <div className="page-container fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      {/* Wizard Header Progress Tracker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '35px', padding: '0 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Landmark size={28} color="var(--color-accent)" />
          <div>
            <h1 className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>Open a Digital Account</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: 0 }}>Start earning interest with our high-yield digital accounts</p>
          </div>
        </div>

        {/* Custom Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '600', fontSize: '0.85rem',
                border: currentStep >= step ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.1)',
                background: currentStep === step ? 'var(--color-accent)' : currentStep > step ? 'rgba(13, 148, 136, 0.15)' : 'rgba(255,255,255,0.02)',
                color: currentStep === step ? '#0A192F' : currentStep > step ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                transition: 'all 0.3s'
              }}>
                {currentStep > step ? <CheckCircle size={16} /> : step}
              </div>
              {step < 3 && (
                <div style={{
                  width: '40px', height: '2px',
                  background: currentStep > step ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'
                }}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Account Type Selection */}
      {currentStep === 1 && (
        <div className="fade-in">
          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '20px', fontWeight: '500' }}>Choose Account Tier</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '25px', marginBottom: '35px' }}>
            {accountOptions.map((opt) => (
              <div 
                key={opt.id}
                onClick={() => setAccountType(opt.id)}
                className={`glass card ${accountType === opt.id ? 'active' : ''}`}
                style={{
                  padding: '30px', borderRadius: '20px', cursor: 'pointer',
                  border: accountType === opt.id ? `2px solid ${opt.color}` : '2px solid rgba(255,255,255,0.05)',
                  background: accountType === opt.id ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255,255,255,0.01)',
                  transition: 'all 0.25s', position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 30px ${opt.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Visual Glow */}
                <div style={{
                  position: 'absolute', top: '-20%', right: '-20%', width: '50%', height: '50%',
                  background: `radial-gradient(circle, ${opt.color}10 0%, transparent 70%)`,
                  zIndex: 0, pointerEvents: 'none'
                }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', zIndex: 1, position: 'relative' }}>
                  <span style={{
                    background: `${opt.color}20`, color: opt.color,
                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600'
                  }}>
                    {opt.badge}
                  </span>
                  
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    border: accountType === opt.id ? `6px solid ${opt.color}` : '2px solid rgba(255,255,255,0.2)',
                    background: '#0A192F', transition: 'all 0.2s'
                  }}></div>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: '600', marginBottom: '8px', zIndex: 1, position: 'relative' }}>{opt.name}</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.4', zIndex: 1, position: 'relative' }}>
                  {opt.tagline}
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', zIndex: 1, position: 'relative' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {opt.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                        <CheckCircle size={14} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div style={{
                    fontSize: '0.75rem', color: opt.color, background: `${opt.color}0a`,
                    padding: '8px 12px', borderRadius: '8px', display: 'inline-block', fontWeight: '500'
                  }}>
                    {opt.limits}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setCurrentStep(2)}
              style={{
                background: 'var(--color-accent)', color: '#0A192F', border: 'none',
                padding: '12px 28px', borderRadius: '10px', fontWeight: '600',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              Continue to Confirm
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Terms & Core Configurations */}
      {currentStep === 2 && (
        <div className="glass card fade-in" style={{ padding: '35px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '10px', fontWeight: '600' }}>Confirm Account Open Details</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '25px' }}>
            You are opening a new digital bank account. Please review configuration choices and authorize terms.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '15px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>SELECTED ACCOUNT TIER</span>
              <strong style={{ fontSize: '1rem', color: 'var(--color-accent)' }}>
                {accountOptions.find(o => o.id === accountType)?.name}
              </strong>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '15px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>INITIAL DEPOSIT</span>
              <strong style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>₹0.00 (Zero Minimum Requirement)</strong>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '16px', padding: '20px', marginBottom: '35px'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-primary)', fontSize: '0.9rem', marginBottom: '12px' }}>
              <ShieldCheck size={18} color="var(--color-accent)" />
              Security & Compliance Disclosures
            </h4>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p>• In keeping with global security standards, all operations on this account are protected by RSA cryptographic digital signatures to ensure data auditability.</p>
              <p>• Any suspicious transfers exceeding ₹1,00,000 are subject to automated fraud analysis, branch verification, and holding queues to prevent account takeover attacks.</p>
              <p>• By clicking the checkbox below, you acknowledge and agree that your registered mobile number is verified, and you consent to the terms of digital banking service usage.</p>
            </div>
          </div>

          <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', marginBottom: '35px', alignItems: 'flex-start' }}>
            <input 
              type="checkbox" 
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              style={{
                width: '20px', height: '20px', borderRadius: '4px',
                accentColor: 'var(--color-accent)', cursor: 'pointer', flexShrink: 0, marginTop: '2px'
              }}
            />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
              I certify that I have read, understood, and agree to be bound by the Digital Bank of India’s Terms of Compliance, Electronic Signatures Disclosures, and Privacy Policy.
            </span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={() => setCurrentStep(1)}
              style={{
                background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 24px', borderRadius: '10px', fontWeight: '600',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button 
              onClick={handleOpenAccount}
              disabled={submitting || !acceptTerms}
              style={{
                background: 'var(--color-accent)', color: '#0A192F', border: 'none',
                padding: '12px 28px', borderRadius: '10px', fontWeight: '600',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                transition: 'all 0.2s', opacity: (!acceptTerms || submitting) ? '0.5' : '1',
                pointerEvents: (!acceptTerms || submitting) ? 'none' : 'auto'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              {submitting ? 'Opening Account...' : 'Open Digital Account'}
              <Sparkles size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success & Copy Details */}
      {currentStep === 3 && createdAccount && (
        <div className="glass card fade-in" style={{
          padding: '45px', borderRadius: '24px', border: '1px solid rgba(13, 148, 136, 0.2)',
          textAlign: 'center', position: 'relative', overflow: 'hidden'
        }}>
          {/* Visual Glow Success */}
          <div style={{
            position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
            background: 'radial-gradient(circle, rgba(13, 148, 136, 0.12) 0%, transparent 70%)',
            zIndex: 0, pointerEvents: 'none'
          }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
            <div style={{
              background: 'rgba(13, 148, 136, 0.08)', padding: '24px', borderRadius: '50%',
              border: '2px dashed var(--color-accent)', marginBottom: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle size={44} color="var(--color-accent)" />
            </div>

            <span style={{
              background: 'rgba(13, 148, 136, 0.15)', color: 'var(--color-accent)',
              padding: '4px 16px', borderRadius: '20px', fontSize: '0.75rem',
              fontWeight: '600', marginBottom: '16px'
            }}>
              Core Node Activated
            </span>

            <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '10px' }}>
              Congratulations!
            </h1>
            
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: '1.5', maxWidth: '500px', marginBottom: '35px' }}>
              Your premium digital account has been created successfully. The system has automatically loaded your initial balance and registered your device keys.
            </p>

            {/* Account Details Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '480px',
              marginBottom: '35px', textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>ACCOUNT TYPE</span>
                <span style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem', fontWeight: '600' }}>
                  {accountType}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>ACCOUNT NUMBER</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ color: 'var(--color-text-primary)', fontSize: '1.05rem', letterSpacing: '1px', fontFamily: 'monospace' }}>
                    {createdAccount?.account_number}
                  </strong>
                  <button 
                    onClick={() => copyToClipboard(createdAccount?.account_number)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                      color: copied ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      display: 'flex', alignItems: 'center', transition: 'color 0.2s'
                    }}
                    title="Copy Account Number"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>STATUS</span>
                <span style={{
                  color: 'var(--color-accent)', background: 'rgba(13, 148, 136, 0.1)',
                  padding: '2px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600'
                }}>
                  ACTIVE
                </span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/customer/dashboard')}
              style={{
                background: 'var(--color-accent)', color: '#0A192F', border: 'none',
                padding: '14px 35px', borderRadius: '12px', fontWeight: '600',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenNewAccount;
