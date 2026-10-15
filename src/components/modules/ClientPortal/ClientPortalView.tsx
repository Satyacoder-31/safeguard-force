import React, { useState } from 'react';
import { 
  Building2, Users, FileText, CheckCircle, 
  MessageSquare, Plus, Download, ShieldCheck, 
  AlertTriangle, Eye, Shield 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const ClientPortalView: React.FC = () => {
  const { 
    clients, sites, guards, attendance, 
    patrols, invoices, complaints, 
    submitComplaint, currentUser, t, addToast 
  } = useERP();

  // Tenant isolation: Default to DLF CyberCity (cl-1) or currentUser.clientId
  const tenantClientId = currentUser.clientId || 'cl-1';
  const tenantClient = clients.find(c => c.id === tenantClientId) || clients[0];

  // Filter ONLY records belonging to this client (strict tenant isolation!)
  const tenantSites = sites.filter(s => s.clientId === tenantClient.id);
  const tenantSiteIds = tenantSites.map(s => s.id);
  const tenantInvoices = invoices.filter(inv => inv.clientId === tenantClient.id);
  const tenantComplaints = complaints.filter(cmp => cmp.clientId === tenantClient.id);
  const tenantAttendance = attendance.filter(a => tenantSiteIds.includes(a.siteId));
  const tenantPatrols = patrols.filter(p => tenantSiteIds.includes(p.siteId));

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'patrols' | 'requests' | 'invoices'>('overview');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // New ticket state
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [ticketSiteId, setTicketSiteId] = useState(tenantSites[0]?.id || '');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) {
      addToast('warning', 'Validation Error', 'Ticket subject is required.');
      return;
    }
    submitComplaint({
      siteId: ticketSiteId,
      title: ticketTitle,
      description: ticketDesc,
      priority: ticketPriority
    });
    setIsRequestModalOpen(false);
    setTicketTitle('');
    setTicketDesc('');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-info" style={{ fontSize: '11px' }}>
              Client Tenant Isolated Session
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Verified: {tenantClient.legalEntityName}
            </span>
          </div>
          <h1>
            <Building2 size={26} color="var(--brand-gold-400)" />
            {tenantClient.name} — Client Portal
          </h1>
          <p>
            Authorized client view for facility security posture, daily muster roll, patrol verification, and billing.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-gold" onClick={() => setIsRequestModalOpen(true)}>
            <Plus size={16} />
            <span>Raise Service Request / Extra Guards</span>
          </button>
        </div>
      </div>

      {/* Tenant KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--status-success)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Guards on Duty Today
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--status-success)', marginTop: '4px' }}>
            {tenantAttendance.length} Personnel
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Contracted Strength: <strong>42 Posts</strong>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--brand-gold-400)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Guarded Facilities
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-gold-400)', marginTop: '4px' }}>
            {tenantSites.length} Sites
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            All GPS Geofenced & Active
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--status-info)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Patrol Compliance Rate
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--status-info)', marginTop: '4px' }}>
            96.8%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            QR Checkpoints Completed
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--brand-navy-600)' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Outstanding Balance
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            ₹{tenantClient.totalOutstanding.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Monthly Invoicing: ₹{tenantClient.monthlyBilledAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Guarded Sites ({tenantSites.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Daily Guard Attendance ({tenantAttendance.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'patrols' ? 'active' : ''}`}
          onClick={() => setActiveTab('patrols')}
        >
          Patrol Compliance Logs ({tenantPatrols.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Service Tickets & Requests ({tenantComplaints.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          Tax Invoices & Billing ({tenantInvoices.length})
        </button>
      </div>

      {/* Tab 1: Sites */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {tenantSites.map(site => (
            <div key={site.id} className="card">
              <div className="card-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{site.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {site.address}, {site.city}
                  </div>
                </div>
                <StatusBadge status={site.status} />
              </div>

              <div style={{
                background: 'var(--bg-subtle)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                fontSize: '12.5px',
                marginBottom: '14px'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Contract Strength:</span>
                  <div style={{ fontWeight: 700 }}>{site.requiredStrength} Guards</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Currently Deployed:</span>
                  <div style={{ fontWeight: 700, color: 'var(--status-success)' }}>{site.assignedGuardsCount} Guards</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Site Supervisor:</span>
                  <div style={{ fontWeight: 600 }}>{site.supervisorName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Emergency Desk:</span>
                  <div style={{ fontWeight: 600, color: 'var(--status-danger)' }}>{site.emergencyContact}</div>
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={13} color="var(--status-success)" />
                <span>Geofenced radius: {site.geofenceRadiusMeters} meters around entrance cores</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Daily Attendance */}
      {activeTab === 'attendance' && (
        <div className="table-container">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guard Personnel</th>
                  <th>Facility</th>
                  <th>Shift Timing</th>
                  <th>Time Recorded</th>
                  <th>GPS Geofence Status</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenantAttendance.map(att => (
                  <tr key={att.id}>
                    <td style={{ fontWeight: 600 }}>{att.guardName}</td>
                    <td>{att.siteName}</td>
                    <td>{att.shiftType} Shift</td>
                    <td style={{ fontFamily: 'monospace' }}>{att.punchInTime}</td>
                    <td>
                      <span style={{ color: att.isInsideGeofence ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 600, fontSize: '12px' }}>
                        {att.isInsideGeofence ? `✓ Inside Geofence (${att.distanceFromSiteMeters}m)` : `⚠ Outside (${att.distanceFromSiteMeters}m)`}
                      </span>
                    </td>
                    <td><StatusBadge status={att.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Patrols */}
      {activeTab === 'patrols' && (
        <div className="table-container">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patrol #</th>
                  <th>Route Name</th>
                  <th>Assigned Guard</th>
                  <th>Scheduled Window</th>
                  <th>Compliance Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenantPatrols.map(pt => (
                  <tr key={pt.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                      {pt.patrolNumber}
                    </td>
                    <td style={{ fontWeight: 600 }}>{pt.routeName}</td>
                    <td>{pt.assignedGuardName}</td>
                    <td>{pt.scheduledTime}</td>
                    <td style={{ fontWeight: 700, color: 'var(--status-success)' }}>
                      {pt.complianceScorePercent}%
                    </td>
                    <td><StatusBadge status={pt.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Requests & Tickets */}
      {activeTab === 'requests' && (
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ fontSize: '14px', fontWeight: 700 }}>Service Requests & Tickets</div>
            <button className="btn btn-gold btn-sm" onClick={() => setIsRequestModalOpen(true)}>
              Raise New Request
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Subject</th>
                  <th>Facility</th>
                  <th>Priority</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenantComplaints.map(cmp => (
                  <tr key={cmp.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                      {cmp.complaintNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{cmp.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cmp.description}</div>
                    </td>
                    <td>{cmp.siteName}</td>
                    <td><StatusBadge status={cmp.priority} /></td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cmp.createdAt}</td>
                    <td><StatusBadge status={cmp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Invoices */}
      {activeTab === 'invoices' && (
        <div className="table-container">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Period</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Total Amount</th>
                  <th>Balance Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenantInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td>{inv.billingPeriod}</td>
                    <td>{inv.issueDate}</td>
                    <td>{inv.dueDate}</td>
                    <td style={{ fontWeight: 800 }}>₹{inv.totalAmount.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: inv.balanceDue > 0 ? 'var(--status-warning-fg)' : 'var(--status-success)' }}>
                      ₹{inv.balanceDue.toLocaleString()}
                    </td>
                    <td><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Raise Request Modal */}
      {isRequestModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsRequestModalOpen(false)}
          title="Submit Service Request / Extra Guards"
          subtitle="Direct ticket dispatch to Safe Guard Force Central Operations Room"
          size="md"
        >
          <form onSubmit={handleCreateTicket}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Facility / Site *</label>
              <select 
                className="form-control"
                value={ticketSiteId}
                onChange={e => setTicketSiteId(e.target.value)}
              >
                {tenantSites.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Request Title / Subject *</label>
              <input 
                type="text" 
                className="form-control" 
                required
                placeholder="e.g. Request 2 extra bouncers for corporate concert"
                value={ticketTitle}
                onChange={e => setTicketTitle(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Priority</label>
              <select 
                className="form-control"
                value={ticketPriority}
                onChange={e => setTicketPriority(e.target.value as any)}
              >
                <option value="High">High (Immediate event / replacement)</option>
                <option value="Medium">Medium (General schedule inquiry)</option>
                <option value="Low">Low (Administrative feedback)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Requirement Details *</label>
              <textarea 
                className="form-control" 
                rows={3}
                required
                placeholder="Specify dates, timings, post locations, and specific guard instructions..."
                value={ticketDesc}
                onChange={e => setTicketDesc(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsRequestModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Dispatch Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
