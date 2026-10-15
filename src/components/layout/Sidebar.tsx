import React from 'react';
import { 
  LayoutDashboard, Users, Building2, MapPin, FileSpreadsheet, 
  CalendarClock, Clock, Navigation, ShieldAlert, AlertOctagon, 
  UserPlus, CheckSquare, Wallet, Receipt, Landmark, Target, 
  ExternalLink, BarChart3, Settings, HelpCircle, ChevronLeft, 
  ChevronRight, Smartphone, LogOut, Bell, ShieldCheck
} from 'lucide-react';
import { useERP, NavigationModule } from '../../context/ERPContext';
import { ShieldLogo } from '../common/ShieldLogo';

interface NavItem {
  id: NavigationModule;
  labelKey: string;
  defaultLabel: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: 'danger' | 'warning' | 'neutral';
  action?: () => void;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { 
    activeModule, setActiveModule, 
    isSidebarCollapsed, toggleSidebar, 
    setIsNotificationOpen,
    t, 
    sosAlerts, incidents, shifts, 
    currentUser, logout 
  } = useERP();

  const activeSOS = sosAlerts.filter(s => s.status === 'Triggered' || s.status === 'Acknowledged').length;
  const openIncidents = incidents.filter(i => i.status !== 'Closed' && i.status !== 'Resolved').length;
  const vacancies = shifts.filter(s => s.status === 'Shortage').length;

  const sections: NavSection[] = [
    {
      heading: 'GENERAL',
      items: [
        { id: 'dashboard', labelKey: 'dashboard', defaultLabel: 'Dashboard', icon: LayoutDashboard },
        { id: 'helpCenter', labelKey: 'howToUse', defaultLabel: 'How to use', icon: HelpCircle },
        { id: 'reports', labelKey: 'reports', defaultLabel: 'Reports', icon: BarChart3 },
        { 
          id: 'dashboard', 
          labelKey: 'notifications', 
          defaultLabel: 'Notifications', 
          icon: Bell,
          action: () => setIsNotificationOpen(true),
          badge: '6',
          badgeColor: 'danger'
        }
      ]
    },
    {
      heading: 'OPERATIONS',
      items: [
        { id: 'guards', labelKey: 'guards', defaultLabel: 'Guards Master', icon: Users },
        { id: 'clients', labelKey: 'clients', defaultLabel: 'Clients & Sites', icon: Building2 },
        { 
          id: 'deployments', 
          labelKey: 'deployments', 
          defaultLabel: 'Deployments & Rosters', 
          icon: CalendarClock,
          badge: vacancies > 0 ? `${vacancies} vacant` : undefined,
          badgeColor: 'warning'
        },
        { id: 'attendance', labelKey: 'attendance', defaultLabel: 'GPS Live Attendance', icon: Clock },
        { id: 'patrol', labelKey: 'patrol', defaultLabel: 'Patrol & Checkpoints', icon: Navigation },
        { id: 'recruitment', labelKey: 'recruitment', defaultLabel: 'Recruitment Funnel', icon: UserPlus },
        { id: 'hrCompliance', labelKey: 'hrCompliance', defaultLabel: 'Leave & Compliance', icon: CheckSquare },
        { 
          id: 'sos', 
          labelKey: 'sos', 
          defaultLabel: 'Emergency SOS', 
          icon: AlertOctagon,
          badge: activeSOS > 0 ? 'ALERT' : undefined,
          badgeColor: 'danger'
        },
        { 
          id: 'incidents', 
          labelKey: 'incidents', 
          defaultLabel: 'Incident Management', 
          icon: ShieldAlert,
          badge: openIncidents > 0 ? `${openIncidents}` : undefined,
          badgeColor: 'neutral'
        }
      ]
    },
    {
      heading: 'COMMERCIALS',
      items: [
        { id: 'contracts', labelKey: 'contracts', defaultLabel: 'Contracts & Rates', icon: FileSpreadsheet },
        { id: 'payroll', labelKey: 'payroll', defaultLabel: 'Payroll & Salaries', icon: Wallet },
        { id: 'billing', labelKey: 'billing', defaultLabel: 'Client Invoicing & GST', icon: Receipt },
        { id: 'collections', labelKey: 'collections', defaultLabel: 'Collections & Ageing', icon: Landmark },
        { id: 'crm', labelKey: 'crm', defaultLabel: 'Sales & CRM Pipeline', icon: Target },
        { id: 'clientPortal', labelKey: 'clientPortal', defaultLabel: 'Client Portal (DLF)', icon: ExternalLink },
        { id: 'fieldMobile', labelKey: 'fieldMobile', defaultLabel: 'Guard Mobile App', icon: Smartphone }
      ]
    },
    {
      heading: 'SETUP',
      items: [
        { id: 'admin', labelKey: 'branches', defaultLabel: 'Branches', icon: Building2 },
        { id: 'admin', labelKey: 'users', defaultLabel: 'Users', icon: Users },
        { id: 'admin', labelKey: 'roles', defaultLabel: 'Roles & permissions', icon: ShieldCheck },
        { id: 'admin', labelKey: 'masters', defaultLabel: 'Masters', icon: CheckSquare },
        { id: 'admin', labelKey: 'customFields', defaultLabel: 'Custom fields', icon: Settings },
        { id: 'admin', labelKey: 'settings', defaultLabel: 'Settings', icon: Settings },
        { id: 'admin', labelKey: 'auditLog', defaultLabel: 'Audit log', icon: Clock },
        { id: 'admin', labelKey: 'apiWebhooks', defaultLabel: 'API keys & webhooks', icon: FileSpreadsheet }
      ]
    }
  ];

  return (
    <aside className={`clean-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand-row">
        <div 
          className="brand-identity"
          onClick={() => setActiveModule('dashboard')}
          title="Safe Guard Force ERP"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <ShieldLogo size={28} />
          {!isSidebarCollapsed && (
            <div className="brand-titles" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-main" style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                Safe Guard Force
              </span>
              <span className="brand-tag" style={{ color: 'var(--brand-gold-400)', letterSpacing: '0.14em', fontSize: '10px', fontWeight: 800 }}>
                ERP
              </span>
            </div>
          )}
        </div>

        <button 
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          type="button"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="sidebar-nav-container">
        {sections.map((sec, idx) => (
          <div key={idx} className="sidebar-section">
            {!isSidebarCollapsed && (
              <div className="section-label">{sec.heading}</div>
            )}

            <div className="section-items">
              {sec.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id && !item.action;
                const label = t(item.labelKey) || item.defaultLabel;

                return (
                  <button
                    key={`${item.id}-${itemIdx}`}
                    className={`nav-row-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        setActiveModule(item.id);
                      }
                    }}
                    title={isSidebarCollapsed ? label : undefined}
                    type="button"
                  >
                    <Icon className="nav-icon" size={17} />
                    {!isSidebarCollapsed && (
                      <span className="nav-text">{label}</span>
                    )}
                    {!isSidebarCollapsed && item.badge && (
                      <span className={`nav-badge ${item.badgeColor || 'neutral'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer matching reference screenshot */}
      {!isSidebarCollapsed && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#070d1e'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>
            Safe Guard Force ERP
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            Since 1990 • Security & Facility Management
          </div>
        </div>
      )}

      {/* Sidebar Footer User Card */}
      <div className="sidebar-bottom-user">
        <div className="user-info-group">
          <div className="user-circle">
            {currentUser.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          {!isSidebarCollapsed && (
            <div className="user-text-col">
              <span className="user-display-name">
                {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1] || ''}
              </span>
              <span className="user-display-role">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>

        <button 
          className="sidebar-signout-btn"
          onClick={logout}
          title="Sign out to Login screen"
          type="button"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
};
