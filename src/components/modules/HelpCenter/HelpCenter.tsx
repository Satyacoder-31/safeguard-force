import React, { useState } from 'react';
import { 
  HelpCircle, BookOpen, Shield, CheckCircle, 
  FileText, Phone, Award, ExternalLink 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';

export const HelpCenter: React.FC = () => {
  const { t, addToast } = useERP();

  const sops = [
    {
      title: 'SOP-SEC-01: Main Gate Vehicle Frisking & Visitor OTP Protocol',
      category: 'Access Control',
      summary: 'Standard sequence for inspecting commercial visitor vehicles, undercarriage mirror checks, and digital OTP invitation verification before gate opening.',
      revised: 'October 2026'
    },
    {
      title: 'SOP-SEC-02: Night Patrol & QR Checkpoint Execution Mandate',
      category: 'Patrol Operations',
      summary: 'Rules for executing perimeter route between 22:00 and 06:00. Mandatory QR scanning within 15-minute scheduled windows.',
      revised: 'September 2026'
    },
    {
      title: 'SOP-SEC-03: Immediate Actions upon Audible Fire Alarm Sensor Trigger',
      category: 'Emergency Response',
      summary: 'Deployment of Quick Response Team to sensor zone within 90 seconds, tenant evacuation announcement protocol, and municipal fire service alert.',
      revised: 'August 2026'
    },
    {
      title: 'SOP-HR-04: Guard Character & Police Verification Mandatory Workflow',
      category: 'Compliance',
      summary: 'Detailed procedure for submitting candidate biometrics, Aadhaar token, and local police station character verification before deployment.',
      revised: 'October 2026'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <HelpCircle size={26} color="var(--brand-gold-400)" />
            Standard Operating Procedures (SOPs) & User Guidance
          </h1>
          <p>
            Official security operational directives, emergency response protocols, and ERP platform training guides.
          </p>
        </div>
      </div>

      {/* System Health Status Card */}
      <div className="card" style={{ marginBottom: '24px', background: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-success)', display: 'inline-block' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Safe Guard Force Platform Status: Operational</h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              All core microservices (Biometric Ingestion, Geofence Engine, SMS/WhatsApp Gateway, Payroll Engine) responding normally.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-success">API Latency: 28ms</span>
            <span className="badge badge-info">Database: PostgreSQL 16 Active</span>
          </div>
        </div>
      </div>

      {/* SOP Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {sops.map((sop, idx) => (
          <div key={idx} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-neutral">{sop.category}</span>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Revised: {sop.revised}</span>
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {sop.title}
            </h3>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              {sop.summary}
            </p>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 600 }}>
                ✓ Certified for All Sites
              </span>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => addToast('info', 'Document Download', 'Official signed SOP PDF generated.')}
              >
                <BookOpen size={13} />
                <span>Read Directive</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Operations Control Room */}
      <div className="card" style={{ marginTop: '24px', borderLeft: '4px solid var(--brand-gold-400)' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
          Safe Guard Force Central Command Room (24x7 Helpdesk)
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          For operational emergencies, VIP security requests, or technical system queries, reach our central control officers:
        </p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 600 }}>
          <div>Hotline: <strong style={{ color: 'var(--accent-gold)' }}>+91 124 4567890</strong></div>
          <div>Emergency Control: <strong style={{ color: 'var(--status-danger)' }}>1800-SGF-FORCE</strong></div>
          <div>Ops Email: <strong>control@safeguardforce.in</strong></div>
        </div>
      </div>
    </div>
  );
};
