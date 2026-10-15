import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant,
  showDot = true 
}) => {
  // Infer variant if not explicitly provided
  let computedVariant: BadgeVariant = variant || 'neutral';

  if (!variant) {
    const s = status.toLowerCase();
    if (['active', 'verified', 'present', 'approved', 'completed', 'paid', 'fully staffed', 'resolved', 'system healthy'].includes(s)) {
      computedVariant = 'success';
    } else if (['pending', 'late', 'warning', 'in process', 'partially paid', 'action required', 'under investigation', 'expiring', 'shortage'].includes(s)) {
      computedVariant = 'warning';
    } else if (['critical', 'danger', 'overdue', 'absent', 'rejected', 'suspended', 'missed', 'triggered', 'high'].includes(s)) {
      computedVariant = 'danger';
    } else if (['info', 'review', 'issued', 'draft', 'medium', 'low', 'negotiation', 'ready for deployment'].includes(s)) {
      computedVariant = 'info';
    }
  }

  return (
    <span className={`badge badge-${computedVariant}`}>
      {showDot && <span className="badge-dot" />}
      <span>{status}</span>
    </span>
  );
};
