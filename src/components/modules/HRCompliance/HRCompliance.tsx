import React, { useState } from 'react';
import { 
  CheckSquare, Calendar, Shield, Package, 
  CheckCircle, AlertTriangle, FileCheck, Award, Plus 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';
import { LeaveRequest } from '../../../types/erp';

export const HRCompliance: React.FC = () => {
  const { guards, leaves, applyLeave, approveLeave, rejectLeave, uniforms, t, addToast } = useERP();
  const [activeTab, setActiveTab] = useState<'leaves' | 'uniforms' | 'statutory'>('leaves');
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    guardId: guards[0]?.id || '',
    leaveType: 'Casual Leave' as LeaveRequest['leaveType'],
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10),
    daysCount: 3,
    reason: 'Family requirement / urgent personal work'
  });

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const guard = guards.find(g => g.id === leaveForm.guardId) || guards[0];
    applyLeave({
      guardId: guard?.id,
      guardName: guard?.name,
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      daysCount: Number(leaveForm.daysCount) || 1,
      reason: leaveForm.reason
    });
    setIsApplyLeaveOpen(false);
  };

  const statutoryChecklist = [
    { id: 'st-1', rule: 'PSARA License (Private Security Agencies Regulation Act)', authority: 'State Home Dept. (Haryana & Delhi)', status: 'Compliant & Valid until 2028', badge: 'Verified' },
    { id: 'st-2', rule: 'Employees’ Provident Fund (EPF) Form 12A / ECR', authority: 'EPFO Central Portal', status: 'Monthly ECR filed & paid on 10th Oct', badge: 'Verified' },
    { id: 'st-3', rule: 'Employees’ State Insurance (ESIC) Form 5 / Challan', authority: 'ESIC Portal', status: 'Challan verified for 142 covered personnel', badge: 'Verified' },
    { id: 'st-4', rule: 'State Minimum Wages Act Schedule Compliance', authority: 'Ministry of Labour & Employment', status: 'Basic pay verified above statutory minimums', badge: 'Verified' },
    { id: 'st-5', rule: 'Police Character Verification of Armed Personnel', authority: 'District Police Commissionerates', status: '100% Armed Guards Verified; 1 In Process', badge: 'Review Needed' },
    { id: 'st-6', rule: 'Fire Safety & First Aid Training Certification', authority: 'SGF Training Academy', status: 'Bi-annual refresher conducted Sept 2026', badge: 'Verified' }
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <CheckSquare size={26} color="var(--brand-gold-400)" />
            {t('hrCompliance')}
          </h1>
          <p>
            Workforce leave administration, uniform inventory provisioning, and India statutory labor compliance audits.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-gold" onClick={() => setIsApplyLeaveOpen(true)}>
            <Plus size={16} />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          Leave Applications ({leaves.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'uniforms' ? 'active' : ''}`}
          onClick={() => setActiveTab('uniforms')}
        >
          Uniform & Kit Inventory ({uniforms.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'statutory' ? 'active' : ''}`}
          onClick={() => setActiveTab('statutory')}
        >
          Statutory PSARA & Labour Compliance
        </button>
      </div>

      {/* Tab 1: Leaves */}
      {activeTab === 'leaves' && (
        <div className="table-container">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guard Name</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Total Days</th>
                  <th>Reason / Context</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Supervisor Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600 }}>{l.guardName}</td>
                    <td>{l.leaveType}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {l.startDate} to {l.endDate}
                    </td>
                    <td style={{ fontWeight: 700 }}>{l.daysCount} Days</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{l.reason}</td>
                    <td><StatusBadge status={l.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      {l.status === 'Pending' ? (
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => approveLeave(l.id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => rejectLeave(l.id)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {l.status} by {l.approvedBy || 'Operations'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Uniforms */}
      {activeTab === 'uniforms' && (
        <div className="table-container">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name & Description</th>
                  <th>Category</th>
                  <th>Total Acquired</th>
                  <th>Issued to Guards</th>
                  <th>Available in Warehouse</th>
                  <th>Unit Cost (₹)</th>
                  <th>Inventory Status</th>
                </tr>
              </thead>
              <tbody>
                {uniforms.map(item => {
                  const isLow = item.availableStock < 10;

                  return (
                    <tr key={item.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                        {item.code}
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.totalStock} units</td>
                      <td style={{ fontWeight: 600 }}>{item.issuedCount} units</td>
                      <td style={{ fontWeight: 700, color: isLow ? 'var(--status-danger)' : 'var(--status-success)' }}>
                        {item.availableStock} units
                      </td>
                      <td>₹{item.unitCost.toLocaleString()}</td>
                      <td>
                        <StatusBadge status={isLow ? 'Low Stock' : 'In Stock'} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Statutory Compliance */}
      {activeTab === 'statutory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card" style={{ background: 'var(--bg-subtle)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
              India Labour & Security Regulatory Compliance Matrix
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Monthly validation against Private Security Agencies (Regulation) Act, EPFO, ESIC, and minimum wage gazettes.
            </p>
          </div>

          <div className="table-container">
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Statutory Rule / Act</th>
                    <th>Regulatory Authority</th>
                    <th>Compliance Verification Status</th>
                    <th>Audit Finding</th>
                  </tr>
                </thead>
                <tbody>
                  {statutoryChecklist.map(sc => (
                    <tr key={sc.id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {sc.rule}
                      </td>
                      <td style={{ fontSize: '12.5px' }}>{sc.authority}</td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {sc.status}
                      </td>
                      <td>
                        <StatusBadge status={sc.badge} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      <Modal 
        isOpen={isApplyLeaveOpen} 
        onClose={() => setIsApplyLeaveOpen(false)} 
        title="Submit Guard Leave Application"
      >
        <form onSubmit={handleApplyLeave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Select Guard / Employee *</label>
            <select 
              className="form-control" 
              value={leaveForm.guardId} 
              onChange={e => setLeaveForm({ ...leaveForm, guardId: e.target.value })}
              required
            >
              {guards.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.category} - {g.guardIdNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Leave Category *</label>
            <select 
              className="form-control"
              value={leaveForm.leaveType}
              onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveRequest['leaveType'] })}
            >
              <option value="Casual Leave">Casual Leave (CL)</option>
              <option value="Sick Leave">Sick Leave / Medical (SL)</option>
              <option value="Earned Leave">Earned Leave (EL / PL)</option>
              <option value="Bereavement Leave">Bereavement Leave</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={leaveForm.startDate} 
                onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={leaveForm.endDate} 
                onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Total Days</label>
              <input 
                type="number" 
                className="form-control" 
                min="1" 
                max="30"
                value={leaveForm.daysCount} 
                onChange={e => setLeaveForm({ ...leaveForm, daysCount: parseInt(e.target.value) || 1 })}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reason / Notes *</label>
            <textarea 
              className="form-control" 
              rows={3}
              value={leaveForm.reason}
              onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              placeholder="State reason for absence and emergency contact details..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsApplyLeaveOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gold">
              Submit Leave Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
