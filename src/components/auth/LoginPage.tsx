import React, { useState } from 'react';
import { 
  Shield, Lock, Mail, Eye, EyeOff, ArrowRight, 
  Crown, Building2, Smartphone, Users, CheckCircle, 
  Sun, Moon, Globe, KeyRound
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { RoleType } from '../../types/erp';
import { ShieldLogo } from '../common/ShieldLogo';

interface DemoPersona {
  role: RoleType;
  title: string;
  name: string;
  email: string;
  pass: string;
  badge: string;
  desc: string;
  icon: React.ElementType;
}

export const LoginPage: React.FC = () => {
  const { login, theme, toggleTheme, language, toggleLanguage } = useERP();

  const [email, setEmail] = useState('admin@safeguardforce.in');
  const [password, setPassword] = useState('Admin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const demoPersonas: DemoPersona[] = [
    {
      role: 'SUPER_ADMIN',
      title: 'Managing Director & Owner',
      name: 'Brig. Alok Sharma (Retd.)',
      email: 'admin@safeguardforce.in',
      pass: 'Admin@2026',
      badge: 'Full Access',
      desc: 'Complete control: Financials, Client Invoicing, Global Rosters & System Audit Logs.',
      icon: Crown
    },
    {
      role: 'OPERATIONS_MANAGER',
      title: 'Head of Operations',
      name: 'Maj. Sandeep Batra (Retd.)',
      email: 'ops.manager@safeguardforce.in',
      pass: 'Ops@2026',
      badge: 'Site Operations',
      desc: 'Shift rosters, post shortages, GPS attendance review, QR patrols & SOS dispatch.',
      icon: Shield
    },
    {
      role: 'CLIENT_USER',
      title: 'Corporate Client VP (DLF)',
      name: 'Col. Rajiv Mathur',
      email: 'security.admin@dlfcybercity.com',
      pass: 'Client@2026',
      badge: 'Tenant Isolated',
      desc: 'Client self-service portal: Live site guard count, monthly invoices & SLA reports.',
      icon: Building2
    },
    {
      role: 'GUARD_FIELD',
      title: 'Field Guard (On Duty)',
      name: 'Vikram Singh Shekhawat',
      email: 'guard@safeguardforce.in',
      pass: 'Guard@2026',
      badge: 'Mobile View',
      desc: 'Mobile-first field screen: GPS punch-in/out, QR tag patrol scanning & emergency SOS.',
      icon: Smartphone
    }
  ];

  const handleLaunchPersona = (persona: DemoPersona) => {
    setEmail(persona.email);
    setPassword(persona.pass);
    setIsLoading(true);

    setTimeout(() => {
      login(persona.email, persona.role, persona.name);
      setIsLoading(false);
    }, 350);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(email);
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="clean-login-screen">
      {/* Subtle Ambient Background */}
      <div className="login-backdrop-glow" />

      {/* Minimal Header */}
      <header className="clean-login-header">
        <div className="clean-brand-box">
          <ShieldLogo size={32} />
          <div className="clean-brand-text">
            <span className="brand-title-text">SAFE GUARD <span className="gold">FORCE</span></span>
            <span className="brand-subtitle-text">ENTERPRISE SECURITY ERP</span>
          </div>
        </div>

        <div className="clean-header-actions">
          {/* Language Switcher */}
          <button 
            type="button" 
            className="clean-text-btn" 
            onClick={toggleLanguage}
          >
            <Globe size={14} />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Theme Switcher */}
          <button 
            type="button" 
            className="clean-icon-action" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Main Content: 2-Column Balanced Layout */}
      <main className="clean-login-body">
        <div className="clean-login-grid">
          {/* Left Column: Sign In Form */}
          <div className="login-form-card">
            <div className="form-card-header">
              <span className="security-auth-badge">
                <CheckCircle size={12} className="gold" />
                <span>PSARA 2005 & ISO 27001 AUTHORIZED</span>
              </span>
              <h1 className="form-main-heading">Sign in to Console</h1>
              <p className="form-sub-heading">
                Enter your official enterprise credentials or launch any role below for a live walkthrough.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="actual-form">
              <div className="form-input-group">
                <label className="input-label">Official Email or Officer ID</label>
                <div className="input-field-wrap">
                  <Mail size={15} className="field-icon" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@safeguardforce.in"
                    className="clean-input"
                  />
                </div>
              </div>

              <div className="form-input-group">
                <label className="input-label">Security Password</label>
                <div className="input-field-wrap">
                  <Lock size={15} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="clean-input"
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-checkbox">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Keep session alive</span>
                </label>
                <span className="login-hint-text">Auto-demo enabled</span>
              </div>

              <button 
                type="submit" 
                className="clean-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Safe Guard Force ERP</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="form-card-footer">
              <div className="compliance-row">
                <span>🛡️ PSARA Form XII/XIV Ready</span>
                <span>•</span>
                <span>📍 GPS Geofenced</span>
                <span>•</span>
                <span>🔒 256-Bit Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right Column: 1-Click Demo Personas */}
          <div className="login-demo-card">
            <div className="demo-card-header">
              <div className="demo-header-tag">
                <KeyRound size={13} className="gold" />
                <span>CLIENT DEMO ACCESS</span>
              </div>
              <h2 className="demo-main-heading">1-Click Walkthrough Accounts</h2>
              <p className="demo-sub-heading">
                Click any persona below to immediately launch the ERP under that specific view and permissions:
              </p>
            </div>

            <div className="demo-personas-list">
              {demoPersonas.map((persona) => {
                const Icon = persona.icon;
                const isSelected = email === persona.email;

                return (
                  <div 
                    key={persona.role}
                    className={`persona-item-card ${isSelected ? 'active-persona' : ''}`}
                    onClick={() => handleLaunchPersona(persona)}
                  >
                    <div className="persona-icon-circle">
                      <Icon size={18} className="gold" />
                    </div>

                    <div className="persona-details">
                      <div className="persona-top-row">
                        <span className="persona-role-title">{persona.title}</span>
                        <span className="persona-role-pill">{persona.badge}</span>
                      </div>
                      <span className="persona-officer-name">{persona.name}</span>
                      <p className="persona-scope-text">{persona.desc}</p>
                      
                      <div className="persona-creds-preview">
                        <code>{persona.email}</code>
                        <span className="cred-sep">•</span>
                        <code>{persona.pass}</code>
                      </div>
                    </div>

                    <div className="persona-action-col">
                      <button 
                        type="button"
                        className="persona-launch-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchPersona(persona);
                        }}
                      >
                        Launch
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
    </div>
  );
};
