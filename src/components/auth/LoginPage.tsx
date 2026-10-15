import React, { useState } from 'react';
import { 
  Shield, Lock, Mail, Eye, EyeOff, ArrowRight, Check, Copy, 
  Sparkles, CheckCircle, AlertTriangle, Key, Building2, User,
  Users, Wallet, Smartphone, ShieldCheck, Sun, Moon, Globe
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { RoleType } from '../../types/erp';
import { ShieldLogo } from '../common/ShieldLogo';

interface DemoCredential {
  role: RoleType;
  title: string;
  name: string;
  email: string;
  pass: string;
  badge: string;
  scope: string;
  icon: React.ElementType;
  gradient: string;
}

export const LoginPage: React.FC = () => {
  const { login, theme, toggleTheme, language, toggleLanguage, t } = useERP();

  const [email, setEmail] = useState('admin@safeguardforce.in');
  const [password, setPassword] = useState('Admin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType>('SUPER_ADMIN');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const demoAccounts: DemoCredential[] = [
    {
      role: 'SUPER_ADMIN',
      title: 'Managing Director & Owner',
      name: 'Brig. Alok Sharma (Retd.)',
      email: 'admin@safeguardforce.in',
      pass: 'Admin@2026',
      badge: 'Full Master Access',
      scope: 'Global operations, finance, system audits, client contracts & user RBAC',
      icon: Shield,
      gradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(180, 83, 9, 0.1) 100%)'
    },
    {
      role: 'OPERATIONS_MANAGER',
      title: 'Head of Operations',
      name: 'Maj. Sandeep Batra (Retd.)',
      email: 'ops.manager@safeguardforce.in',
      pass: 'Ops@2026',
      badge: 'Field & Sites Ops',
      scope: 'Shift rosters, post vacancies, geofence breaches, live patrol checkpoints & SOS',
      icon: Users,
      gradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(3, 105, 161, 0.1) 100%)'
    },
    {
      role: 'HR_RECRUITMENT',
      title: 'HR & PSARA Compliance',
      name: 'Pooja Kashyap (HR Manager)',
      email: 'hr@safeguardforce.in',
      pass: 'HR@2026',
      badge: 'HR & Statutory',
      scope: 'Guards onboarding funnel, police verification, ESI/EPF & uniform allocations',
      icon: ShieldCheck,
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(4, 120, 87, 0.1) 100%)'
    },
    {
      role: 'PAYROLL_ACCOUNTS',
      title: 'Finance & Accounts Head',
      name: 'Ramesh Chandra',
      email: 'accounts@safeguardforce.in',
      pass: 'Finance@2026',
      badge: 'Billing & Payroll',
      scope: 'Attendance-linked payroll computation, GST tax invoices & overdue AR collections',
      icon: Wallet,
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(109, 40, 217, 0.1) 100%)'
    },
    {
      role: 'CLIENT_USER',
      title: 'Client VP Security (DLF)',
      name: 'Col. Rajiv Mathur',
      email: 'security.admin@dlfcybercity.com',
      pass: 'Client@2026',
      badge: 'Tenant Isolated',
      scope: 'Live site deployment stats, monthly bill review, SLA tracking & ticket escalation',
      icon: Building2,
      gradient: 'linear-gradient(135deg, rgba(234, 88, 12, 0.25) 0%, rgba(194, 65, 12, 0.1) 100%)'
    },
    {
      role: 'GUARD_FIELD',
      title: 'Field Guard (On Duty)',
      name: 'Vikram Singh Shekhawat',
      email: 'guard@safeguardforce.in',
      pass: 'Guard@2026',
      badge: 'Mobile Duty',
      scope: 'Mobile viewport, GPS attendance punch-in/out, QR patrol logs & SOS emergency trigger',
      icon: Smartphone,
      gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.1) 100%)'
    }
  ];

  const handleSelectDemo = (acc: DemoCredential) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setSelectedRole(acc.role);
  };

  const handleQuickLogin = (acc: DemoCredential) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setSelectedRole(acc.role);
    setIsLoading(true);

    setTimeout(() => {
      login(acc.email, acc.role, acc.name);
      setIsLoading(false);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(email, selectedRole);
      setIsLoading(false);
    }, 450);
  };

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="login-root-container">
      {/* Background Ambient Glows & Grid */}
      <div className="login-ambient-grid" />
      <div className="login-ambient-glow login-glow-1" />
      <div className="login-ambient-glow login-glow-2" />

      {/* Top Bar with Language and Theme controls */}
      <header className="login-top-bar">
        <div className="login-top-brand">
          <ShieldLogo size={34} />
          <div className="login-brand-meta">
            <span className="login-brand-name">SAFE GUARD <span className="gold-text">FORCE</span></span>
            <span className="login-brand-badge">SECURE ERP v2.4</span>
          </div>
        </div>

        <div className="login-top-actions">
          {/* Language Toggle */}
          <div className="login-lang-pill">
            <button 
              className={`login-lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => toggleLanguage()}
              type="button"
            >
              EN
            </button>
            <button 
              className={`login-lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => toggleLanguage()}
              type="button"
            >
              हिन्दी
            </button>
          </div>

          {/* Theme Toggle */}
          <button 
            className="login-theme-btn" 
            onClick={toggleTheme}
            type="button"
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="login-main-viewport">
        <div className="login-layout-grid">
          {/* Left Column: Sign-in Form */}
          <div className="login-card-panel">
            <div className="login-card-header">
              <div className="login-security-tag">
                <ShieldCheck size={14} className="gold-text" />
                <span>PSARA 2005 & ISO 27001 AUTHORIZED TERMINAL</span>
              </div>
              <h1 className="login-card-title">Enterprise Portal Sign In</h1>
              <p className="login-card-desc">
                Sign in with your enterprise credentials or use one of the pre-configured security personas to inspect permissions and views.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email / Username field */}
              <div className="login-field-group">
                <label className="login-label">
                  <span>Official Email or Officer ID</span>
                  <span className="field-required">*</span>
                </label>
                <div className="login-input-wrapper">
                  <Mail size={16} className="login-field-icon" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@safeguardforce.in"
                    className="login-input"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="login-field-group">
                <div className="login-label-row">
                  <label className="login-label">
                    <span>Security Clearance Password</span>
                    <span className="field-required">*</span>
                  </label>
                  <button
                    type="button"
                    className="login-forgot-link"
                    onClick={() => setForgotModalOpen(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="login-input-wrapper">
                  <Lock size={16} className="login-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="login-input"
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Live Guard indicator */}
              <div className="login-options-row">
                <label className="login-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="login-checkbox"
                  />
                  <span>Keep session alive on this terminal</span>
                </label>

                <div className="login-live-pulse">
                  <span className="login-live-dot" />
                  <span>420 Guards Active</span>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="login-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="login-loading-spin">
                    <span className="spinner-border" />
                    <span>Verifying Security Clearance...</span>
                  </span>
                ) : (
                  <>
                    <span>Authenticate & Enter Console</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {/* Instant Bypass Button */}
              <button
                type="button"
                className="login-bypass-btn"
                onClick={() => handleQuickLogin(demoAccounts[0])}
              >
                <Sparkles size={14} className="gold-text" />
                <span>Quick 1-Click Launch (Super Admin)</span>
              </button>
            </form>

            {/* Compliance Footer Badges */}
            <div className="login-compliance-footer">
              <div className="compliance-item">
                <CheckCircle size={13} className="text-success" />
                <span>Form XII/XIV Ready</span>
              </div>
              <div className="compliance-item">
                <CheckCircle size={13} className="text-success" />
                <span>Geofenced GPS</span>
              </div>
              <div className="compliance-item">
                <CheckCircle size={13} className="text-success" />
                <span>GST & ESI Automated</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pre-configured Credentials Selector */}
          <div className="login-credentials-panel">
            <div className="credentials-panel-header">
              <div className="credentials-badge">
                <Key size={14} />
                <span>ROLE-BASED DEMO CREDENTIALS</span>
              </div>
              <h2 className="credentials-title">Select Any Enterprise Persona</h2>
              <p className="credentials-desc">
                Click <strong>"1-Click Sign In"</strong> on any card to automatically populate credentials and launch into that role's isolated permissions:
              </p>
            </div>

            <div className="credentials-grid">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                const isSelected = email === acc.email;

                return (
                  <div 
                    key={acc.role} 
                    className={`credential-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectDemo(acc)}
                  >
                    <div className="credential-top">
                      <div className="credential-icon-box" style={{ background: acc.gradient }}>
                        <Icon size={18} className="gold-text" />
                      </div>
                      <div className="credential-meta">
                        <div className="credential-role-row">
                          <span className="credential-title">{acc.title}</span>
                          <span className="credential-badge-pill">{acc.badge}</span>
                        </div>
                        <span className="credential-name">{acc.name}</span>
                      </div>
                    </div>

                    <p className="credential-scope">{acc.scope}</p>

                    <div className="credential-credentials-box">
                      <div className="cred-field">
                        <span className="cred-label">Login:</span>
                        <code className="cred-val">{acc.email}</code>
                        <button
                          type="button"
                          className="cred-copy-btn"
                          title="Copy Email"
                          onClick={(e) => handleCopy(acc.email, acc.email, e)}
                        >
                          {copiedId === acc.email ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                        </button>
                      </div>

                      <div className="cred-field">
                        <span className="cred-label">Password:</span>
                        <code className="cred-val">{acc.pass}</code>
                        <button
                          type="button"
                          className="cred-copy-btn"
                          title="Copy Password"
                          onClick={(e) => handleCopy(acc.pass, acc.pass, e)}
                        >
                          {copiedId === acc.pass ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>

                    <div className="credential-card-actions">
                      <button
                        type="button"
                        className="cred-autofill-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDemo(acc);
                        }}
                      >
                        Fill Form
                      </button>

                      <button
                        type="button"
                        className="cred-instant-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLogin(acc);
                        }}
                      >
                        <span>1-Click Sign In</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="modal-backdrop" onClick={() => setForgotModalOpen(false)}>
          <div className="login-help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-header">
              <Key size={26} className="gold-text" />
            </div>
            <h3 className="modal-title">Official Credential Recovery</h3>
            <p className="modal-text">
              For security and PSARA compliance guidelines, credential recovery requires verification by your Safe Guard Force System Administrator or IT Security Desk.
            </p>
            <div className="modal-contact-box">
              <div><strong>IT Helpdesk:</strong> support@safeguardforce.in</div>
              <div><strong>Hotline:</strong> +91 (0124) 489-0022</div>
              <div><strong>HQ:</strong> Safe Guard Towers, Sector 44, Gurugram, Haryana</div>
            </div>
            <button 
              className="modal-close-btn"
              onClick={() => setForgotModalOpen(false)}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
