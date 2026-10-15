import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, Sun, Moon, Shield, ChevronDown, 
  Check, LogOut, Smartphone, User, Crown, 
  Building2, Users, Clock, Sparkles, PanelLeft 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { RoleType } from '../../types/erp';

export const TopNav: React.FC = () => {
  const { 
    theme, toggleTheme, 
    language, setLanguage, toggleLanguage, t, 
    activeModule, setActiveModule,
    currentUser, switchRole, logout,
    isSidebarCollapsed, toggleSidebar,
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
      {/* Left: Sidebar Collapse Button */}
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button 
          type="button"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <PanelLeft size={16} />
        </button>
      </div>

      {/* Right: Clean, Sorted Actions matching reference screenshot */}
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

        {/* Theme Toggle */}
        <button 
          type="button"
          className="topbar-icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notification Bell with red counter badge 6 */}
        <button 
          type="button"
          className="topbar-icon-btn"
          onClick={() => setIsNotificationOpen(true)}
          title="Notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={16} />
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#ef4444',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 800,
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)'
          }}>
            6
          </span>
        </button>

        {/* Minimal Language Switcher Pill */}
        <div style={{
          display: 'inline-flex',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          padding: '2px',
          gap: '2px'
        }}>
          <button 
            type="button"
            onClick={() => setLanguage('en')}
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: language === 'en' ? '#0f172a' : 'transparent',
              color: language === 'en' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            EN
          </button>
          <button 
            type="button"
            onClick={() => setLanguage('hi')}
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: language === 'hi' ? '#0f172a' : 'transparent',
              color: language === 'hi' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            हिंदी
          </button>
        </div>

        {/* User Profile Pill matching screenshot */}
        <div className="topbar-dropdown-wrap" ref={profileDropdownRef}>
          <div 
            className="topbar-user-trigger"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            title={`Account: ${currentUser.name}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#0b132b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 800,
              flexShrink: 0
            }}>
              SA
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                SGF Administrator
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                Super Admin
              </span>
            </div>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)', marginLeft: '2px' }} />
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
