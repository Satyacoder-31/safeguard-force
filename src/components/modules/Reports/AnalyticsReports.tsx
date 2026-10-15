import React, { useState } from 'react';
import { 
  BarChart3, Download, Printer, Filter, 
  Calendar, FileSpreadsheet, Users, Shield, Receipt, Landmark 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { StatusBadge } from '../../common/StatusBadge';

export const AnalyticsReports: React.FC = () => {
  const { 
    guards, sites, attendance, incidents, 
    invoices, payments, kpis, t, addToast 
  } = useERP();

  const [activeReport, setActiveReport] = useState<'deployment' | 'incidents' | 'financial' | 'attendance'>('deployment');

  const handleExportReportCSV = () => {
    let headers = "";
    let rows = "";
    let filename = `SGF_${activeReport.toUpperCase()}_Report_${new Date().toISOString().substring(0, 10)}.csv`;

    if (activeReport === 'deployment') {
      headers = "Site Name,Client,City,Required Guards,Assigned Guards,Coverage Rate,Status\n";
      rows = sites.map(s => 
        `"${s.name}","${s.clientName}","${s.city}","${s.requiredStrength}","${s.assignedGuardsCount}","${Math.round((s.assignedGuardsCount / s.requiredStrength) * 100)}%","${s.status}"`
      ).join("\n");
    } else if (activeReport === 'incidents') {
      headers = "Incident #,Site,Severity,Category,Title,Date,Status,Investigator\n";
      rows = incidents.map(i => 
        `"${i.incidentNumber}","${i.siteName}","${i.severity}","${i.category}","${i.title}","${i.timestamp}","${i.status}","${i.investigator || 'N/A'}"`
      ).join("\n");
    } else if (activeReport === 'financial') {
      headers = "Invoice #,Client,Billing Period,Subtotal,Taxable Total,Balance Due,Status\n";
      rows = invoices.map(inv => 
        `"${inv.invoiceNumber}","${inv.clientName}","${inv.billingPeriod}","${inv.subtotal}","${inv.totalAmount}","${inv.balanceDue}","${inv.status}"`
      ).join("\n");
    } else {
      headers = "Guard Name,Site,Date,Shift,Punch In,Punch Out,Geofence Distance,Status\n";
      rows = attendance.map(a => 
        `"${a.guardName}","${a.siteName}","${a.date}","${a.shiftType}","${a.punchInTime}","${a.punchOutTime || 'On Duty'}","${a.distanceFromSiteMeters}m","${a.status}"`
      ).join("\n");
    }

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    addToast('success', 'Report Exported', `${filename} generated and downloaded.`);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <BarChart3 size={26} color="var(--brand-gold-400)" />
            {t('reports')}
          </h1>
          <p>
            Central intelligence suite for workforce deployment analytics, security compliance, financial registers, and SLA reports.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <button className="btn btn-gold" onClick={handleExportReportCSV}>
            <Download size={15} />
            <span>Export to CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeReport === 'deployment' ? 'active' : ''}`}
          onClick={() => setActiveReport('deployment')}
        >
          Manpower Deployment Summary
        </button>
        <button 
          className={`tab-btn ${activeReport === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveReport('attendance')}
        >
          GPS Attendance & Geofence Exceptions
        </button>
        <button 
          className={`tab-btn ${activeReport === 'incidents' ? 'active' : ''}`}
          onClick={() => setActiveReport('incidents')}
        >
          Incidents & Security Audit
        </button>
        <button 
          className={`tab-btn ${activeReport === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveReport('financial')}
        >
          Financial Billing & AR Ledger
        </button>
      </div>

      {/* Report 1: Deployment */}
      {activeReport === 'deployment' && (
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              Facility Guard Deployment & Vacancy Summary
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Overall Deployment Rate: <strong>{kpis.deployedPercentage}%</strong>
            </div>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guarded Facility</th>
                  <th>Client Entity</th>
                  <th>City</th>
                  <th>Required Strength</th>
                  <th>Assigned Personnel</th>
                  <th>Fulfillment Rate</th>
                  <th>Post Vacancies</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sites.map(s => {
                  const pct = Math.round((s.assignedGuardsCount / s.requiredStrength) * 100);
                  const vac = Math.max(0, s.requiredStrength - s.assignedGuardsCount);

                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700 }}>{s.name}</td>
                      <td>{s.clientName}</td>
                      <td>{s.city}</td>
                      <td style={{ fontWeight: 600 }}>{s.requiredStrength} Guards</td>
                      <td style={{ fontWeight: 600 }}>{s.assignedGuardsCount} Guards</td>
                      <td>
                        <span style={{ fontWeight: 700, color: pct >= 100 ? 'var(--status-success)' : 'var(--status-warning-fg)' }}>
                          {pct}%
                        </span>
                      </td>
                      <td style={{ color: vac > 0 ? 'var(--status-danger)' : 'var(--status-success)', fontWeight: vac > 0 ? 700 : 400 }}>
                        {vac > 0 ? `${vac} Vacant Posts` : '0 (Fully Staffed)'}
                      </td>
                      <td><StatusBadge status={s.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 2: Attendance */}
      {activeReport === 'attendance' && (
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              Biometric & GPS Workforce Monitoring Logs
            </div>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guard Personnel</th>
                  <th>Assigned Site</th>
                  <th>Shift & Date</th>
                  <th>Punch In</th>
                  <th>Clock Out</th>
                  <th>Geofence Distance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.guardName}</td>
                    <td>{a.siteName}</td>
                    <td>{a.shiftType} • {a.date}</td>
                    <td style={{ fontFamily: 'monospace' }}>{a.punchInTime}</td>
                    <td style={{ fontSize: '12px', color: a.punchOutTime ? 'inherit' : 'var(--status-info)' }}>
                      {a.punchOutTime || 'On Post'}
                    </td>
                    <td>
                      <span style={{ color: a.isInsideGeofence ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 600 }}>
                        {a.distanceFromSiteMeters}m ({a.isInsideGeofence ? 'Inside' : 'Outside Exception'})
                      </span>
                    </td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3: Incidents */}
      {activeReport === 'incidents' && (
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              Security Incidents & CAPA Resolutions
            </div>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Incident #</th>
                  <th>Facility</th>
                  <th>Severity</th>
                  <th>Category</th>
                  <th>Incident Title</th>
                  <th>Reported Date</th>
                  <th>Workflow Status</th>
                  <th>Investigator</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(inc => (
                  <tr key={inc.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>{inc.incidentNumber}</td>
                    <td>{inc.siteName}</td>
                    <td><StatusBadge status={inc.severity} /></td>
                    <td>{inc.category}</td>
                    <td style={{ fontWeight: 600 }}>{inc.title}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inc.timestamp}</td>
                    <td><StatusBadge status={inc.status} /></td>
                    <td>{inc.investigator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 4: Financial */}
      {activeReport === 'financial' && (
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              Client Invoicing & Accounts Receivable Ledger
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Gross Billed: <strong>₹{kpis.monthlyBillingTotal.toLocaleString()}</strong> | Collected: <strong>₹{kpis.collectionsTotal.toLocaleString()}</strong>
            </div>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Billing Period</th>
                  <th>Subtotal</th>
                  <th>CGST + SGST (18%)</th>
                  <th>Total Billed</th>
                  <th>Realized</th>
                  <th>Balance Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>{inv.invoiceNumber}</td>
                    <td style={{ fontWeight: 600 }}>{inv.clientName}</td>
                    <td>{inv.billingPeriod}</td>
                    <td>₹{inv.subtotal.toLocaleString()}</td>
                    <td>₹{(inv.cgst + inv.sgst).toLocaleString()}</td>
                    <td style={{ fontWeight: 800 }}>₹{inv.totalAmount.toLocaleString()}</td>
                    <td style={{ color: 'var(--status-success)', fontWeight: 600 }}>₹{inv.paidAmount.toLocaleString()}</td>
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
    </div>
  );
};
