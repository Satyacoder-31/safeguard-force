import React, { useState } from 'react';
import { 
  X, AlertOctagon, AlertTriangle, Clock, 
  FileText, CheckCircle, ChevronRight, Bell 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationOpen, setIsNotificationOpen, 
    setActiveModule, 
    sosAlerts, incidents, shifts, invoices, guards 
  } = useERP();

  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'operations' | 'finance'>('all');

  if (!isNotificationOpen) return null;

  // Synthesize notifications from real live data
  const notificationsList = [
    ...sosAlerts.filter(s => s.status !== 'Resolved').map(s => ({
      id: `notif-sos-${s.id}`,
      type: 'critical' as const,
      title: s.isTestAlert ? 'Test SOS Alert' : 'CRITICAL EMERGENCY SOS ALERT',
      message: `${s.guardName} triggered SOS at ${s.siteName}`,
      timestamp: s.timestamp,
      targetModule: 'sos' as const,
      icon: AlertOctagon
    })),
    ...incidents.filter(i => i.severity === 'Critical' || i.severity === 'High').map(i => ({
      id: `notif-inc-${i.id}`,
      type: 'critical' as const,
      title: `${i.severity} Incident: ${i.category}`,
      message: `${i.title} reported at ${i.siteName}`,
      timestamp: i.timestamp,
      targetModule: 'incidents' as const,
      icon: AlertTriangle
    })),
    ...shifts.filter(s => s.status === 'Shortage').map(s => ({
      id: `notif-shift-${s.id}`,
      type: 'operations' as const,
      title: 'Uncovered Shift Vacancy',
      message: `${s.siteName} (${s.shiftType} shift) requires reliever assignment`,
      timestamp: 'Today',
      targetModule: 'deployments' as const,
      icon: Clock
    })),
    ...invoices.filter(inv => inv.status === 'Overdue').map(inv => ({
      id: `notif-inv-${inv.id}`,
      type: 'finance' as const,
      title: 'Invoice Overdue Notice',
      message: `${inv.clientName} invoice ${inv.invoiceNumber} past due date (₹${inv.balanceDue.toLocaleString()})`,
      timestamp: `Due: ${inv.dueDate}`,
      targetModule: 'billing' as const,
      icon: FileText
    })),
    // Expiring document alert
    {
      id: 'notif-doc-1',
      type: 'operations' as const,
      title: 'Gun License Expiry Escalation',
      message: 'Vikram Singh Shekhawat (Armed Guard) Gun License expires in 8 days',
      timestamp: 'Action Needed',
      targetModule: 'guards' as const,
      icon: AlertTriangle
    }
  ];

  const filteredNotifications = notificationsList.filter(n => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  return (
    <div 
      className="modal-overlay" 
      onClick={() => setIsNotificationOpen(false)}
      style={{ justifyContent: 'flex-end', padding: 0 }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100vh',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideLeft 250ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Notifications & Alerts</h3>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--status-danger-bg)',
              color: 'var(--status-danger-fg)',
              fontWeight: 700
            }}>
              {notificationsList.length}
            </span>
          </div>

          <button 
            className="icon-btn" 
            onClick={() => setIsNotificationOpen(false)}
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Filters */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 16px',
          background: 'var(--bg-surface)'
        }}>
          {(['all', 'critical', 'operations', 'finance'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 14px',
                fontSize: '12.5px',
                fontWeight: 600,
                border: 'none',
                background: 'transparent',
                color: activeTab === tab ? 'var(--accent-gold)' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--accent-gold)' : '2px solid transparent',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <CheckCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontSize: '13px' }}>No active alerts in this category.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredNotifications.map(item => {
                const Icon = item.icon;
                const isCrit = item.type === 'critical';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveModule(item.targetModule);
                      setIsNotificationOpen(false);
                    }}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: isCrit ? 'var(--status-danger-bg)' : 'var(--bg-subtle)',
                      border: `1px solid ${isCrit ? 'var(--status-danger-border)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-gold)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = isCrit ? 'var(--status-danger-border)' : 'var(--border-subtle)')}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isCrit ? '#ef4444' : 'var(--brand-navy-800)',
                        color: '#ffffff',
                        flexShrink: 0
                      }}>
                        <Icon size={16} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: isCrit ? 'var(--status-danger-fg)' : 'var(--text-primary)',
                          marginBottom: '3px'
                        }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                          {item.message}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '8px',
                          fontSize: '11px',
                          color: 'var(--text-muted)'
                        }}>
                          <span>{item.timestamp}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--accent-gold)', fontWeight: 600 }}>
                            Take Action <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-subtle)'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time event feed active</span>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setIsNotificationOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
