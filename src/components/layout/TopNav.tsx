import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, Sun, Moon, Shield, ChevronDown, 
  Check, LogOut, Smartphone, User, Crown, 
  Building2, Users, Clock, Sparkles
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

  const criticalCount = sosAlerts.filter(s => s.status === 'Triggered' || s.status === 'Acknowledged').length +
                        incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;

  const rolesList: { role: RoleType; label: string; icon: React.ElementType }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin (Owner)', icon: Crown },
    { role: 'OPERATIONS_MANAGER', label: 'Operations Head', icon: Shield },
    { role: 'HR_RECRUITMENT', label: 'HR & Compliance', icon: Users },
    { role: 'PAYROLL_ACCOUNTS', label: 'Payroll & Accounts', icon: Clock },
    { role: 'CLIENT_USER', label: 'Client Admin (DLF)', icon: Building2 },
    { role: 'GUARD_FIELD', label: 'Guard (Field Duty)', icon: Smartphone }
  ];

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'dashboard': return t('dashboard') || 'Executive Dashboard';
      case 'guards': return t('guards') || 'Guard Directory';
      case 'clients': return t('clients') || 'Clients & Branches';
      case 'sites': return t('sites') || 'Sites & Geofencing';
      case 'contracts': return t('contracts') || 'Contracts & Rates';
      case 'deployments': return t('deployments') || 'Deployments & Rosters';
      case 'attendance': return t('attendance') || 'GPS Live Attendance';
      case 'patrol': return t('patrol') || 'Patrol & Checkpoints';
      case 'incidents': return t('incidents') || 'Incident Management';
      case 'sos': return t('sos') || 'SOS & Emergency Center';
      case 'recruitment': return t('recruitment') || 'Recruitment Funnel';
      case 'hrCompliance': return t('hrCompliance') || 'Leave & Compliance';
      case 'payroll': return t('payroll') || 'Payroll & Salaries';
      case 'billing': return t('billing') || 'Client Invoicing';
      case 'collections': return t('collections') || 'Collections & AR';
      case 'crm': return t('crm') || 'CRM & Sales Pipeline';
      case 'clientPortal': return t('clientPortal') || 'Client Self-Service';
      case 'reports': return t('reports') || 'Reports & Analytics';
      case 'fieldMobile': return t('fieldMobile') || 'Mobile Field Duty';
      case 'admin': return t('admin') || 'System Administration';
      case 'helpCenter': return t('helpCenter') || 'SOPs & Onboarding';
      default: return 'Executive Dashboard';
    }
  };

  return (
    <header className="erp-topbar">
      {/* Left: Clean Breadcrumb & Title */}
      <div className="topbar-left">
        <div className="topbar-title-wrap">
          <span className="topbar-page-title">{getModuleTitle()}</span>
          <span className="topbar-system-indicator">
            <span className="indicator-dot" />
            <span className="indicator-text">{kpis.activeGuardsCount} Guards Live</span>
          </span>
        </div>
      </div>

      {/* Right: Clean, Sorted Actions */}
      <div className="topbar-right">
        {/* Minimal Global Search Trigger */}
        <button 
          className="topbar-search-btn"
          onClick={() => setIsSearchOpen(true)}
          title="Search anything (Ctrl+K)"
          type="button"
        >
          <Search size={14} className="search-icon" />
          <span className="search-text">Search...</span>
          <span className="search-kbd">Ctrl K</span>
        </button>

        <div className="topbar-divider" />

        {/* Clean Role Switcher Dropdown */}
        <div className="topbar-dropdown-wrap" ref={roleDropdownRef}>
          <button 
            className="topbar-role-selector"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            title="Switch demo persona to test views"
            type="button"
          >
            <span className="role-dot" />
            <span className="role-label">{currentUser.role.replace('_', ' ')}</span>
            <ChevronDown size={12} className={`role-arrow ${isRoleDropdownOpen ? 'open' : ''}`} />
          </button>

          {isRoleDropdownOpen && (
            <div className="clean-dropdown-menu role-menu">
              <div className="dropdown-label">Select Demo Persona</div>
              {rolesList.map(({ role, label, icon: RoleIcon }) => {
                const isSelected = currentUser.role === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      switchRole(role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`dropdown-item ${isSelected ? 'active' : ''}`}
                  >
                    <RoleIcon size={14} className={isSelected ? 'item-icon gold' : 'item-icon'} />
                    <span className="item-text">{label}</span>
                    {isSelected && <Check size={13} className="item-check" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Minimal Language Switcher */}
        <div className="topbar-lang-toggle">
          <button 
            type="button"
            className={`lang-option ${language === 'en' ? 'active' : ''}`}
            onClick={() => toggleLanguage()}
          >
            EN
          </button>
          <span className="lang-sep">/</span>
          <button 
            type="button"
            className={`lang-option ${language === 'hi' ? 'active' : ''}`}
            onClick={() => toggleLanguage()}
          >
            हिन्दी
          </button>
        </div>

        {/* Theme Toggle */}
        <button 
          type="button"
          className="topbar-icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notification Bell */}
        <button 
          type="button"
          className={`topbar-icon-btn ${criticalCount > 0 ? 'has-alerts' : ''}`}
          onClick={() => setIsNotificationOpen(true)}
          title="Notifications"
        >
          <Bell size={15} />
          {criticalCount > 0 && <span className="notification-dot" />}
        </button>

        {/* User Profile Menu */}
        <div className="topbar-dropdown-wrap" ref={profileDropdownRef}>
          <div 
            className="topbar-user-trigger"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            title={`Account: ${currentUser.name}`}
          >
            <div className="user-avatar">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <span className="user-name">{currentUser.name.split(' ')[0]}</span>
            <ChevronDown size={11} className={`user-arrow ${isProfileDropdownOpen ? 'open' : ''}`} />
          </div>

          {isProfileDropdownOpen && (
            <div className="clean-dropdown-menu profile-menu">
              <div className="profile-header-box">
                <span className="profile-fullname">{currentUser.name}</span>
                <span className="profile-email">{currentUser.email}</span>
                <span className="profile-role-tag">{currentUser.role.replace('_', ' ')}</span>
              </div>

              <div className="dropdown-divider" />

              <button 
                type="button" 
                className="dropdown-item"
                onClick={() => {
                  setActiveModule('fieldMobile');
                  setIsProfileDropdownOpen(false);
                }}
              >
                <Smartphone size={14} className="item-icon" />
                <span className="item-text">Mobile Guard Duty View</span>
              </button>

              <button 
                type="button" 
                className="dropdown-item"
                onClick={() => {
                  setActiveModule('admin');
                  setIsProfileDropdownOpen(false);
                }}
              >
                <Shield size={14} className="item-icon" />
                <span className="item-text">System Settings & Logs</span>
              </button>

              <div className="dropdown-divider" />

              <button 
                type="button" 
                className="dropdown-item logout-item"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  logout();
                }}
              >
                <LogOut size={14} className="item-icon danger" />
                <span className="item-text danger">Sign Out to Login Page</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
