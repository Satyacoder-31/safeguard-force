import React, { useState } from 'react';
import { 
  Navigation, QrCode, CheckCircle2, Clock, 
  AlertTriangle, Shield, CheckCircle, Crosshair, 
  Play, MapPin 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { PatrolLog } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const PatrolManagement: React.FC = () => {
  const { patrols, scanPatrolCheckpoint, sites, t, addToast } = useERP();

  const [selectedPatrol, setSelectedPatrol] = useState<PatrolLog | null>(null);
  const [scanningPatrolId, setScanningPatrolId] = useState<string | null>(null);

  const handleQuickScan = (patrolId: string, checkpointId: string) => {
    scanPatrolCheckpoint(patrolId, checkpointId);
    if (selectedPatrol && selectedPatrol.id === patrolId) {
      // Refresh current modal view
      const updated = patrols.find(p => p.id === patrolId);
      if (updated) setSelectedPatrol(updated);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Navigation size={26} color="var(--brand-gold-400)" />
            {t('patrol')}
          </h1>
          <p>
            Real-time checkpoint verification, NFC/QR scan timestamps, route deviation tracking, and client compliance audit.
          </p>
        </div>
      </div>

      {/* Patrol Routes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {patrols.map(patrol => {
          const isComplete = patrol.status === 'Completed';
          const isMissed = patrol.status === 'Missed';
          const isLate = patrol.status === 'Late';

          return (
            <div 
              key={patrol.id} 
              className="card"
              style={{
                borderTop: `4px solid ${isComplete ? 'var(--status-success)' : isMissed ? 'var(--status-danger)' : 'var(--brand-gold-400)'}`
              }}
            >
              <div className="card-header" style={{ alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--brand-gold-400)', fontWeight: 700 }}>
                    {patrol.patrolNumber}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {patrol.routeName}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    {patrol.siteName}
                  </div>
                </div>

                <StatusBadge status={patrol.status} />
              </div>

              {/* Guard on duty & scheduled window */}
              <div style={{
                background: 'var(--bg-subtle)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12.5px'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Patrol Guard: </span>
                  <span style={{ fontWeight: 600 }}>{patrol.assignedGuardName}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Window: </span>
                  <span style={{ fontWeight: 600 }}>{patrol.scheduledTime}</span>
                </div>
              </div>

              {/* Compliance Score Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>Checkpoint Compliance Score</span>
                  <span style={{ fontWeight: 700, color: patrol.complianceScorePercent === 100 ? 'var(--status-success)' : 'var(--brand-gold-400)' }}>
                    {patrol.complianceScorePercent}%
                  </span>
                </div>
                <div style={{ height: '7px', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${patrol.complianceScorePercent}%`,
                      background: patrol.complianceScorePercent === 100 ? 'var(--status-success)' : isMissed ? 'var(--status-danger)' : 'var(--brand-gold-400)'
                    }} 
                  />
                </div>
              </div>

              {/* Checkpoint Steps List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {patrol.checkpoints.map((cp, idx) => {
                  const done = cp.status === 'Completed';

                  return (
                    <div 
                      key={cp.id}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: done ? 'var(--status-success-bg)' : 'var(--bg-subtle)',
                        border: `1px solid ${done ? 'var(--status-success-border)' : 'var(--border-subtle)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12.5px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: done ? 'var(--status-success)' : 'var(--border-strong)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {idx + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, color: done ? 'var(--status-success-fg)' : 'var(--text-primary)' }}>
                            {cp.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {cp.qrCode} • {cp.scannedAt ? `Scanned: ${cp.scannedAt}` : 'Pending Scan'}
                          </div>
                        </div>
                      </div>

                      {!done && (
                        <button 
                          className="btn btn-gold btn-sm"
                          onClick={() => handleQuickScan(patrol.id, cp.id)}
                          title="Simulate Guard QR / GPS Scan"
                        >
                          <QrCode size={13} />
                          <span>Scan QR</span>
                        </button>
                      )}

                      {done && (
                        <CheckCircle size={16} color="var(--status-success)" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Card Footer */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  {patrol.completedTime ? `Completed at ${patrol.completedTime}` : 'Route Active'}
                </span>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedPatrol(patrol)}
                >
                  Inspect Audit Trail
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patrol Audit Modal */}
      {selectedPatrol && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPatrol(null)}
          title={`Patrol Route Audit: ${selectedPatrol.patrolNumber}`}
          subtitle={`${selectedPatrol.routeName} — ${selectedPatrol.siteName}`}
          size="lg"
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Guard Responsible</div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>{selectedPatrol.assignedGuardName}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scheduled Time Window</div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>{selectedPatrol.scheduledTime}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Route Score</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--status-success)' }}>
                  {selectedPatrol.complianceScorePercent}%
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Checkpoint Telemetry & Verification Logs</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedPatrol.checkpoints.map(cp => (
                <div 
                  key={cp.id}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{cp.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      QR Token: {cp.qrCode} | Lat: {cp.latitude.toFixed(4)}, Lng: {cp.longitude.toFixed(4)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>
                      {cp.scannedAt ? `✓ Verified at ${cp.scannedAt}` : 'Not Scanned'}
                    </span>
                    <StatusBadge status={cp.status} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedPatrol(null)}>
                Close Audit
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
