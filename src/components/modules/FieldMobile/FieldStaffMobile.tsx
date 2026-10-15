import React, { useState } from 'react';
import { 
  Smartphone, MapPin, Clock, Shield, QrCode, 
  AlertOctagon, CheckCircle, FileText, Navigation, 
  Camera, ShieldAlert, Award, UserCheck 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { StatusBadge } from '../../common/StatusBadge';

export const FieldStaffMobile: React.FC = () => {
  const { 
    guards, sites, attendance, recordPunch, 
    patrols, scanPatrolCheckpoint, 
    triggerEmergencySOS, reportIncident, 
    currentUser, addToast 
  } = useERP();

  // Active field guard context
  const activeGuard = guards[0]; // Vikram Singh Shekhawat
  const activeSite = sites.find(s => s.id === activeGuard.currentSiteId) || sites[0];

  const todayAttendance = attendance.find(a => a.guardId === activeGuard.id);
  const activePatrol = patrols.find(p => p.assignedGuardId === activeGuard.id);

  const [isPunching, setIsPunching] = useState(false);
  const [activeTab, setActiveTab] = useState<'duty' | 'patrol' | 'sos' | 'incident'>('duty');

  // Quick incident state
  const [incTitle, setIncTitle] = useState('');
  const [incDesc, setIncDesc] = useState('');

  const handleMobileClockIn = () => {
    setIsPunching(true);
    setTimeout(() => {
      recordPunch(activeGuard.id, activeSite.id, true);
      setIsPunching(false);
    }, 600);
  };

  const handleMobileClockOut = () => {
    recordPunch(activeGuard.id, activeSite.id, false);
  };

  const handleMobileSOS = () => {
    triggerEmergencySOS(activeGuard.id, activeSite.id, false);
  };

  const handleMobileReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle) return;
    reportIncident({
      siteId: activeSite.id,
      title: incTitle,
      description: incDesc,
      severity: 'Medium',
      category: 'Suspicious Activity',
      immediateActionTaken: 'Field guard investigated and secured perimeter.'
    });
    setIncTitle('');
    setIncDesc('');
    setActiveTab('duty');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Smartphone size={26} color="var(--brand-gold-400)" />
            Mobile Field Duty & Supervisor Workflows
          </h1>
          <p>
            Responsive mobile-optimized interface designed for on-duty guards and field supervisors in the field.
          </p>
        </div>
      </div>

      {/* Centered Mobile Device Frame Container */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
        <div style={{
          width: '100%',
          maxWidth: '430px',
          background: 'var(--brand-navy-950)',
          borderRadius: '36px',
          border: '8px solid #1e293b',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
          position: 'relative'
        }}>
          {/* Mobile Top Speaker & Camera Notch */}
          <div style={{
            height: '24px',
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{ width: '60px', height: '4px', background: '#334155', borderRadius: '4px' }} />
          </div>

          {/* App Header inside Mobile */}
          <div style={{
            padding: '16px 20px',
            background: 'var(--brand-navy-900)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={activeGuard.photo} 
                alt={activeGuard.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-gold-400)' }}
              />
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800 }}>{activeGuard.name}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {activeGuard.guardIdNumber} • {activeGuard.category}
                </div>
              </div>
            </div>

            <span className="badge badge-success">
              Active
            </span>
          </div>

          {/* Mobile Tab Navigation */}
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => setActiveTab('duty')}
              style={{
                flex: 1,
                padding: '10px 4px',
                border: 'none',
                background: 'transparent',
                color: activeTab === 'duty' ? 'var(--brand-gold-400)' : '#94a3b8',
                fontSize: '11.5px',
                fontWeight: 700,
                borderBottom: activeTab === 'duty' ? '2px solid var(--brand-gold-400)' : 'none',
                cursor: 'pointer'
              }}
            >
              Duty & Punch
            </button>
            <button
              onClick={() => setActiveTab('patrol')}
              style={{
                flex: 1,
                padding: '10px 4px',
                border: 'none',
                background: 'transparent',
                color: activeTab === 'patrol' ? 'var(--brand-gold-400)' : '#94a3b8',
                fontSize: '11.5px',
                fontWeight: 700,
                borderBottom: activeTab === 'patrol' ? '2px solid var(--brand-gold-400)' : 'none',
                cursor: 'pointer'
              }}
            >
              QR Patrol
            </button>
            <button
              onClick={() => setActiveTab('incident')}
              style={{
                flex: 1,
                padding: '10px 4px',
                border: 'none',
                background: 'transparent',
                color: activeTab === 'incident' ? 'var(--brand-gold-400)' : '#94a3b8',
                fontSize: '11.5px',
                fontWeight: 700,
                borderBottom: activeTab === 'incident' ? '2px solid var(--brand-gold-400)' : 'none',
                cursor: 'pointer'
              }}
            >
              Quick Log
            </button>
            <button
              onClick={() => setActiveTab('sos')}
              style={{
                flex: 1,
                padding: '10px 4px',
                border: 'none',
                background: 'transparent',
                color: activeTab === 'sos' ? '#ef4444' : '#94a3b8',
                fontSize: '11.5px',
                fontWeight: 700,
                borderBottom: activeTab === 'sos' ? '2px solid #ef4444' : 'none',
                cursor: 'pointer'
              }}
            >
              🚨 SOS
            </button>
          </div>

          {/* Mobile Screen Body */}
          <div style={{ padding: '18px', minHeight: '440px', overflowY: 'auto' }}>
            {/* View 1: Duty & Clock-In */}
            {activeTab === 'duty' && (
              <div>
                {/* Facility Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '18px'
                }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                    Assigned Guarded Post
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="var(--brand-gold-400)" />
                    <span>{activeSite.name}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    {activeSite.address} • Geofence: {activeSite.geofenceRadiusMeters}m
                  </div>

                  <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <span>Shift: <strong>Morning (06:00 - 14:00)</strong></span>
                    <span style={{ color: 'var(--status-success)' }}>● Inside Geofence</span>
                  </div>
                </div>

                {/* Clock In / Out Big Action Button */}
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  {!todayAttendance?.punchInTime ? (
                    <button
                      onClick={handleMobileClockIn}
                      disabled={isPunching}
                      style={{
                        width: '160px',
                        height: '160px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                        border: '6px solid rgba(245, 158, 11, 0.3)',
                        boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)',
                        color: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        margin: '0 auto',
                        transition: 'transform 150ms'
                      }}
                      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
                      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <Clock size={36} />
                      <span style={{ fontSize: '15px', fontWeight: 800 }}>CLOCK IN</span>
                      <span style={{ fontSize: '10.5px', opacity: 0.9 }}>GPS & Geofence Verified</span>
                    </button>
                  ) : !todayAttendance.punchOutTime ? (
                    <div>
                      <div style={{
                        width: '160px',
                        height: '160px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        border: '6px solid rgba(16, 185, 129, 0.3)',
                        boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
                        color: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        margin: '0 auto 16px'
                      }}>
                        <CheckCircle size={32} />
                        <span style={{ fontSize: '15px', fontWeight: 800 }}>ON DUTY</span>
                        <span style={{ fontSize: '11px', opacity: 0.9 }}>Since {todayAttendance.punchInTime}</span>
                      </div>

                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={handleMobileClockOut}
                        style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                      >
                        Punch Clock-Out
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '14px' }}>
                      <CheckCircle size={36} color="var(--status-success)" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '15px', fontWeight: 700 }}>Shift Completed</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        In: {todayAttendance.punchInTime} • Out: {todayAttendance.punchOutTime}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* View 2: QR Checkpoint Patrol */}
            {activeTab === 'patrol' && (
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                  {activePatrol?.routeName || 'Perimeter Security Route'}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
                  Scan RFID / QR tags located at designated site barriers.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activePatrol?.checkpoints.map(cp => (
                    <div
                      key={cp.id}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: cp.status === 'Completed' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${cp.status === 'Completed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{cp.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{cp.qrCode}</div>
                      </div>

                      {cp.status === 'Completed' ? (
                        <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 700 }}>
                          ✓ {cp.scannedAt}
                        </span>
                      ) : (
                        <button
                          className="btn btn-gold btn-sm"
                          onClick={() => scanPatrolCheckpoint(activePatrol.id, cp.id)}
                        >
                          <QrCode size={13} />
                          <span>Scan</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 3: Quick Incident Log */}
            {activeTab === 'incident' && (
              <form onSubmit={handleMobileReportIncident}>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
                  Quick Field Incident Report
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11.5px', color: '#cbd5e1' }}>Incident Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Unregistered vehicle parked"
                    value={incTitle}
                    onChange={e => setIncTitle(e.target.value)}
                    style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', borderColor: '#334155' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11.5px', color: '#cbd5e1' }}>Observations *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Details..."
                    value={incDesc}
                    onChange={e => setIncDesc(e.target.value)}
                    style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', borderColor: '#334155' }}
                  />
                </div>

                <button type="submit" className="btn btn-danger" style={{ width: '100%' }}>
                  Submit Incident to Control Room
                </button>
              </form>
            )}

            {/* View 4: Emergency SOS */}
            {activeTab === 'sos' && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#f87171', marginBottom: '6px' }}>
                  ONE-TOUCH FIELD DISTRESS SOS
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '24px' }}>
                  Hold or tap below to instantly transmit your live GPS coordinates to the SGF Quick Response Team (QRT) and Site Supervisor.
                </div>

                <button
                  onClick={handleMobileSOS}
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #dc2626 0%, #991b1b 100%)',
                    border: '8px solid rgba(239, 68, 68, 0.35)',
                    boxShadow: '0 0 35px rgba(239, 68, 68, 0.6)',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    margin: '0 auto',
                    animation: 'pulse-subtle 1.2s infinite'
                  }}
                >
                  <AlertOctagon size={48} />
                  <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.08em' }}>SOS</span>
                </button>

                <div style={{ marginTop: '20px', fontSize: '11px', color: '#94a3b8' }}>
                  Transmits GPS: {activeSite.latitude.toFixed(4)}, {activeSite.longitude.toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
