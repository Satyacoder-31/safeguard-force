import React, { useState } from 'react';
import { 
  Clock, MapPin, CheckCircle, AlertTriangle, 
  Smartphone, UserCheck, Shield, Filter, Crosshair, 
  Search, Download 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { AttendanceRecord } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const AttendanceDashboard: React.FC = () => {
  const { 
    attendance, guards, sites, 
    recordPunch, regularizeAttendance, 
    currentUser, t, addToast 
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [regularizingRecord, setRegularizingRecord] = useState<AttendanceRecord | null>(null);
  const [regularizeReason, setRegularizeReason] = useState('Authorized client gate relocation / technical GPS drift.');

  // Punch Simulator form state
  const [simGuardId, setSimGuardId] = useState(guards[0]?.id || '');
  const [simSiteId, setSimSiteId] = useState(sites[0]?.id || '');
  const [simLocationMode, setSimLocationMode] = useState<'inside' | 'outside'>('inside');

  const filteredAttendance = attendance.filter(a => {
    const matchesSearch = 
      a.guardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.siteName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSite = selectedSiteFilter === 'All' || a.siteId === selectedSiteFilter;
    const matchesStatus = selectedStatusFilter === 'All' || a.status === selectedStatusFilter;
    return matchesSearch && matchesSite && matchesStatus;
  });

  const handleSimulatePunch = (e: React.FormEvent) => {
    e.preventDefault();
    const site = sites.find(s => s.id === simSiteId);
    if (!site) return;

    if (simLocationMode === 'inside') {
      // Coordinates right on site (inside geofence)
      recordPunch(simGuardId, simSiteId, true, site.latitude + 0.0001, site.longitude + 0.0001);
    } else {
      // Coordinates 800m away (triggers geofence exception)
      recordPunch(simGuardId, simSiteId, true, site.latitude + 0.0075, site.longitude + 0.0075);
    }
    setIsSimulatorOpen(false);
  };

  const handleConfirmRegularization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regularizingRecord) return;
    regularizeAttendance(regularizingRecord.id, regularizeReason);
    setRegularizingRecord(null);
  };

  const handleExportCSV = () => {
    const headers = "Guard Name,Site,Date,Shift,Punch In,Punch Out,Geofence Distance,Status,Verified\n";
    const rows = filteredAttendance.map(a => 
      `"${a.guardName}","${a.siteName}","${a.date}","${a.shiftType}","${a.punchInTime}","${a.punchOutTime || 'On Duty'}","${a.distanceFromSiteMeters}m (${a.isInsideGeofence ? 'Inside' : 'Outside'})","${a.status}","${a.supervisorVerified ? 'Yes' : 'No'}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SGF_Attendance_${new Date().toISOString().substring(0, 10)}.csv`;
    link.click();
    addToast('success', 'Attendance Exported', `${filteredAttendance.length} attendance records exported.`);
  };

  // Quick stats
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;
  const exceptionCount = attendance.filter(a => !a.isInsideGeofence && !a.supervisorVerified).length;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Clock size={26} color="var(--brand-gold-400)" />
            {t('attendance')}
          </h1>
          <p>
            Real-time GPS biometric attendance stream, geofence radius validation, and supervisor regularization audit.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>{t('exportCsv')}</span>
          </button>

          {/* Punch In Simulator Button */}
          <button className="btn btn-gold" onClick={() => setIsSimulatorOpen(true)}>
            <Smartphone size={16} />
            <span>Simulate Mobile Clock-In</span>
          </button>
        </div>
      </div>

      {/* Attendance Stats Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Present on Duty
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--status-success)', marginTop: '4px' }}>
            {presentCount} Guards
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Verified Inside Geofence
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Late Arrivals
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--status-warning-fg)', marginTop: '4px' }}>
            {lateCount} Guards
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            After shift scheduled start
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            GPS Location Exceptions
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: exceptionCount > 0 ? 'var(--status-danger)' : 'var(--text-primary)', marginTop: '4px' }}>
            {exceptionCount} Pending
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Outside perimeter boundary
          </div>
        </div>
      </div>

      {/* Filters and Table Toolbar */}
      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={15} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search guard name or site..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-actions">
            <select 
              className="form-control"
              value={selectedSiteFilter}
              onChange={e => setSelectedSiteFilter(e.target.value)}
              style={{ fontSize: '12.5px', height: '34px' }}
            >
              <option value="All">All Facilities</option>
              {sites.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select 
              className="form-control"
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              style={{ fontSize: '12.5px', height: '34px' }}
            >
              <option value="All">All Attendance Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late Arrival</option>
              <option value="Regularized">Regularized</option>
            </select>
          </div>
        </div>

        {/* Live Attendance Table */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Guard Personnel</th>
                <th>Assigned Facility</th>
                <th>Shift & Date</th>
                <th>Punch-In Timestamp</th>
                <th>Clock-Out</th>
                <th>GPS Geofence Validation</th>
                <th>Status</th>
                <th>Supervisor Sign-Off</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map(att => (
                <tr key={att.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {att.guardName}
                  </td>
                  <td>
                    <div style={{ fontSize: '12.5px' }}>{att.siteName}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{att.shiftType} Shift</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{att.date}</div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {att.punchInTime}
                  </td>
                  <td style={{ fontSize: '12px', color: att.punchOutTime ? 'var(--text-primary)' : 'var(--status-info)' }}>
                    {att.punchOutTime || '● On Post'}
                  </td>
                  <td>
                    {att.isInsideGeofence ? (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        fontSize: '11.5px', 
                        fontWeight: 700, 
                        color: 'var(--status-success)',
                        background: 'var(--status-success-bg)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        <CheckCircle size={12} />
                        Inside ({att.distanceFromSiteMeters}m)
                      </span>
                    ) : (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        fontSize: '11.5px', 
                        fontWeight: 700, 
                        color: 'var(--status-danger)',
                        background: 'var(--status-danger-bg)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}>
                        <AlertTriangle size={12} />
                        {att.distanceFromSiteMeters}m Outside Geofence
                      </span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={att.status} />
                  </td>
                  <td>
                    {att.supervisorVerified ? (
                      <span style={{ fontSize: '11.5px', color: 'var(--status-success)', fontWeight: 600 }}>
                        ✓ Approved
                      </span>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: 'var(--status-warning-fg)', fontWeight: 600 }}>
                        Review Needed
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {!att.isInsideGeofence && !att.supervisorVerified ? (
                      <button 
                        className="btn btn-gold btn-sm"
                        onClick={() => setRegularizingRecord(att)}
                        title="Regularize Attendance"
                      >
                        Regularize
                      </button>
                    ) : !att.punchOutTime ? (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => recordPunch(att.guardId, att.siteId, false)}
                        title="Record Clock-Out"
                      >
                        Punch Out
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regularize Exception Modal */}
      {regularizingRecord && (
        <Modal
          isOpen={true}
          onClose={() => setRegularizingRecord(null)}
          title="Regularize Attendance GPS Exception"
          subtitle={`Guard: ${regularizingRecord.guardName} • Site: ${regularizingRecord.siteName}`}
          size="md"
        >
          <form onSubmit={handleConfirmRegularization}>
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--status-warning-bg)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--status-warning-fg)' }}>
                Exception Details
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Punch recorded {regularizingRecord.distanceFromSiteMeters} meters outside site perimeter boundary at {regularizingRecord.punchInTime}.
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Supervisor Justification / Reason *</label>
              <textarea 
                className="form-control"
                rows={3}
                required
                value={regularizeReason}
                onChange={e => setRegularizeReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setRegularizingRecord(null)}
              >
                Reject Exception
              </button>
              <button type="submit" className="btn btn-gold">
                Approve & Regularize for Payroll
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Mobile Clock-In Simulator Modal */}
      {isSimulatorOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsSimulatorOpen(false)}
          title="Field Mobile Attendance Punch Simulator"
          subtitle="Test mobile clock-in with geofence distance calculation"
          size="md"
        >
          <form onSubmit={handleSimulatePunch}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Guard Field User</label>
              <select 
                className="form-control"
                value={simGuardId}
                onChange={e => setSimGuardId(e.target.value)}
              >
                {guards.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.category})</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Target Guarded Facility</label>
              <select 
                className="form-control"
                value={simSiteId}
                onChange={e => setSimSiteId(e.target.value)}
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.geofenceRadiusMeters}m geofence)</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label">Simulated Physical Location</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="locMode" 
                    checked={simLocationMode === 'inside'} 
                    onChange={() => setSimLocationMode('inside')} 
                  />
                  <span>Inside Geofence (~20m) [Normal]</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="locMode" 
                    checked={simLocationMode === 'outside'} 
                    onChange={() => setSimLocationMode('outside')} 
                  />
                  <span>Outside Boundary (~840m) [Exception]</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsSimulatorOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Punch In Now
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
