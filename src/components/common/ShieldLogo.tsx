import React from 'react';

interface ShieldLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const ShieldLogo: React.FC<ShieldLogoProps> = ({ 
  size = 36, 
  className = '',
  showText = false
}) => {
  return (
    <div className={`shield-logo-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 8px rgba(217, 119, 6, 0.3))' }}
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C2541" />
            <stop offset="60%" stopColor="#0B132B" />
            <stop offset="100%" stopColor="#070D1E" />
          </linearGradient>
          <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Outer Shield Outline */}
        <path 
          d="M50 5 L88 20 C88 56 68 84 50 95 C32 84 12 56 12 20 Z" 
          fill="url(#shieldGrad)" 
          stroke="url(#goldBorder)" 
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Shield Inset */}
        <path 
          d="M50 14 L80 26 C80 54 64 76 50 85 C36 76 20 54 20 26 Z" 
          fill="rgba(255, 255, 255, 0.03)" 
          stroke="rgba(245, 158, 11, 0.4)" 
          strokeWidth="1.2"
        />

        {/* Center Security Symbol: Star + Keyhole / Monogram */}
        {/* Star */}
        <polygon 
          points="50,28 54,40 66,40 56,48 60,60 50,52 40,60 44,48 34,40 46,40" 
          fill="url(#starGrad)" 
        />

        {/* Subtle Horizontal Chevron / Security Wings */}
        <path 
          d="M32 66 L50 75 L68 66" 
          stroke="url(#goldBorder)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M38 72 L50 78 L62 72" 
          stroke="rgba(245, 158, 11, 0.5)" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            fontSize: `${size * 0.44}px`, 
            letterSpacing: '0.04em',
            color: '#ffffff',
            textTransform: 'uppercase',
            lineHeight: 1.1
          }}>
            SAFE GUARD <span style={{ color: 'var(--brand-gold-400)' }}>FORCE</span>
          </div>
          <div style={{ 
            fontSize: `${size * 0.24}px`, 
            color: '#94a3b8', 
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            lineHeight: 1.2
          }}>
            ENTERPRISE ERP
          </div>
        </div>
      )}
    </div>
  );
};
