import React from 'react';
import { CheckCircle, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useERP();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: '100%'
    }}>
      {toasts.map(toast => {
        let Icon = Info;
        let borderColor = 'var(--status-info-border)';
        let bg = 'var(--bg-surface)';
        let accent = 'var(--status-info)';

        if (toast.type === 'success') {
          Icon = CheckCircle;
          borderColor = 'var(--status-success-border)';
          accent = 'var(--status-success)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'var(--status-warning-border)';
          accent = 'var(--status-warning)';
        } else if (toast.type === 'danger') {
          Icon = AlertOctagon;
          borderColor = 'var(--status-danger-border)';
          accent = 'var(--status-danger)';
        }

        return (
          <div
            key={toast.id}
            style={{
              background: bg,
              border: `1px solid ${borderColor}`,
              borderLeft: `4px solid ${accent}`,
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <Icon size={18} color={accent} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
