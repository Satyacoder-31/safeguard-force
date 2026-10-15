import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Building2, MapPin, FileSpreadsheet, 
  CalendarClock, Clock, Navigation, ShieldAlert, AlertOctagon, 
  UserPlus, CheckSquare, Wallet, Receipt, Landmark, Target, 
  ExternalLink, BarChart3, Settings, HelpCircle, ChevronLeft, 
  ChevronRight, Smartphone, Search, LogOut, ChevronDown, 
  Radio, Shield, Sparkles, Activity
} from 'lucide-react';
import { useERP, NavigationModule } from '../../context/ERPContext';
import { ShieldLogo } from '../common/ShieldLogo';

interface NavItem {
  id: NavigationModule;
  labelKey: string;
  defaultLabel: string;
  icon: React.ElementType;
  badge?: {
    text: string | number;
    variant: 'danger' | 'warning' | 'neutral' | 'live';
  };
}

interface NavGroup {
  id: string;
  headingKey: string;
  defaultHeading: string;
  icon: React.ElementType;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { 
    activeModule, setActiveModule, 
    isSidebarCollapsed, toggleSidebar, 
    t, 
    sosAlerts, incidents, shifts, attendance, 
    currentUser, logout, kpis
  } = useERP();

  const [filterQuery, setFilterQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Active counts for badges
  const activeSOSCount = sosAlerts.filter(s => s.status === 'Triggered' || s.status === 'Acknowledged').length;
  const openIncidentsCount = incidents.filter(i => i.status !== 'Closed' && i.status !== 'Resolved').length;
  const shortageShifts = shifts.filter(s => s.status === 'Shortage').length;
  const gpsExceptions = attendance.filter(a => !a.isInsideGeofence && !a.supervisorVerified).length;

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const navGroups: NavGroup[] = [
    {
      id: 'command',
      headingKey: 'navCommand',
      defaultHeading: 'Command & Response',
      icon: Activity,
      items: [
        { 
          id: 'dashboard', 
          labelKey: 'dashboard', 
          defaultLabel: 'Executive Dashboard', 
          icon: LayoutDashboard 
        },
        { 
          id: 'sos', 
          labelKey: 'sos', 
          defaultLabel: 'SOS & Emergency Center', 
          icon: AlertOctagon,
          badge: activeSOSCount > 0 
            ? { text: 'SOS LIVE', variant: 'live' } 
            : undefined
        },
        { 
          id: 'incidents', 
          labelKey: 'incidents', 
          defaultLabel: 'Incident Management', 
          icon: ShieldAlert,
          badge: openIncidentsCount > 0 
            ? { text: `${openIncidentsCount} open`, variant: 'danger' } 
            : undefined
        }
      ]
    },
    {
      id: 'operations',
      headingKey: 'navOperations',
      defaultHeading: 'Site Ops & Deployment',
      icon: Building2,
      items: [
        { 
          id: 'guards', 
          labelKey: 'guards', 
          defaultLabel: 'Guard Directory', 
          icon: Users 
        },
        { 
          id: 'clients', 
          labelKey: 'clients', 
          defaultLabel: 'Clients & Branches', 
          icon: Building2 
        },
        { 
          id: 'sites', 
          labelKey: 'sites', 
          defaultLabel: 'Sites & Geofencing', 
          icon: MapPin 
        },
        { 
          id: 'deployments', 
          labelKey: 'deployments', 
          defaultLabel: 'Deployments & Rosters', 
          icon: CalendarClock,
          badge: shortageShifts > 0 
            ? { text: `${shortageShifts} vacant`, variant: 'warning' } 
            : undefined
        },
        { 
          id: 'attendance', 
          labelKey: 'attendance', 
          defaultLabel: 'GPS Live Attendance', 
          icon: Clock,
          badge: gpsExceptions > 0 
            ? { text: `${gpsExceptions} review`, variant: 'warning' } 
            : undefined
        },
        { 
          id: 'patrol', 
          labelKey: 'patrol', 
          defaultLabel: 'Patrol & Checkpoints', 
          icon: Navigation 
        }
      ]
    },
    {
      id: 'workforce',
      headingKey: 'navWorkforce',
      defaultHeading: 'Workforce & HR',
      icon: UserPlus,
      items: [
        { 
          id: 'recruitment', 
          labelKey: 'recruitment', 
          defaultLabel: 'Recruitment Funnel', 
          icon: UserPlus 
        },
        { 
          id: 'hrCompliance', 
          labelKey: 'hrCompliance', 
          defaultLabel: 'Leave & Compliance', 
          icon: CheckSquare 
        },
        { 
          id: 'fieldMobile', 
          labelKey: 'fieldMobile', 
          defaultLabel: 'Mobile Field Duty', 
          icon: Smartphone 
        }
      ]
    },
    {
      id: 'finance',
      headingKey: 'navFinance',
      defaultHeading: 'Commercials & Finance',
      icon: Wallet,
      items: [
        { 
          id: 'contracts', 
          labelKey: 'contracts', 
          defaultLabel: 'Contracts & Rates', 
          icon: FileSpreadsheet 
        },
        { 
          id: 'payroll', 
          labelKey: 'payroll', 
          defaultLabel: 'Payroll & Salaries', 
          icon: Wallet 
        },
        { 
          id: 'billing', 
          labelKey: 'billing', 
          defaultLabel: 'Client Invoicing', 
          icon: Receipt 
        },
        { 
          id: 'collections', 
          labelKey: 'collections', 
          defaultLabel: 'Collections & AR', 
          icon: Landmark 
        }
      ]
    },
    {
      id: 'business',
      headingKey: 'navSalesPortal',
      defaultHeading: 'Intelligence & Portals',
      icon: Target,
      items: [
        { 
          id: 'crm', 
          labelKey: 'crm', 
          defaultLabel: 'CRM & Sales Pipeline', 
          icon: Target 
        },
        { 
          id: 'clientPortal', 
          labelKey: 'clientPortal', 
          defaultLabel: 'Client Self-Service', 
          icon: ExternalLink 
        },
        { 
          id: 'reports', 
          labelKey: 'reports', 
          defaultLabel: 'Reports & Analytics', 
          icon: BarChart3 
        },
        { 
          id: 'admin', 
          labelKey: 'admin', 
          defaultLabel: 'System Administration', 
          icon: Settings 
        },
        { 
          id: 'helpCenter', 
          labelKey: 'helpCenter', 
          defaultLabel: 'SOPs & Onboarding', 
          icon: HelpCircle 
        }
      ]
    }
  ];

  // Filter items if user is searching inside the sidebar
  const filteredGroups = navGroups.map(group => {
    if (!filterQuery.trim()) return group;
    const query = filterQuery.toLowerCase();
    const matchingItems = group.items.filter(item => {
      const translated = t(item.labelKey).toLowerCase();
      const def = item.defaultLabel.toLowerCase();
      return translated.includes(query) || def.includes(query);
    });
    return { ...group, items: matchingItems };
  }).filter(group => group.items.length > 0);

  return (
    <aside className={`erp-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Top Header */}
      <div className="sidebar-header">
        <div 
          className="brand-wrapper" 
          onClick={() => setActiveModule('dashboard')}
          title="Safe Guard Force ERP"
        >
          <div className="brand-logo-container">
            <ShieldLogo size={32} />
          </div>
          {!isSidebarCollapsed && (
            <div className="brand-text-col">
              <span className="brand-title">
                SAFE GUARD <span className="gold-accent">FORCE</span>
              </span>
              <div className="brand-version-badge">
                <span>ENTERPRISE ERP v2.4</span>
              </div>
            </div>
          )}
        </div>

        <button 
          className="sidebar-collapse-btn" 
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Sidebar Quick Filter (When Expanded) */}
      {!isSidebarCollapsed && (
        <div className="sidebar-quick-filter">
          <div className="sidebar-search-box">
            <Search size={14} className="sidebar-search-icon" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter modules..."
              className="sidebar-search-input"
            />
            {filterQuery && (
              <button 
                type="button" 
                className="sidebar-search-clear"
                onClick={() => setFilterQuery('')}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Modules (Sorted Groups) */}
      <nav className="sidebar-nav">
        {filteredGroups.map((group) => {
          const isCollapsed = collapsedGroups[group.id] && !filterQuery;
          const GroupIcon = group.icon;

          return (
            <div key={group.id} className="sidebar-nav-group">
              {!isSidebarCollapsed ? (
                <div 
                  className="sidebar-group-header-interactive"
                  onClick={() => toggleGroup(group.id)}
                  title={`Toggle ${group.defaultHeading}`}
                >
                  <div className="group-title-wrap">
                    <GroupIcon size={12} className="group-category-icon" />
                    <span className="sidebar-group-heading-text">
                      {t(group.headingKey) || group.defaultHeading}
                    </span>
                  </div>
                  <div className="group-right-meta">
                    <span className="group-count-pill">{group.items.length}</span>
                    <ChevronDown 
                      size={12} 
                      className={`group-chevron ${isCollapsed ? 'rotate-closed' : ''}`} 
                    />
                  </div>
                </div>
              ) : (
                <div className="sidebar-group-divider" />
              )}

              {!isCollapsed && (
                <div className="sidebar-group-items">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;
                    const itemTitle = t(item.labelKey) || item.defaultLabel;

                    return (
                      <div
                        key={item.id}
                        className={`sidebar-link ${isActive ? 'active' : ''}`}
                        onClick={() => setActiveModule(item.id)}
                        title={isSidebarCollapsed ? itemTitle : undefined}
                      >
                        <div className="sidebar-icon-wrapper">
                          <Icon className="sidebar-icon" />
                          {isActive && <span className="active-glow-dot" />}
                        </div>
                        {!isSidebarCollapsed && (
                          <div className="sidebar-link-content">
                            <span className="sidebar-link-text">{itemTitle}</span>
                            {item.badge && (
                              <span className={`sidebar-badge ${item.badge.variant}`}>
                                {item.badge.variant === 'live' && (
                                  <span className="live-pulsing-dot" />
                                )}
                                {item.badge.text}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section: Operations Monitor & User Profile */}
      <div className="sidebar-footer">
        {!isSidebarCollapsed && (
          <div className="sidebar-status-card">
            <div className="status-card-header">
              <span className="status-beacon-live" />
              <span className="status-label">Network & PSARA SLA</span>
              <span className="status-val">99.98%</span>
            </div>
            <div className="status-card-bar">
              <div 
                className="status-bar-fill" 
                style={{ width: `${Math.min(kpis.deployedPercentage, 100)}%` }} 
              />
            </div>
            <div className="status-card-footer">
              <span>{kpis.activeGuardsCount} Guards Live</span>
              <span>{kpis.activeSitesCount} Sites Active</span>
            </div>
          </div>
        )}

        {/* Current User Pill & Quick Logout */}
        <div className="sidebar-user-card">
          <div className="sidebar-user-info">
            <div className="sidebar-avatar">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              <span className="avatar-online-dot" />
            </div>
            {!isSidebarCollapsed && (
              <div className="sidebar-user-details">
                <span className="sidebar-user-name">
                  {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1] || ''}
                </span>
                <span className="sidebar-user-role">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>

          <button
            className="sidebar-logout-btn"
            onClick={logout}
            title="Sign out & return to Login Page"
            type="button"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};
