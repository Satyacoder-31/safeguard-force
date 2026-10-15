import React, { useState } from 'react';
import { 
  AlertOctagon, Radio, Shield, MapPin, 
  Phone, CheckCircle, Navigation, UserCheck, 
  Send, AlertTriangle 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { SOSAlert } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const SOSConsole: React.FC = () => {
  const { 
    sosAlerts, triggerEmergencySOS, acknowledgeSOS, 
    resolveSOS, sites, guards, t, addToast 
  } = useERP();

  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [triggerGuardId, setTriggerGuardId] = useState(guards[0]?.id || '');
  const [triggerSiteId, setTriggerSiteId] = useState(sites[0]?.id || '');
  const [isTestDrill, setIsTestDrill] = useState(false);

  // Resolution modal
  const [resolvingSOS, setResolvingSOS] = useState<SOSAlert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('Area secured by QRT. False alarm / situation de-escalated successfully.');

  const activeAlerts = sosAlerts.filter(s => s.status !== 'Resolved');
  const pastAlerts = sosAlerts.filter(s => s.status === 'Resolved');

  const handleTriggerSOS = (e: React.FormEvent) => {
    e.preventDefault();
    triggerEmergencySOS(triggerGuardId, triggerSiteId, isTestDrill);
    setIsTriggerModalOpen(false);
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingSOS) return;
    resolveSOS(resolvingSOS.id, resolutionNotes);
    setResolvingSOS(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <AlertOctagon size={26} color="var(--status-danger)" />
            {t('sos')}
          </h1>
          <p>
            Emergency distress monitoring, high-priority GPS geolocation telemetry, and Quick Response Team (QRT) dispatch.
          </p>
        </div>

        <div className="page-actions-group">
          <button 
            className="btn btn-danger"
            onClick={() => setIsTriggerModalOpen(true)}
            style={{ animation: activeAlerts.length > 0 ? 'sos-flash 1.5s infinite' : 'none' }}
          >
            <Radio size={16} />
            <span>Trigger Emergency SOS Alert</span>
          </button>
        </div>
      </div>

      {/* Active High-Priority Emergency Distress Alerts */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
            Active Distress Alerts ({activeAlerts.length})
          </h3>
          {activeAlerts.length > 0 && (
            <span className="badge badge-danger" style={{ animation: 'pulse-subtle 1.5s infinite' }}>
              CRITICAL LIVE BEACON
            </span>
          )}
        </div>

        {activeAlerts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '36px 20px', background: 'var(--bg-subtle)' }}>
            <CheckCircle size={36} color="var(--status-success)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '15px', fontWeight: 700 }}>All Monitored Facilities Normal</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              No active distress alerts or SOS triggers currently pending response across guard sites.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeAlerts.map(alert => (
              <div 
                key={alert.id}
                className="card sos-alert-beacon"
                style={{
                  border: '2px solid #ef4444',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(11, 19, 43, 0.95) 100%)',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px #ef4444',
                      animation: 'pulse-subtle 1.2s infinite'
                    }}>
                      <AlertOctagon size={26} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                          {alert.isTestAlert ? 'DRILL / TEST SOS SIGNAL' : 'EMERGENCY DISTRESS BEACON'}
                        </span>
                        <StatusBadge status={alert.status} />
                      </div>
                      <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '2px' }}>
                        Originating Guard: <strong style={{ color: '#ffffff' }}>{alert.guardName}</strong> ({alert.guardPhone})
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Signal Received</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{alert.timestamp}</div>
                  </div>
                </div>

                {/* Coordinates & Facility details */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '14px',
                  background: 'rgba(7, 13, 30, 0.6)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '18px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Facility Location</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <MapPin size={15} color="var(--brand-gold-400)" />
                      <span>{alert.siteName}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>GPS Telemetry</span>
                    <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#38bdf8', marginTop: '2px' }}>
                      Lat: {alert.gpsLat.toFixed(5)} | Lng: {alert.gpsLng.toFixed(5)}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Assigned Responder</span>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
                      {alert.responderName || 'Awaiting QRT Dispatch'}
                    </div>
                  </div>
                </div>

                {/* Dispatch & Action Row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  {alert.status === 'Triggered' && (
                    <button 
                      className="btn btn-warning"
                      onClick={() => acknowledgeSOS(alert.id, 'Subedar Balwant Singh (Patrol Quick Response Team)')}
                    >
                      <UserCheck size={16} />
                      <span>Dispatch QRT Responder</span>
                    </button>
                  )}

                  <button 
                    className="btn btn-success"
                    onClick={() => setResolvingSOS(alert)}
                  >
                    <CheckCircle size={16} />
                    <span>Clear & Resolve SOS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Resolved SOS Log */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ fontSize: '14px', fontWeight: 700 }}>
            Emergency Resolution Audit Trail
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Immutable forensic record of all distress activations
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Alert Type</th>
                <th>Guard Personnel</th>
                <th>Facility</th>
                <th>Assigned Responder</th>
                <th>Resolution Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pastAlerts.map(alert => (
                <tr key={alert.id}>
                  <td style={{ fontSize: '12.5px', fontFamily: 'monospace' }}>{alert.timestamp}</td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: alert.isTestAlert ? 'var(--text-muted)' : 'var(--status-danger)' }}>
                      {alert.isTestAlert ? 'Drill Test' : 'Real Emergency'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{alert.guardName}</td>
                  <td>{alert.siteName}</td>
                  <td>{alert.responderName || 'QRT'}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {alert.resolutionNotes || 'Resolved.'}
                  </td>
                  <td>
                    <StatusBadge status={alert.status} />
                  </td>
                </tr>
              ))}
              {pastAlerts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    No prior historical incidents recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trigger SOS Modal */}
      {isTriggerModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsTriggerModalOpen(false)}
          title="Simulate Field Emergency SOS Signal"
          subtitle="Test operational dispatch, SMS/WhatsApp broadcast, and beacon visualization"
          size="md"
        >
          <form onSubmit={handleTriggerSOS}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Select Originating Guard *</label>
              <select 
                className="form-control"
                value={triggerGuardId}
                onChange={e => setTriggerGuardId(e.target.value)}
              >
                {guards.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.phone} - {g.category})</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Select Facility / Site *</label>
              <select 
                className="form-control"
                value={triggerSiteId}
                onChange={e => setTriggerSiteId(e.target.value)}
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={isTestDrill}
                  onChange={e => setIsTestDrill(e.target.checked)}
                />
                <span>Mark as Scheduled Training / Evacuation Drill (Non-real)</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsTriggerModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                Broadcast Emergency Beacon
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Resolve SOS Modal */}
      {resolvingSOS && (
        <Modal
          isOpen={true}
          onClose={() => setResolvingSOS(null)}
          title="Resolve Emergency Distress Incident"
          subtitle={`Incident: ${resolvingSOS.guardName} at ${resolvingSOS.siteName}`}
          size="md"
        >
          <form onSubmit={handleConfirmResolve}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Forensic Resolution Notes & Findings *</label>
              <textarea 
                className="form-control"
                rows={3}
                required
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setResolvingSOS(null)}
              >
                Keep Active
              </button>
              <button type="submit" className="btn btn-success">
                Confirm Emergency Resolved
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
