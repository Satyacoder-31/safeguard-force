import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, Plus, Search, 
  Filter, CheckCircle, FileText, ArrowRight, UserCheck 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { Incident } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const IncidentManagement: React.FC = () => {
  const { incidents, sites, reportIncident, updateIncidentStatus, t, addToast } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [viewingIncident, setViewingIncident] = useState<Incident | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    siteId: sites[0]?.id || '',
    severity: 'High' as Incident['severity'],
    category: 'Trespassing' as Incident['category'],
    title: '',
    description: '',
    immediateActionTaken: '',
    investigator: 'Subedar Balwant Singh'
  });

  // Investigation resolution inputs
  const [capaRootCause, setCapaRootCause] = useState('');
  const [capaPreventiveAction, setCapaPreventiveAction] = useState('');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.incidentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.siteName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All' || inc.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'All' || inc.status === selectedStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast('warning', 'Validation Error', 'Title and description are required.');
      return;
    }
    reportIncident(formData);
    setIsReportModalOpen(false);
    setFormData({
      siteId: sites[0]?.id || '',
      severity: 'High',
      category: 'Trespassing',
      title: '',
      description: '',
      immediateActionTaken: '',
      investigator: 'Subedar Balwant Singh'
    });
  };

  const handleAdvanceStatus = (nextStatus: Incident['status']) => {
    if (!viewingIncident) return;
    updateIncidentStatus(viewingIncident.id, nextStatus, capaRootCause, capaPreventiveAction);
    setViewingIncident({
      ...viewingIncident,
      status: nextStatus,
      rootCause: capaRootCause || viewingIncident.rootCause,
      preventiveAction: capaPreventiveAction || viewingIncident.preventiveAction
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <ShieldAlert size={26} color="var(--status-danger)" />
            {t('incidents')}
          </h1>
          <p>
            Security breach recording, root cause analysis, evidence logging, and Corrective Action (CAPA) tracking.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-danger" onClick={() => setIsReportModalOpen(true)}>
            <Plus size={16} />
            <span>Report Security Incident</span>
          </button>
        </div>
      </div>

      {/* Filter and Table Toolbar */}
      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={15} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by incident #, title, site..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-actions">
            <select 
              className="form-control"
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              style={{ fontSize: '12.5px', height: '34px' }}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select 
              className="form-control"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{ fontSize: '12.5px', height: '34px' }}
            >
              <option value="All">All Workflow States</option>
              <option value="Reported">Reported</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Action Required">Action Required</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Incident #</th>
                <th>Severity</th>
                <th>Category & Title</th>
                <th>Facility / Site</th>
                <th>Date & Time</th>
                <th>Reported By</th>
                <th>Investigator</th>
                <th>Workflow Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map(inc => (
                <tr key={inc.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                    {inc.incidentNumber}
                  </td>
                  <td>
                    <StatusBadge status={inc.severity} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inc.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Category: {inc.category}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12.5px' }}>{inc.siteName.split('-')[0]}</div>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {inc.timestamp}
                  </td>
                  <td style={{ fontSize: '12.5px' }}>
                    {inc.reportedByName}
                  </td>
                  <td style={{ fontSize: '12.5px', fontWeight: 500 }}>
                    {inc.investigator || 'Unassigned'}
                  </td>
                  <td>
                    <StatusBadge status={inc.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setViewingIncident(inc);
                        setCapaRootCause(inc.rootCause || '');
                        setCapaPreventiveAction(inc.preventiveAction || '');
                      }}
                      title="Inspect Incident Dossier"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail / Investigation Modal */}
      {viewingIncident && (
        <Modal
          isOpen={true}
          onClose={() => setViewingIncident(null)}
          title={`Incident Dossier: ${viewingIncident.incidentNumber}`}
          subtitle={`${viewingIncident.category} • Reported: ${viewingIncident.timestamp}`}
          size="lg"
        >
          <div>
            {/* Header info strip */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-subtle)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '18px'
            }}>
              <div>
                <span className="form-label">Facility</span>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{viewingIncident.siteName}</div>
              </div>
              <div>
                <span className="form-label">Severity</span>
                <StatusBadge status={viewingIncident.severity} />
              </div>
              <div>
                <span className="form-label">Current State</span>
                <StatusBadge status={viewingIncident.status} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>{viewingIncident.title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {viewingIncident.description}
              </p>
            </div>

            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <span className="form-label">Immediate Response Action Taken</span>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                {viewingIncident.immediateActionTaken}
              </div>
            </div>

            {/* Root Cause & Preventive Action (CAPA) */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginBottom: '18px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                Corrective and Preventive Actions (CAPA)
              </h4>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Determined Root Cause</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Visitor verification gap during high rush"
                  value={capaRootCause}
                  onChange={e => setCapaRootCause(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preventive Measure Implemented</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Additional frisking turnstile commissioned"
                  value={capaPreventiveAction}
                  onChange={e => setCapaPreventiveAction(e.target.value)}
                />
              </div>
            </div>

            {/* Status Workflow Action Progression */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '16px'
            }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Investigator: {viewingIncident.investigator}
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                {viewingIncident.status === 'Reported' && (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleAdvanceStatus('Under Investigation')}
                  >
                    Acknowledge & Begin Investigation
                  </button>
                )}

                {viewingIncident.status === 'Under Investigation' && (
                  <button 
                    className="btn btn-gold btn-sm"
                    onClick={() => handleAdvanceStatus('Action Required')}
                  >
                    Action Required (Escalate)
                  </button>
                )}

                {viewingIncident.status !== 'Resolved' && viewingIncident.status !== 'Closed' && (
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => handleAdvanceStatus('Resolved')}
                  >
                    <CheckCircle size={14} />
                    <span>Mark Incident Resolved</span>
                  </button>
                )}

                {viewingIncident.status === 'Resolved' && (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleAdvanceStatus('Closed')}
                  >
                    Close Dossier
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Report Incident Modal */}
      {isReportModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsReportModalOpen(false)}
          title="File Official Security Incident Report"
          subtitle="Record anomaly, category, severity, and immediate security containment"
          size="lg"
        >
          <form onSubmit={handleCreateIncident}>
            <div className="form-grid" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Guarded Facility *</label>
                <select 
                  className="form-control"
                  value={formData.siteId}
                  onChange={e => setFormData({ ...formData, siteId: e.target.value })}
                >
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Severity Level *</label>
                <select 
                  className="form-control"
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value as any })}
                >
                  <option value="Critical">Critical (Immediate Hazard / Breach)</option>
                  <option value="High">High (Perimeter / Asset Risk)</option>
                  <option value="Medium">Medium (Disorder / Protocol Gap)</option>
                  <option value="Low">Low (Maintenance / Equipment)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Incident Category *</label>
                <select 
                  className="form-control"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                >
                  <option value="Trespassing">Trespassing / Intrusion</option>
                  <option value="Theft">Theft / Pilferage</option>
                  <option value="Disorderly Conduct">Disorderly Conduct / Altercation</option>
                  <option value="Fire Alarm">Fire Alarm / Smoke Sensor</option>
                  <option value="Equipment Damage">Equipment / Barrier Damage</option>
                  <option value="Medical">Medical Emergency</option>
                  <option value="Suspicious Activity">Suspicious Activity</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Lead Investigator</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.investigator}
                  onChange={e => setFormData({ ...formData, investigator: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Incident Title / Summary *</label>
              <input 
                type="text" 
                className="form-control" 
                required
                placeholder="Brief descriptive headline of the occurrence"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Detailed Incident Account *</label>
              <textarea 
                className="form-control" 
                rows={3}
                required
                placeholder="What occurred, people involved, time sequence, and observations..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Immediate Response Action Taken *</label>
              <textarea 
                className="form-control" 
                rows={2}
                required
                placeholder="Action taken immediately to contain situation..."
                value={formData.immediateActionTaken}
                onChange={e => setFormData({ ...formData, immediateActionTaken: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsReportModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                Broadcast & Log Incident
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
