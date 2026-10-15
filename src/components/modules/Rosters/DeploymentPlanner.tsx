import React, { useState } from 'react';
import { 
  CalendarClock, Users, AlertTriangle, CheckCircle, 
  Plus, UserCheck, Shield, Clock, MapPin 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { ShiftRoster } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const DeploymentPlanner: React.FC = () => {
  const { 
    shifts, sites, guards, assignGuardToShift, 
    t, addToast 
  } = useERP();

  const [selectedSiteId, setSelectedSiteId] = useState<string>('All');
  const [selectedShiftType, setSelectedShiftType] = useState<string>('All');
  const [assigningShift, setAssigningShift] = useState<ShiftRoster | null>(null);
  const [selectedGuardToDeploy, setSelectedGuardToDeploy] = useState<string>('');

  const filteredShifts = shifts.filter(s => {
    const matchesSite = selectedSiteId === 'All' || s.siteId === selectedSiteId;
    const matchesType = selectedShiftType === 'All' || s.shiftType === selectedShiftType;
    return matchesSite && matchesType;
  });

  const handleDeployReliever = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningShift || !selectedGuardToDeploy) return;

    // Check if guard is already assigned
    if (assigningShift.assignedGuardIds.includes(selectedGuardToDeploy)) {
      addToast('warning', 'Already Deployed', 'This guard is already deployed to this post.');
      return;
    }

    assignGuardToShift(assigningShift.id, selectedGuardToDeploy);
    setAssigningShift(null);
    setSelectedGuardToDeploy('');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <CalendarClock size={26} color="var(--brand-gold-400)" />
            {t('deployments')}
          </h1>
          <p>
            Central shift planning engine, real-time vacancy detection, rotational rosters, and reliever dispatching.
          </p>
        </div>

        <div className="page-actions-group">
          {/* Site Filter */}
          <select 
            className="form-control"
            value={selectedSiteId}
            onChange={e => setSelectedSiteId(e.target.value)}
            style={{ width: '220px', height: '38px', fontSize: '13px' }}
          >
            <option value="All">All Client Facilities</option>
            {sites.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Shift Type Filter */}
          <select 
            className="form-control"
            value={selectedShiftType}
            onChange={e => setSelectedShiftType(e.target.value)}
            style={{ width: '160px', height: '38px', fontSize: '13px' }}
          >
            <option value="All">All Shifts</option>
            <option value="Morning">Morning (06-14)</option>
            <option value="Evening">Evening (14-22)</option>
            <option value="Night">Night (22-06)</option>
          </select>
        </div>
      </div>

      {/* Vacancy Summary Alert */}
      {shifts.some(s => s.status === 'Shortage') && (
        <div style={{
          marginBottom: '20px',
          padding: '14px 18px',
          background: 'var(--status-warning-bg)',
          border: '1px solid var(--status-warning-border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="var(--status-warning-fg)" />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--status-warning-fg)' }}>
                Active Guard Shortage Detected at DLF CyberHub Central Plaza
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Evening Shift (14:00 - 22:00) has unfilled posts. Contract requires 6 guards, current deployment is 1.
              </div>
            </div>
          </div>
          <button 
            className="btn btn-gold btn-sm"
            onClick={() => {
              const shortage = shifts.find(s => s.status === 'Shortage');
              if (shortage) setAssigningShift(shortage);
            }}
          >
            Deploy Reliever Now
          </button>
        </div>
      )}

      {/* Rosters Grid by Shift & Facility */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredShifts.map(shift => {
          const isShortage = shift.status === 'Shortage';
          const vacantCount = Math.max(0, shift.requiredGuards - shift.assignedGuardIds.length);

          return (
            <div 
              key={shift.id} 
              className="card"
              style={{
                borderTop: `4px solid ${isShortage ? 'var(--status-warning)' : 'var(--status-success)'}`
              }}
            >
              <div className="card-header" style={{ alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {shift.siteName}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    <Clock size={13} />
                    <span>{shift.shiftType} Shift • {shift.timing}</span>
                  </div>
                </div>

                <StatusBadge status={shift.status} />
              </div>

              {/* Strength Progress */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>Staffing Strength</span>
                  <span style={{ fontWeight: 700, color: isShortage ? 'var(--status-warning-fg)' : 'var(--status-success)' }}>
                    {shift.assignedGuardIds.length} / {shift.requiredGuards} Guards
                    {vacantCount > 0 && ` (${vacantCount} vacant)`}
                  </span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${Math.min(100, (shift.assignedGuardIds.length / shift.requiredGuards) * 100)}%`,
                      background: isShortage ? 'var(--status-warning)' : 'var(--status-success)'
                    }} 
                  />
                </div>
              </div>

              {/* Deployed Guards List */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Personnel on Duty
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {shift.assignedGuards.map((g, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12.5px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={14} color="var(--status-success)" />
                        <span style={{ fontWeight: 600 }}>{g.name}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{g.category}</span>
                    </div>
                  ))}

                  {/* Empty slots placeholders */}
                  {Array.from({ length: vacantCount }).map((_, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px dashed var(--status-warning-border)',
                        background: 'var(--status-warning-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: 'var(--status-warning-fg)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={13} />
                        <span>Vacant Post #{shift.assignedGuardIds.length + idx + 1}</span>
                      </div>
                      <span style={{ fontWeight: 600 }}>Uncovered</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setAssigningShift(shift)}
                >
                  <Plus size={13} />
                  <span>Assign Guard / Reliever</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reliever Deployment Modal */}
      {assigningShift && (
        <Modal
          isOpen={true}
          onClose={() => setAssigningShift(null)}
          title={`Assign Guard to ${assigningShift.siteName}`}
          subtitle={`${assigningShift.shiftType} Shift (${assigningShift.timing})`}
          size="md"
        >
          <form onSubmit={handleDeployReliever}>
            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label">Select Available Guard / Reserve Pool *</label>
              <select 
                className="form-control"
                required
                value={selectedGuardToDeploy}
                onChange={e => setSelectedGuardToDeploy(e.target.value)}
              >
                <option value="">-- Choose Guard from Active Pool --</option>
                {guards
                  .filter(g => g.status === 'Active' && !assigningShift.assignedGuardIds.includes(g.id))
                  .map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.guardIdNumber} - {g.category})
                    </option>
                  ))
                }
              </select>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                System automatically verifies guard active status and avoids conflicting simultaneous shifts.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setAssigningShift(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Deploy to Post
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
