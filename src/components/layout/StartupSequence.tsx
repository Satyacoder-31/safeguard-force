import React, { useState, useEffect } from 'react';
import { ShieldLogo } from '../common/ShieldLogo';

interface StartupSequenceProps {
  onComplete: () => void;
}

export const StartupSequence: React.FC<StartupSequenceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing Security Core...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Loading Master Rosters & Geofences...');
    }, 250);

    const t2 = setTimeout(() => {
      setProgress(80);
      setStatusText('Synchronizing Real-Time Workforce Data...');
    }, 550);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('System Ready. Launching Safe Guard Force ERP...');
    }, 850);

    const t4 = setTimeout(() => {
      setIsFading(true);
    }, 1050);

    const t5 = setTimeout(() => {
      onComplete();
    }, 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div 
      className="startup-overlay"
      style={{
        opacity: isFading ? 0 : 1,
        visibility: isFading ? 'hidden' : 'visible',
        transition: 'opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), visibility 350ms'
      }}
    >
      <div className="startup-logo-container">
        <ShieldLogo size={72} />

        <div className="startup-brand-name">
          SAFE GUARD <span style={{ color: 'var(--brand-gold-400)' }}>FORCE</span>
        </div>

        <div className="startup-tagline">
          ENTERPRISE WORKFORCE & SECURITY ERP
        </div>

        <div className="startup-progress-bar-track">
          <div 
            className="startup-progress-bar-fill" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="startup-status-text">
          {statusText}
        </div>
      </div>
    </div>
  );
};
