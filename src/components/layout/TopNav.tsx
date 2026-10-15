import React, { useState } from 'react';
import { 
  Search, Bell, Sun, Moon, Globe, Shield, 
  ChevronDown, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { RoleType } from '../../types/erp';

export const TopNav: React.FC = () => {
  const { 
    theme, toggleTheme, 
    language, toggleLanguage, t, 
    activeModule, 
    currentUser, switchRole, 
    setIsSearchOpen, 
    setIsNotificationOpen, 
    sosAlerts, incidents, 
    kpis 
  } = useERP();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Unread alerts count (SOS + critical incidents)
  const criticalCount = sosAlerts.filter(s => s.status === 'Triggered' || s.status === 'Acknowledged').length +
                        incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;

  const rolesList: { role: RoleType; label: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin (Owner)' },
    { role: 'MANAGEMENT', label: 'Executive Management' },
    { role: 'OPERATIONS_MANAGER', label: 'Operations Manager' },
    { role: 'SITE_SUPERVISOR', label: 'Site Supervisor' },
    { role: 'HR_RECRUITMENT', label: 'HR & Recruitment' },
    { role: 'PAYROLL_ACCOUNTS', label: 'Payroll & Accounts' },
    { role: 'SALES_CRM', label: 'Sales & CRM Lead' },
    { role: 'CLIENT_USER', label: 'Client Authorized User' },
    { role: 'GUARD_FIELD', label: 'Guard (Field Duty)' }
  ];

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'dashboard': return t('dashboard');
      case 'guards': return t('guards');
      case 'clients': return t('clients');
      case 'sites': return t('sites');
      case 'contracts': return t('contracts');
      case 'deployments': return t('deployments');
      case 'attendance': return t('attendance');
      case 'patrol': return t('patrol');
      case 'incidents': return t('incidents');
      case 'sos': return t('sos');
      case 'recruitment': return t('recruitment');
      case 'hrCompliance': return t('hrCompliance');
      case 'payroll': return t('payroll');
      case 'billing': return t('billing');
      case 'collections': return t('collections');
      case 'crm': return t('crm');
      case 'clientPortal': return t('clientPortal');
      case 'reports': return t('reports');
      case 'fieldMobile': return t('fieldMobile');
      case 'admin': return t('admin');
      case 'helpCenter': return t('helpCenter');
      default: return 'Safe Guard Force';
    }
  };

  return (
    <header className="erp-topbar">
      {/* Left: Breadcrumbs & Contextual Title */}
      <div className="topbar-left">
        <div className="page-breadcrumb">
          <span>Safe Guard Force</span>
          <span>/</span>
          <span className="current">{getModuleTitle()}</span>
        </div>

        {/* Live operational indicator badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--status-success-bg)',
          color: 'var(--status-success-fg)',
          fontSize: '11.5px',
          fontWeight: 600
        }}>
          <CheckCircle size={13} />
          <span>{kpis.activeGuardsCount} Guards Live</span>
        </div>
      </div>

      {/* Right: Search, Role Switcher, Language, Theme, Notifications, Profile */}
      <div className="topbar-right">
        {/* Global Search Button */}
        <button 
          className="global-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          title="Search anything (Cmd+K)"
        >
          <Search size={15} />
          <span>{t('searchPlaceholder')}</span>
          <span className="kbd-shortcut">Ctrl K</span>
        </button>

        {/* Role Switcher Pill */}
        <div style={{ position: 'relative' }}>
          <button 
            className="role-badge-pill"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            title="Switch User Role to test permissions & views"
          >
            <Shield size={14} />
            <span>{currentUser.role.replace('_', ' ')}</span>
            <ChevronDown size={13} />
          </button>

          {isRoleDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '115%',
              right: 0,
              width: '240px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              padding: '6px',
              zIndex: 100,
              animation: 'scaleIn 150ms ease-out'
            }}>
              <div style={{
                padding: '8px 12px 6px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                {t('switchRole')}
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '4px 0' }}>
                {rolesList.map(({ role, label }) => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role);
                      setIsRoleDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12.5px',
                      border: 'none',
                      background: currentUser.role === role ? 'var(--accent-gold-bg)' : 'transparent',
                      color: currentUser.role === role ? 'var(--accent-gold)' : 'var(--text-primary)',
                      fontWeight: currentUser.role === role ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{label}</span>
                    {currentUser.role === role && <CheckCircle size={13} color="var(--accent-gold)" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher (EN | हिन्दी) */}
        <div className="lang-switcher" title="Toggle Language (English / हिंदी)">
          <button 
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => toggleLanguage()}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
            onClick={() => toggleLanguage()}
          >
            हिन्दी
          </button>
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <button 
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? t('lightMode') : t('darkMode')}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications Button */}
        <button 
          className={`icon-btn ${criticalCount > 0 ? 'has-badge' : ''}`}
          onClick={() => setIsNotificationOpen(true)}
          title={t('notifications')}
        >
          <Bell size={17} />
        </button>

        {/* User Profile Pill */}
        <div className="user-profile-btn" title={`Signed in as ${currentUser.name}`}>
          <div className="user-avatar-circle">
            {currentUser.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', paddingRight: '6px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {currentUser.name.split(' ')[0]}
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: 1.1 }}>
              {currentUser.role.toLowerCase().replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
