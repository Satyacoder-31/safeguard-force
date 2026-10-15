import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'gold' | 'green' | 'amber' | 'red' | 'blue';
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  trend,
  onClick
}) => {
  return (
    <div 
      className={`kpi-card kpi-${variant}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      title={onClick ? 'Click to inspect underlying records' : undefined}
    >
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        <div className="kpi-icon-wrapper">
          <Icon size={18} />
        </div>
      </div>

      <div className="kpi-value">{value}</div>

      <div className="kpi-footer">
        {trend && (
          <span className={`kpi-trend ${trend.direction}`}>
            {trend.direction === 'up' && <ArrowUpRight size={14} />}
            {trend.direction === 'down' && <ArrowDownRight size={14} />}
            {trend.direction === 'neutral' && <Minus size={14} />}
            {trend.value}
          </span>
        )}
        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
  );
};
