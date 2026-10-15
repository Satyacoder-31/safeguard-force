import React from 'react';
import { 
  LayoutDashboard, Users, Building2, MapPin, FileSpreadsheet, 
  CalendarClock, Clock, Navigation, ShieldAlert, AlertOctagon, 
  UserPlus, CheckSquare, Wallet, Receipt, Landmark, Target, 
  ExternalLink, BarChart3, Settings, HelpCircle, ChevronLeft, 
  ChevronRight, Smartphone 
} from 'lucide-react';
import { useERP, NavigationModule } from '../../context/ERPContext';
import { ShieldLogo } from '../common/ShieldLogo';

interface NavItem {
  id: NavigationModule;
  labelKey: string;
  icon: React.ElementType;
  badge?: {
    text: string | number;
    variant: 'danger' | 'warning' | 'neutral';
  };
}

interface NavGroup {
  headingKey: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { 
    activeModule, setActiveModule, 
    isSidebarCollapsed, toggleSidebar, 
    t, 
    sosAlerts, incidents, shifts, attendance, 
    currentUser 
  } = useERP();

  // Active counts for badges
  const activeSOSCount = sosAlerts.filter(s => s.status === 'Triggered' || s.status === 'Acknowledged').length;
  const openIncidentsCount = incidents.filter(i => i.status !== 'Closed' && i.status !== 'Resolved').length;
  const shortageShifts = shifts.filter(s => s.status === 'Shortage').length;
  const gpsExceptions = attendance.filter(a => !a.isInsideGeofence && !a.supervisorVerified).length;

  const navGroups: NavGroup[] = [
    {
      headingKey: 'navOperations',
      items: [
        { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
        { id: 'guards', labelKey: 'guards', icon: Users },
        { id: 'clients', labelKey: 'clients', icon: Building2 },
        { id: 'sites', labelKey: 'sites', icon: MapPin },
        { id: 'contracts', labelKey: 'contracts', icon: FileSpreadsheet },
        { 
          id: 'deployments', 
          labelKey: 'deployments', 
          icon: CalendarClock,
          badge: shortageShifts > 0 ? { text: `${shortageShifts} vacant`, variant: 'warning' } : undefined
        },
        { 
          id: 'attendance', 
          labelKey: 'attendance', 
          icon: Clock,
          badge: gpsExceptions > 0 ? { text: `${gpsExceptions} review`, variant: 'warning' } : undefined
        },
        { id: 'patrol', labelKey: 'patrol', icon: Navigation },
        { 
          id: 'incidents', 
          labelKey: 'incidents', 
          icon: ShieldAlert,
          badge: openIncidentsCount > 0 ? { text: openIncidentsCount, variant: 'danger' } : undefined
        },
        { 
          id: 'sos', 
          labelKey: 'sos', 
          icon: AlertOctagon,
          badge: activeSOSCount > 0 ? { text: 'SOS LIVE', variant: 'danger' } : undefined
        }
      ]
    },
    {
      headingKey: 'navWorkforce',
      items: [
        { id: 'recruitment', labelKey: 'recruitment', icon: UserPlus },
        { id: 'hrCompliance', labelKey: 'hrCompliance', icon: CheckSquare },
        { id: 'fieldMobile', labelKey: 'fieldMobile', icon: Smartphone }
      ]
    },
    {
      headingKey: 'navFinance',
      items: [
        { id: 'payroll', labelKey: 'payroll', icon: Wallet },
        { id: 'billing', labelKey: 'billing', icon: Receipt },
        { id: 'collections', labelKey: 'collections', icon: Landmark }
      ]
    },
    {
      headingKey: 'navSalesPortal',
      items: [
        { id: 'crm', labelKey: 'crm', icon: Target },
        { id: 'clientPortal', labelKey: 'clientPortal', icon: ExternalLink }
      ]
    },
    {
      headingKey: 'navSettings',
      items: [
        { id: 'reports', labelKey: 'reports', icon: BarChart3 },
        { id: 'admin', labelKey: 'admin', icon: Settings },
        { id: 'helpCenter', labelKey: 'helpCenter', icon: HelpCircle }
      ]
    }
  ];

  return (
    <aside className={`erp-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Top Header */}
      <div className="sidebar-header">
        <div 
          className="brand-wrapper" 
          onClick={() => setActiveModule('dashboard')}
          title="Safe Guard Force ERP"
        >
          <ShieldLogo size={32} />
          {!isSidebarCollapsed && (
            <div className="brand-text-col">
              <span className="brand-title">
                SAFE GUARD <span className="gold-accent">FORCE</span>
              </span>
              <span className="brand-subtitle">ENTERPRISE ERP</span>
            </div>
          )}
        </div>

        <button 
          className="sidebar-collapse-btn" 
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Modules */}
      <nav className="sidebar-nav">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} style={{ marginBottom: '6px' }}>
            {!isSidebarCollapsed && (
              <div className="sidebar-group-heading">
                {t(group.headingKey)}
              </div>
            )}

            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <div
                  key={item.id}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveModule(item.id)}
                  title={isSidebarCollapsed ? t(item.labelKey) : undefined}
                >
                  <Icon className="sidebar-icon" />
                  {!isSidebarCollapsed && (
                    <>
                      <span>{t(item.labelKey)}</span>
                      {item.badge && (
                        <span className={`sidebar-badge ${item.badge.variant}`}>
                          {item.badge.text}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};
