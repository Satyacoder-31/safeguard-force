import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, Sun, Moon, Globe, Shield, 
  ChevronDown, CheckCircle, AlertTriangle, AlertOctagon, 
  LogOut, Crown, Building2, Users, Smartphone, Clock, 
  Radio, Sparkles, Check, User, ExternalLink
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { RoleType } from '../../types/erp';

export const TopNav: React.FC = () => {
  const { 
    theme, toggleTheme, 
    language, toggleLanguage, t, 
    activeModule, setActiveModule,
    currentUser, switchRole, logout,
    setIsSearchOpen, 
    setIsNotificationOpen, 
    sosAlerts, incidents, 
    kpis 
  } = useERP();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Unread alerts count (SOS + critical incidents)
  const criticalCount = sosAlerts.filter(s => s.status === 'Triggered' || s.status === 'Acknowledged').length +
                        incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;

  const rolesList: { role: RoleType; label: string; group: string; icon: React.ElementType }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin (MD / Owner)', group: 'Enterprise Leadership', icon: Crown },
    { role: 'MANAGEMENT', label: 'Executive Board', group: 'Enterprise Leadership', icon: Crown },
    { role: 'OPERATIONS_MANAGER', label: 'Operations Head', group: 'Command & Field', icon: Shield },
    { role: 'SITE_SUPERVISOR', label: 'Site Supervisor', group: 'Command & Field', icon: Users },
    { role: 'GUARD_FIELD', label: 'Guard (Field Duty)', group: 'Command & Field', icon: Smartphone },
    { role: 'HR_RECRUITMENT', label: 'HR & Compliance', group: 'Back Office & Finance', icon: Users },
    { role: 'PAYROLL_ACCOUNTS', label: 'Payroll & Accounts', group: 'Back Office & Finance', icon: Clock },
    { role: 'SALES_CRM', label: 'Sales & Bidding Head', group: 'Back Office & Finance', icon: Sparkles },
    { role: 'CLIENT_USER', label: 'Client Admin (DLF)', group: 'External Portal', icon: Building2 }
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
      default: return 'Executive Dashboard';
    }
  };

  const getCategoryTitle = () => {
    if (['dashboard', 'sos', 'incidents'].includes(activeModule)) return 'Command';
    if (['guards', 'clients', 'sites', 'deployments', 'attendance', 'patrol'].includes(activeModule)) return 'Operations';
    if (['recruitment', 'hrCompliance', 'fieldMobile'].includes(activeModule)) return 'Workforce';
    if (['contracts', 'payroll', 'billing', 'collections'].includes(activeModule)) return 'Finance';
    return 'Portal';
  };

  return (
    <header className="erp-topbar">
      {/* Left: Breadcrumbs & Live Operation Indicators */}
      <div className="topbar-left">
        <div className="page-breadcrumb">
          <div className="breadcrumb-brand-icon">
            <Shield size={14} className="gold-text" />
          </div>
          <span className="breadcrumb-category">{getCategoryTitle()}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{getModuleTitle()}</span>
        </div>

        {/* Live operational badge */}
        <div className="topbar-live-status-pill">
          <span className="live-status-dot" />
          <span className="live-status-text">
            <strong>{kpis.activeGuardsCount}</strong> Guards Live
          </span>
          <span className="live-status-divider">•</span>
          <span className="live-shift-text">Day Shift</span>
        </div>
      </div>

      {/* Center: Sleek Global Search Trigger */}
      <div className="topbar-center">
        <button 
          className="global-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          title="Search anything across ERP (Cmd+K / Ctrl+K)"
          type="button"
        >
          <Search size={14} className="search-icon" />
          <span className="search-placeholder-text">{t('searchPlaceholder')}</span>
          <span className="kbd-shortcut">Ctrl K</span>
        </button>
      </div>

      {/* Right: Actions, Role Switcher, Controls & User Profile */}
      <div className="topbar-right">
        {/* Quick SOS Emergency Jump Button */}
        <button
          className={`topbar-sos-btn ${criticalCount > 0 ? 'active-alert' : ''}`}
          onClick={() => setActiveModule('sos')}
          title="Emergency SOS Console"
          type="button"
        >
          <AlertOctagon size={15} />
          <span>{criticalCount > 0 ? `${criticalCount} SOS` : 'SOS Console'}</span>
        </button>

        {/* Role Switcher Pill & Dropdown */}
        <div className="topbar-role-dropdown-container" ref={roleDropdownRef}>
          <button 
            className="role-badge-pill"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            title="Switch User Role to test permissions & views"
            type="button"
          >
            <Shield size={13} className="gold-text" />
            <span className="role-text-label">{currentUser.role.replace('_', ' ')}</span>
            <ChevronDown size={12} className={`role-chevron ${isRoleDropdownOpen ? 'rotated' : ''}`} />
          </button>

          {isRoleDropdownOpen && (
            <div className="topbar-role-menu">
              <div className="role-menu-header">
                <span className="role-menu-title">Switch Enterprise Persona</span>
                <span className="role-menu-subtitle">9 Roles Configured</span>
              </div>
              <div className="role-menu-scroll">
                {rolesList.map(({ role, label, icon: RoleIcon }) => {
                  const isCurrent = currentUser.role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        switchRole(role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`role-menu-item ${isCurrent ? 'active' : ''}`}
                    >
                      <div className="role-item-left">
                        <RoleIcon size={14} className={isCurrent ? 'gold-text' : 'muted-text'} />
                        <span className="role-item-name">{label}</span>
                      </div>
                      {isCurrent && <Check size={13} className="gold-text" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher (EN | हिन्दी) */}
        <div className="topbar-lang-pill" title="Toggle Language (English / हिंदी)">
          <button 
            type="button"
            className={`topbar-lang-item ${language === 'en' ? 'active' : ''}`}
            onClick={() => toggleLanguage()}
          >
            EN
          </button>
          <button 
            type="button"
            className={`topbar-lang-item ${language === 'hi' ? 'active' : ''}`}
            onClick={() => toggleLanguage()}
          >
            हिन्दी
          </button>
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <button 
          type="button"
          className="topbar-icon-action"
          onClick={toggleTheme}
          title={theme === 'dark' ? t('lightMode') : t('darkMode')}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications Button */}
        <button 
          type="button"
          className={`topbar-icon-action ${criticalCount > 0 ? 'has-badge' : ''}`}
          onClick={() => setIsNotificationOpen(true)}
          title={t('notifications')}
        >
          <Bell size={16} />
          {criticalCount > 0 && (
            <span className="notification-counter-badge">{criticalCount}</span>
          )}
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="topbar-profile-container" ref={profileDropdownRef}>
          <div 
            className="topbar-user-pill" 
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            title={`Signed in as ${currentUser.name}`}
          >
            <div className="topbar-avatar-circle">
              {currentUser.name ? currentUser.name.charAt(0) : 'A'}
              <span className="avatar-live-indicator" />
            </div>
            <div className="topbar-user-names">
              <span className="user-firstname">{currentUser.name.split(' ')[0]}</span>
              <span className="user-shortrole">{currentUser.role.split('_')[0]}</span>
            </div>
            <ChevronDown size={12} className={`profile-chevron ${isProfileDropdownOpen ? 'rotated' : ''}`} />
          </div>

          {isProfileDropdownOpen && (
            <div className="topbar-profile-menu">
              <div className="profile-menu-header">
                <div className="profile-menu-avatar">
                  {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                </div>
                <div className="profile-menu-meta">
                  <span className="profile-menu-name">{currentUser.name}</span>
                  <span className="profile-menu-email">{currentUser.email}</span>
                  <span className="profile-menu-role-badge">{currentUser.role.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="profile-menu-links">
                <button 
                  type="button" 
                  className="profile-menu-item"
                  onClick={() => {
                    setActiveModule('fieldMobile');
                    setIsProfileDropdownOpen(false);
                  }}
                >
                  <Smartphone size={14} />
                  <span>Mobile Field Duty View</span>
                </button>

                <button 
                  type="button" 
                  className="profile-menu-item"
                  onClick={() => {
                    setActiveModule('admin');
                    setIsProfileDropdownOpen(false);
                  }}
                >
                  <Shield size={14} />
                  <span>System Administration & Logs</span>
                </button>

                <button 
                  type="button" 
                  className="profile-menu-item"
                  onClick={() => {
                    setActiveModule('clientPortal');
                    setIsProfileDropdownOpen(false);
                  }}
                >
                  <Building2 size={14} />
                  <span>Client Self-Service Portal</span>
                </button>
              </div>

              <div className="profile-menu-footer">
                <button
                  type="button"
                  className="profile-logout-btn"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out to Login Page</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
