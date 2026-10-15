import React from 'react';
import { 
  LayoutDashboard, Users, Building2, MapPin, FileSpreadsheet, 
  CalendarClock, Clock, Navigation, ShieldAlert, AlertOctagon, 
  UserPlus, CheckSquare, Wallet, Receipt, Landmark, Target, 
  ExternalLink, BarChart3, Settings, HelpCircle, ChevronLeft, 
  ChevronRight, Smartphone, LogOut
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
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { 
    activeModule, setActiveModule, 
    isSidebarCollapsed, toggleSidebar, 
    t, 
    sosAlerts, incidents, shifts, 
    currentUser, logout 
  } = useERP();

  const activeSOS = sosAlerts.filter(s => s.status === 'Triggered' || s.status === 'Acknowledged').length;
  const openIncidents = incidents.filter(i => i.status !== 'Closed' && i.status !== 'Resolved').length;
  const vacancies = shifts.filter(s => s.status === 'Shortage').length;

  const sections: NavSection[] = [
    {
      heading: 'Command',
      items: [
        { id: 'dashboard', labelKey: 'dashboard', defaultLabel: 'Executive Dashboard', icon: LayoutDashboard },
        { 
          id: 'sos', 
          labelKey: 'sos', 
          defaultLabel: 'Emergency SOS Console', 
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
      heading: 'Operations',
      items: [
        { id: 'guards', labelKey: 'guards', defaultLabel: 'Guards Master Directory', icon: Users },
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
        { id: 'patrol', labelKey: 'patrol', defaultLabel: 'Patrol & Checkpoints', icon: Navigation }
      ]
    },
    {
      heading: 'Workforce & HR',
      items: [
        { id: 'recruitment', labelKey: 'recruitment', defaultLabel: 'Recruitment Funnel', icon: UserPlus },
        { id: 'hrCompliance', labelKey: 'hrCompliance', defaultLabel: 'Leave & PSARA Compliance', icon: CheckSquare },
        { id: 'fieldMobile', labelKey: 'fieldMobile', defaultLabel: 'Mobile Duty Experience', icon: Smartphone }
      ]
    },
    {
      heading: 'Commercials & Admin',
      items: [
        { id: 'contracts', labelKey: 'contracts', defaultLabel: 'Contracts & Rates', icon: FileSpreadsheet },
        { id: 'payroll', labelKey: 'payroll', defaultLabel: 'Payroll & Salaries', icon: Wallet },
        { id: 'billing', labelKey: 'billing', defaultLabel: 'Client Invoicing & GST', icon: Receipt },
        { id: 'collections', labelKey: 'collections', defaultLabel: 'Collections & Ageing', icon: Landmark },
        { id: 'crm', labelKey: 'crm', defaultLabel: 'Sales & CRM Pipeline', icon: Target },
        { id: 'clientPortal', labelKey: 'clientPortal', defaultLabel: 'Client Portal (DLF)', icon: ExternalLink },
        { id: 'reports', labelKey: 'reports', defaultLabel: 'Reports & Analytics', icon: BarChart3 },
        { id: 'admin', labelKey: 'admin', defaultLabel: 'System Settings', icon: Settings },
        { id: 'helpCenter', labelKey: 'helpCenter', defaultLabel: 'Help & SOPs', icon: HelpCircle }
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
        >
          <ShieldLogo size={28} />
          {!isSidebarCollapsed && (
            <div className="brand-titles">
              <span className="brand-main">SAFE GUARD <span className="gold">FORCE</span></span>
              <span className="brand-tag">ERP SYSTEM</span>
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
              {sec.items.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                const label = t(item.labelKey) || item.defaultLabel;

                return (
                  <button
                    key={item.id}
                    className={`nav-row-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveModule(item.id)}
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
