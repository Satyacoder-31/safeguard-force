import React, { useState } from 'react';
import { 
  CheckSquare, Calendar, Shield, Package, 
  CheckCircle, AlertTriangle, FileCheck, Award 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { StatusBadge } from '../../common/StatusBadge';

export const HRCompliance: React.FC = () => {
  const { leaves, approveLeave, rejectLeave, uniforms, t, addToast } = useERP();
  const [activeTab, setActiveTab] = useState<'leaves' | 'uniforms' | 'statutory'>('leaves');

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
    </div>
  );
};
