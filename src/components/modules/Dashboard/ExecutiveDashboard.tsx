import React, { useState } from 'react';
import { 
  Users, UserCheck, ShieldCheck, AlertOctagon, 
  Clock, MapPin, Receipt, Landmark, Wallet, 
  BarChart2, FileText, CheckCircle2, TrendingUp, 
  Calendar, Download, RefreshCw, AlertTriangle, Shield 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { StatCard } from '../../common/StatCard';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const ExecutiveDashboard: React.FC = () => {
  const { 
    kpis, t, setActiveModule, 
    guards, sites, incidents, sosAlerts, invoices, attendance, shifts, 
    addToast 
  } = useERP();

  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [drilldownKpi, setDrilldownKpi] = useState<string | null>(null);

  const handleExportSummary = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Safe Guard Force - Executive KPI Summary\n" +
      `Export Timestamp,${new Date().toISOString()}\n` +
      `Active Guards,${kpis.activeGuardsCount}\n` +
      `Required Strength,${kpis.requiredStrengthTotal}\n` +
      `Manpower Deployed Rate,${kpis.deployedPercentage}%\n` +
      `Unfilled Posts,${kpis.unfilledPostsCount}\n` +
      `Present Today,${kpis.presentCount}\n` +
      `Late Arrivals,${kpis.lateCount}\n` +
      `Active Client Sites,${kpis.activeSitesCount}\n` +
      `Open Incidents,${kpis.openIncidentsCount}\n` +
      `Patrol Compliance Rate,${kpis.patrolComplianceRate}%\n` +
      `Monthly Client Billing,INR ${kpis.monthlyBillingTotal}\n` +
      `Monthly Payroll Cost,INR ${kpis.monthlyPayrollTotal}\n` +
      `Outstanding Receivables,INR ${kpis.outstandingReceivablesTotal}\n` +
      `Overdue Invoices,INR ${kpis.overdueInvoicesTotal}\n` +
      `Estimated Gross Margin,${kpis.grossMarginPercent}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SGF_Executive_KPIs_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Export Successful', 'Executive KPI report downloaded in CSV format.');
  };

  return (
    <div>
      {/* Top Page Header & Filters */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Shield size={26} color="var(--brand-gold-400)" />
            {t('dashboard')}
          </h1>
          <p>
            Real-time operational command center across Pan-India sites and manpower deployments.
          </p>
        </div>

        <div className="page-actions-group">
          {/* Branch Filter */}
          <select 
            className="form-control"
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
            style={{ width: '180px', height: '38px', fontSize: '13px' }}
          >
            <option>All Branches</option>
            <option>Delhi NCR HQ</option>
            <option>Mumbai Operations</option>
            <option>Bengaluru Hub</option>
            <option>Hyderabad Cyberabad</option>
          </select>

          {/* Export Report */}
          <button className="btn btn-secondary" onClick={handleExportSummary}>
            <Download size={15} />
            <span>{t('exportCsv')}</span>
          </button>

          {/* Quick SOS Trigger button */}
          <button 
            className="btn btn-danger" 
            onClick={() => setActiveModule('sos')}
            title="Access Emergency SOS Console"
          >
            <AlertOctagon size={16} />
            <span>Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* Critical Active Alert Bar (if SOS or Critical Incidents exist) */}
      {(kpis.activeSOSCount > 0 || kpis.openIncidentsCount > 0) && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 18px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'inline-block',
              animation: 'pulse-subtle 1.5s infinite'
            }} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {kpis.activeSOSCount > 0 ? `🚨 ${kpis.activeSOSCount} Active Emergency SOS Alert Under Response!` : `⚠️ ${kpis.openIncidentsCount} Open Incidents Require Operations Review`}
            </span>
          </div>

          <button 
            className="btn btn-danger btn-sm"
            onClick={() => setActiveModule(kpis.activeSOSCount > 0 ? 'sos' : 'incidents')}
          >
            Inspect Active Alerts
          </button>
        </div>
      )}

      {/* Primary KPI Cards Grid (16 Real-time Metrics) */}
      <div className="kpi-grid">
        <StatCard
          title={t('activeGuards')}
          value={kpis.activeGuardsCount}
          subtitle={`Required: ${kpis.requiredStrengthTotal}`}
          icon={Users}
          variant="gold"
          trend={{ value: `${kpis.deployedPercentage}% deployed`, direction: 'up' }}
          onClick={() => setDrilldownKpi('guards')}
        />

        <StatCard
          title={t('unfilledPosts')}
          value={kpis.unfilledPostsCount}
          subtitle="Vacancies across sites"
          icon={AlertTriangle}
          variant={kpis.unfilledPostsCount > 0 ? 'amber' : 'green'}
          trend={{ value: kpis.unfilledPostsCount > 0 ? 'Shortage alert' : 'Fully staffed', direction: kpis.unfilledPostsCount > 0 ? 'down' : 'up' }}
          onClick={() => setDrilldownKpi('vacancies')}
        />

        <StatCard
          title={t('presentToday')}
          value={kpis.presentCount}
          subtitle={`${kpis.lateCount} late arrivals`}
          icon={UserCheck}
          variant="green"
          trend={{ value: '+4 vs yesterday', direction: 'up' }}
          onClick={() => setDrilldownKpi('attendance')}
        />

        <StatCard
          title={t('activeSites')}
          value={kpis.activeSitesCount}
          subtitle="All geofenced & monitored"
          icon={MapPin}
          variant="blue"
          trend={{ value: '100% active', direction: 'neutral' }}
          onClick={() => setActiveModule('sites')}
        />

        <StatCard
          title={t('patrolCompliance')}
          value={`${kpis.patrolComplianceRate}%`}
          subtitle="Real-time QR checkpoints"
          icon={ShieldCheck}
          variant={kpis.patrolComplianceRate > 85 ? 'green' : 'amber'}
          trend={{ value: '+3.2% this week', direction: 'up' }}
          onClick={() => setActiveModule('patrol')}
        />

        <StatCard
          title={t('openIncidents')}
          value={kpis.openIncidentsCount}
          subtitle="Under investigation"
          icon={AlertTriangle}
          variant={kpis.openIncidentsCount > 0 ? 'red' : 'green'}
          trend={{ value: '2 High severity', direction: 'down' }}
          onClick={() => setActiveModule('incidents')}
        />

        <StatCard
          title={t('monthlyBilling')}
          value={`₹${(kpis.monthlyBillingTotal / 100000).toFixed(1)}L`}
          subtitle={`₹${(kpis.collectionsTotal / 100000).toFixed(1)}L Collected`}
          icon={Receipt}
          variant="gold"
          trend={{ value: '+14% YoY', direction: 'up' }}
          onClick={() => setActiveModule('billing')}
        />

        <StatCard
          title={t('outstandingAR')}
          value={`₹${(kpis.outstandingReceivablesTotal / 100000).toFixed(1)}L`}
          subtitle={`₹${(kpis.overdueInvoicesTotal / 100000).toFixed(1)}L Overdue`}
          icon={Landmark}
          variant={kpis.overdueInvoicesTotal > 0 ? 'amber' : 'green'}
          trend={{ value: 'Ageing: 30-45d', direction: 'down' }}
          onClick={() => setActiveModule('collections')}
        />
      </div>

      {/* Analytics Visual Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Manpower Deployed vs Required by Site */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Users size={18} color="var(--brand-gold-400)" />
              Manpower Deployment vs Contracted Strength
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Site-wise Status</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sites.map(s => {
              const pct = Math.round((s.assignedGuardsCount / (s.requiredStrength || 1)) * 100);
              const isShortage = s.assignedGuardsCount < s.requiredStrength;

              return (
                <div key={s.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                    <span style={{ color: isShortage ? 'var(--status-warning-fg)' : 'var(--text-muted)' }}>
                      {s.assignedGuardsCount} / {s.requiredStrength} Guards ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '7px', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${Math.min(100, pct)}%`, 
                        background: isShortage ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Flow: Monthly Billing vs Collections vs Payroll */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <TrendingUp size={18} color="var(--status-success)" />
              Financial Velocity & Gross Margin
            </span>
            <span className="badge badge-success">Est. Margin: {kpis.grossMarginPercent}%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '10px 0' }}>
            {/* Total Billing */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>Gross Client Invoicing (Billed)</span>
                <span style={{ fontWeight: 700 }}>₹{kpis.monthlyBillingTotal.toLocaleString()}</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-hover)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '100%', background: 'var(--brand-gold-400)', borderRadius: '5px' }} />
              </div>
            </div>

            {/* Total Collections */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>Realized Collections (Paid)</span>
                <span style={{ fontWeight: 700, color: 'var(--status-success)' }}>₹{kpis.collectionsTotal.toLocaleString()}</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-hover)', borderRadius: '5px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${Math.round((kpis.collectionsTotal / (kpis.monthlyBillingTotal || 1)) * 100)}%`, 
                    background: 'var(--status-success)', 
                    borderRadius: '5px' 
                  }} 
                />
              </div>
            </div>

            {/* Total Net Payroll */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>Net Workforce Payroll Cost</span>
                <span style={{ fontWeight: 700, color: 'var(--status-info)' }}>₹{kpis.monthlyPayrollTotal.toLocaleString()}</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-hover)', borderRadius: '5px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${Math.round((kpis.monthlyPayrollTotal / (kpis.monthlyBillingTotal || 1)) * 100)}%`, 
                    background: 'var(--status-info)', 
                    borderRadius: '5px' 
                  }} 
                />
              </div>
            </div>

            {/* Ageing receivables bucket strip */}
            <div style={{
              marginTop: '10px',
              padding: '12px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current (0-30d)</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--status-success)' }}>₹5.1L</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>31-60 Days</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-gold-400)' }}>₹2.3L</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>90+ Days (Overdue)</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--status-danger)' }}>₹1.3L</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Highlights Table Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Live Attendance Activity */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <Clock size={18} color="var(--brand-gold-400)" />
              Recent GPS Punch Activity
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveModule('attendance')}>
              View Live Stream
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guard</th>
                  <th>Site</th>
                  <th>Punch Time</th>
                  <th>Geofence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.slice(0, 4).map(att => (
                  <tr key={att.id}>
                    <td style={{ fontWeight: 600 }}>{att.guardName}</td>
                    <td>{att.siteName.split('-')[0]}</td>
                    <td>{att.punchInTime}</td>
                    <td>
                      {att.isInsideGeofence ? (
                        <span style={{ color: 'var(--status-success)', fontSize: '12px', fontWeight: 600 }}>
                          ✓ Inside ({att.distanceFromSiteMeters}m)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--status-danger)', fontSize: '12px', fontWeight: 600 }}>
                          ⚠ {att.distanceFromSiteMeters}m Outside
                        </span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={att.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Incidents & Patrol Compliance */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <AlertTriangle size={18} color="var(--status-danger)" />
              Security Incidents Requiring Attention
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveModule('incidents')}>
              Incident Log
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {incidents.slice(0, 3).map(inc => (
              <div 
                key={inc.id}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <StatusBadge status={inc.severity} />
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{inc.incidentNumber}: {inc.category}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {inc.siteName} • {inc.timestamp}
                  </div>
                </div>
                <StatusBadge status={inc.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Drilldown Modal */}
      <Modal
        isOpen={drilldownKpi !== null}
        onClose={() => setDrilldownKpi(null)}
        title={drilldownKpi === 'guards' ? 'Active Guards Roster Drilldown' : drilldownKpi === 'vacancies' ? 'Unfilled Posts & Vacancies' : 'Live Attendance Records'}
        size="lg"
      >
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {drilldownKpi === 'guards' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Assigned Site</th>
                  <th>KYC</th>
                  <th>Police Verif.</th>
                </tr>
              </thead>
              <tbody>
                {guards.map(g => (
                  <tr key={g.id}>
                    <td>{g.guardIdNumber}</td>
                    <td style={{ fontWeight: 600 }}>{g.name}</td>
                    <td>{g.category}</td>
                    <td>{g.currentSiteName || 'Relief Reserve'}</td>
                    <td><StatusBadge status={g.kycStatus} /></td>
                    <td><StatusBadge status={g.policeVerificationStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {drilldownKpi === 'vacancies' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                The following shifts have detected vacancies or uncovered contractual guard strength:
              </p>
              {shifts.filter(s => s.status === 'Shortage').map(s => (
                <div key={s.id} style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>{s.siteName} — {s.shiftType} Shift ({s.timing})</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--status-warning-fg)', marginTop: '4px' }}>
                    Required: {s.requiredGuards} guards | Assigned: {s.assignedGuardIds.length} guards (Shortage of {s.requiredGuards - s.assignedGuardIds.length})
                  </div>
                  <button 
                    className="btn btn-gold btn-sm" 
                    style={{ marginTop: '10px' }}
                    onClick={() => {
                      setDrilldownKpi(null);
                      setActiveModule('deployments');
                    }}
                  >
                    Open Roster & Assign Reliever
                  </button>
                </div>
              ))}
            </div>
          )}

          {drilldownKpi === 'attendance' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guard</th>
                  <th>Site</th>
                  <th>Time</th>
                  <th>Geofence Distance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.guardName}</td>
                    <td>{a.siteName}</td>
                    <td>{a.punchInTime}</td>
                    <td>{a.distanceFromSiteMeters}m ({a.isInsideGeofence ? 'Inside' : 'Outside'})</td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Modal>
    </div>
  );
};
