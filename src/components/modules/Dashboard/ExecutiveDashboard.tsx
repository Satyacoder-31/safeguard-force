import React, { useState } from 'react';
import { 
  Users, UserCheck, ShieldCheck, AlertOctagon, 
  Clock, MapPin, Receipt, Landmark, Wallet, 
  BarChart2, FileText, CheckCircle2, TrendingUp, 
  Calendar, Download, RefreshCw, AlertTriangle, Shield,
  ChevronRight, CheckCircle, Navigation, GitFork, 
  ArrowRight, ChevronDown, Eye
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const ExecutiveDashboard: React.FC = () => {
  const { 
    kpis, t, setActiveModule, 
    guards, sites, incidents, sosAlerts, invoices, attendance, shifts, 
    addToast 
  } = useERP();

  // Interactive chart state
  const [hoveredAttendanceDay, setHoveredAttendanceDay] = useState<number | null>(null);
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [showAttendanceTable, setShowAttendanceTable] = useState(false);
  const [showBillingTable, setShowBillingTable] = useState(false);
  const [activeOpsTab, setActiveOpsTab] = useState<'deployments' | 'incidents' | 'kpis'>('deployments');

  // Attendance 14-days data matching reference spec
  const attendance14Days = [
    { label: '3 Oct', fullDate: '3 Oct 2026 (Fri)', pct: 94, rostered: 152, present: 143, absent: 9, status: 'Completed' },
    { label: '4 Oct', fullDate: '4 Oct 2026 (Sat)', pct: 92, rostered: 152, present: 140, absent: 12, status: 'Completed' },
    { label: '5 Oct', fullDate: '5 Oct 2026 (Sun)', pct: 90, rostered: 152, present: 137, absent: 15, status: 'Completed' },
    { label: '6 Oct', fullDate: '6 Oct 2026 (Mon)', pct: 62, rostered: 152, present: 94, absent: 58, status: 'Shift Transition' },
    { label: '7 Oct', fullDate: '7 Oct 2026 (Tue)', pct: 0, rostered: 152, present: 0, absent: 0, status: 'Scheduled Duty' },
    { label: '8 Oct', fullDate: '8 Oct 2026 (Wed)', pct: 0, rostered: 152, present: 0, absent: 0, status: 'Scheduled Duty' },
    { label: '9 Oct', fullDate: '9 Oct 2026 (Thu)', pct: 0, rostered: 152, present: 0, absent: 0, status: 'Scheduled Duty' },
    { label: '10 Oct', fullDate: '10 Oct 2026 (Fri)', pct: 0, rostered: 152, present: 0, absent: 0, status: 'Scheduled Duty' },
    { label: '11 Oct', fullDate: '11 Oct 2026 (Sat)', pct: 0, rostered: 152, present: 0, absent: 0, status: 'Scheduled Duty' },
    { label: '12 Oct', fullDate: '12 Oct 2026 (Sun)', pct: 0, rostered: 152, present: 0, absent: 0, status: 'Scheduled Duty' },
    { label: '13 Oct', fullDate: '13 Oct 2026 (Mon)', pct: 0, rostered: 152, present: 0, absent: 0, status: 'Scheduled Duty' },
    { label: '14 Oct', fullDate: '14 Oct 2026 (Tue)', pct: 0, rostered: 152, present: 0, absent: 0, status: 'Scheduled Duty' },
    { label: '15 Oct', fullDate: '15 Oct 2026 (Wed)', pct: 0, rostered: 152, present: 0, absent: 0, status: 'Scheduled Duty' },
    { label: 'Today', fullDate: 'Today (Live Shift)', pct: 0, rostered: 152, present: 0, absent: 0, status: 'In Progress' }
  ];

  // Financial 6-months billed vs collected data matching reference spec
  const financial6Months = [
    { month: 'May', fullName: 'May 2026', billed: 0, collected: 0, outstanding: 0, rate: 0, invoicesCount: 0 },
    { month: 'Jun', fullName: 'June 2026', billed: 0, collected: 0, outstanding: 0, rate: 0, invoicesCount: 0 },
    { month: 'Jul', fullName: 'July 2026', billed: 0, collected: 0, outstanding: 0, rate: 0, invoicesCount: 0 },
    { month: 'Aug', fullName: 'August 2026', billed: 0, collected: 0, outstanding: 0, rate: 0, invoicesCount: 0 },
    { month: 'Sep', fullName: 'September 2026', billed: 0, collected: 0, outstanding: 0, rate: 0, invoicesCount: 0 },
    { month: 'Oct', fullName: 'October 2026 (Current)', billed: 4005783, collected: 524337.12, outstanding: 3481445.88, rate: 13.1, invoicesCount: 18 }
  ];

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
    <div className="sgf-reference-dashboard">
      {/* ROW 1: Top Metrics Grid (4 Cards matching reference screenshot) */}
      <div className="sgf-top-metrics-grid">
        {/* Card 1: Filled Strength */}
        <div className="sgf-top-card">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              248
            </span>
            <span style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-muted)' }}>
              / 272
            </span>
          </div>

          <div className="sgf-progress-track">
            <div className="sgf-progress-fill-orange" style={{ width: '91.2%' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
              91.2% filled
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              25 sites short
            </span>
          </div>
        </div>

        {/* Card 2: Alerts Status */}
        <div className="sgf-top-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block',
              boxShadow: '0 0 6px #10b981'
            }} />
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#10b981' }}>
              No open alerts
            </span>
          </div>
        </div>

        {/* Card 3: Attendance Quick Summary */}
        <div className="sgf-top-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <div>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '16px', marginRight: '6px' }}>0</span>
              marked absent
            </div>
            <div>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '16px', marginRight: '6px' }}>0</span>
              not checked in
            </div>
          </div>
        </div>

        {/* Card 4: Incidents Breakdown Badge Row */}
        <div className="sgf-top-card">
          <div className="sgf-incident-pills-row">
            <span className="sgf-pill gray">Critical 0</span>
            <span className="sgf-pill orange">High 2</span>
            <span className="sgf-pill blue">Medium 1</span>
            <span className="sgf-pill gray">Low 1</span>
          </div>
        </div>
      </div>

      {/* ROW 2: Actionable Metric Cards (3 Columns matching reference screenshot) */}
      <div className="sgf-action-cards-grid">
        {/* Action Card 1: Missed patrols today */}
        <div className="sgf-action-card" onClick={() => setActiveModule('patrol')}>
          <div className="sgf-action-card-header">
            <div className="sgf-icon-box purple">
              <GitFork size={18} />
            </div>
            <ChevronRight size={16} className="sgf-action-arrow" />
          </div>

          <div className="sgf-action-card-title">Missed patrols today</div>
          <div className="sgf-action-card-value" style={{ margin: '4px 0 6px' }}>0</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No rounds due yet today</div>
        </div>

        {/* Action Card 2: Billed vs collected · Oct 2026 */}
        <div className="sgf-action-card" onClick={() => setActiveModule('billing')}>
          <div className="sgf-action-card-header">
            <div className="sgf-icon-box cyan">
              <Landmark size={18} />
            </div>
            <ChevronRight size={16} className="sgf-action-arrow" />
          </div>

          <div className="sgf-action-card-title">Billed vs collected · Oct 2026</div>
          <div className="sgf-action-card-value" style={{ margin: '4px 0 6px' }}>₹5,24,337.12</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            of ₹40,05,783.00 billed · 13.1%
          </div>

          <div className="sgf-progress-track" style={{ margin: '10px 0 8px' }}>
            <div className="sgf-progress-fill-green" style={{ width: '13.1%' }} />
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Outstanding <strong style={{ color: 'var(--text-secondary)' }}>₹34,90,839.00</strong>
          </div>
        </div>

        {/* Action Card 3: Contracts expiring in 30 days */}
        <div className="sgf-action-card" onClick={() => setActiveModule('contracts')}>
          <div className="sgf-action-card-header">
            <div className="sgf-icon-box amber">
              <FileText size={18} />
            </div>
            <ChevronRight size={16} className="sgf-action-arrow" />
          </div>

          <div className="sgf-action-card-title">Contracts expiring in 30 days</div>
          <div className="sgf-action-card-value" style={{ margin: '4px 0 10px' }}>4</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 600 }}>Delhi Public Academy</span>
              <span style={{ color: 'var(--text-muted)' }}>17-10-2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 600 }}>The Orchid Residency Hotel</span>
              <span style={{ color: 'var(--text-muted)' }}>23-10-2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 600 }}>Raghav Retail Ventures Pvt Ltd</span>
              <span style={{ color: 'var(--text-muted)' }}>26-10-2026</span>
            </div>
            <div style={{ color: 'var(--brand-gold-500)', fontWeight: 600, marginTop: '2px' }}>
              +1 more
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Bar Charts Grid (2 Columns matching reference screenshot) */}
      <div className="sgf-charts-grid">
        {/* CHART 1: Attendance — last 14 days */}
        <div className="sgf-chart-card">
          <div className="sgf-chart-card-header">
            <div>
              <div className="sgf-chart-title">Attendance — last 14 days</div>
              <div className="sgf-chart-subtitle">Present as a share of rostered duties per day (IST)</div>
            </div>
            <div className="sgf-chart-helper">Hover a bar for details</div>
          </div>

          {/* SVG Bar Chart Plot */}
          <div className="sgf-chart-canvas-wrap">
            <svg 
              className="sgf-svg-chart" 
              viewBox="0 0 540 190" 
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Horizontal Grid lines */}
              <line x1="45" y1="20" x2="520" y2="20" className="sgf-grid-line" />
              <line x1="45" y1="90" x2="520" y2="90" className="sgf-grid-line" />
              <line x1="45" y1="160" x2="520" y2="160" className="sgf-grid-line" />

              {/* Y-Axis Labels */}
              <text x="35" y="24" textAnchor="end" className="sgf-axis-text">100%</text>
              <text x="35" y="94" textAnchor="end" className="sgf-axis-text">50%</text>
              <text x="35" y="164" textAnchor="end" className="sgf-axis-text">0%</text>

              {/* 14 Bars */}
              {attendance14Days.map((item, idx) => {
                const barWidth = 18;
                const slotWidth = (520 - 55) / 14;
                const barX = 55 + idx * slotWidth + (slotWidth - barWidth) / 2;
                const maxBarHeight = 140; // from y=20 to y=160
                const barHeight = Math.max(3, (item.pct / 100) * maxBarHeight);
                const barY = 160 - barHeight;
                const isHovered = hoveredAttendanceDay === idx;

                // Alternate display of day labels on x axis to avoid crowding
                const showLabel = idx % 2 === 0 || idx === 13;

                return (
                  <g 
                    key={item.label}
                    onMouseEnter={() => setHoveredAttendanceDay(idx)}
                    onMouseLeave={() => setHoveredAttendanceDay(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Hover hotspot column */}
                    <rect 
                      x={55 + idx * slotWidth} 
                      y="10" 
                      width={slotWidth} 
                      height="160" 
                      fill="transparent" 
                    />

                    {/* Bar */}
                    <rect 
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      rx="3"
                      ry="3"
                      fill={isHovered ? '#f59e0b' : (item.pct > 0 ? '#1e293b' : '#94a3b8')}
                      opacity={item.pct > 0 ? 1 : 0.4}
                      className="sgf-bar-rect"
                    />

                    {/* X-axis Label */}
                    {showLabel && (
                      <text 
                        x={barX + barWidth / 2} 
                        y="180" 
                        textAnchor="middle" 
                        className="sgf-axis-text"
                        style={{ fontWeight: idx === 13 ? 700 : 400 }}
                      >
                        {item.label}
                      </text>
                    )}

                    {/* Interactive Hover Tooltip */}
                    {isHovered && (
                      <g>
                        <rect 
                          x={Math.min(420, Math.max(50, barX - 60))}
                          y={Math.max(10, barY - 48)}
                          width="140"
                          height="44"
                          rx="6"
                          ry="6"
                          fill="#0f172a"
                          stroke="#d97706"
                          strokeWidth="1"
                          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                        />
                        <text 
                          x={Math.min(420, Math.max(50, barX - 60)) + 70} 
                          y={Math.max(10, barY - 48) + 16}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="11px"
                          fontWeight="700"
                        >
                          {item.fullDate}
                        </text>
                        <text 
                          x={Math.min(420, Math.max(50, barX - 60)) + 70} 
                          y={Math.max(10, barY - 48) + 32}
                          textAnchor="middle"
                          fill="#fbbf24"
                          fontSize="10.5px"
                          fontWeight="600"
                        >
                          {item.pct > 0 ? `${item.pct}% (${item.present}/${item.rostered})` : 'No Rostered Duties'}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Show as table button */}
          <button 
            type="button" 
            className="sgf-table-toggle-btn"
            onClick={() => setShowAttendanceTable(!showAttendanceTable)}
          >
            {showAttendanceTable ? '▼ Hide table' : '▶ Show as table'}
          </button>

          {/* Expanded Table Breakdown */}
          {showAttendanceTable && (
            <div className="sgf-chart-table-wrap">
              <table className="sgf-chart-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Rostered</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance14Days.map(d => (
                    <tr key={d.label}>
                      <td style={{ fontWeight: 600 }}>{d.fullDate}</td>
                      <td>{d.rostered}</td>
                      <td style={{ fontWeight: 700, color: d.present > 0 ? 'var(--status-success)' : 'inherit' }}>
                        {d.present}
                      </td>
                      <td style={{ color: d.absent > 0 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                        {d.absent}
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {d.pct > 0 ? `${d.pct}%` : '—'}
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CHART 2: Billed vs collected — last 6 months */}
        <div className="sgf-chart-card">
          <div className="sgf-chart-card-header">
            <div>
              <div className="sgf-chart-title">Billed vs collected — last 6 months</div>
              <div className="sgf-chart-subtitle">Invoices issued vs payments received per month</div>
            </div>
            <div className="sgf-chart-helper">Hover a month for details</div>
          </div>

          {/* Legend */}
          <div className="sgf-chart-legend">
            <div className="sgf-legend-item">
              <span className="sgf-legend-box billed" />
              <span>Billed</span>
            </div>
            <div className="sgf-legend-item">
              <span className="sgf-legend-box collected" />
              <span>Collected</span>
            </div>
          </div>

          {/* SVG Grouped Bar Chart Plot */}
          <div className="sgf-chart-canvas-wrap">
            <svg 
              className="sgf-svg-chart" 
              viewBox="0 0 540 190" 
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Horizontal Grid lines */}
              <line x1="50" y1="20" x2="520" y2="20" className="sgf-grid-line" />
              <line x1="50" y1="90" x2="520" y2="90" className="sgf-grid-line" />
              <line x1="50" y1="160" x2="520" y2="160" className="sgf-grid-line" />

              {/* Y-Axis Labels */}
              <text x="40" y="24" textAnchor="end" className="sgf-axis-text">₹50 L</text>
              <text x="40" y="94" textAnchor="end" className="sgf-axis-text">₹25 L</text>
              <text x="40" y="164" textAnchor="end" className="sgf-axis-text">₹0</text>

              {/* 6 Months Dual Bars */}
              {financial6Months.map((m, idx) => {
                const maxVal = 5000000; // 50 Lakhs
                const maxBarHeight = 140; // from y=20 to y=160
                const slotWidth = (520 - 60) / 6;
                const slotX = 60 + idx * slotWidth;
                const barWidth = 14;

                const billedHeight = Math.max(2, (m.billed / maxVal) * maxBarHeight);
                const billedY = 160 - billedHeight;

                const collectedHeight = Math.max(2, (m.collected / maxVal) * maxBarHeight);
                const collectedY = 160 - collectedHeight;

                const isHovered = hoveredMonthIndex === idx;

                return (
                  <g 
                    key={m.month}
                    onMouseEnter={() => setHoveredMonthIndex(idx)}
                    onMouseLeave={() => setHoveredMonthIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Hotspot */}
                    <rect 
                      x={slotX} 
                      y="10" 
                      width={slotWidth} 
                      height="160" 
                      fill="transparent" 
                    />

                    {/* Billed Bar (Blue) */}
                    <rect 
                      x={slotX + slotWidth / 2 - barWidth - 2}
                      y={billedY}
                      width={barWidth}
                      height={billedHeight}
                      rx="3"
                      ry="3"
                      fill="#2563eb"
                      className="sgf-bar-rect"
                    />

                    {/* Collected Bar (Orange) */}
                    <rect 
                      x={slotX + slotWidth / 2 + 2}
                      y={collectedY}
                      width={barWidth}
                      height={collectedHeight}
                      rx="3"
                      ry="3"
                      fill="#ea580c"
                      className="sgf-bar-rect"
                    />

                    {/* Month Label */}
                    <text 
                      x={slotX + slotWidth / 2} 
                      y="180" 
                      textAnchor="middle" 
                      className="sgf-axis-text"
                      style={{ fontWeight: idx === 5 ? 700 : 400 }}
                    >
                      {m.month}
                    </text>

                    {/* Hover Tooltip */}
                    {isHovered && (
                      <g>
                        <rect 
                          x={Math.min(380, Math.max(60, slotX - 40))}
                          y={Math.max(10, Math.min(billedY, collectedY) - 58)}
                          width="160"
                          height="52"
                          rx="6"
                          ry="6"
                          fill="#0f172a"
                          stroke="#38bdf8"
                          strokeWidth="1"
                          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                        />
                        <text 
                          x={Math.min(380, Math.max(60, slotX - 40)) + 80} 
                          y={Math.max(10, Math.min(billedY, collectedY) - 58) + 16}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="11px"
                          fontWeight="700"
                        >
                          {m.fullName}
                        </text>
                        <text 
                          x={Math.min(380, Math.max(60, slotX - 40)) + 80} 
                          y={Math.max(10, Math.min(billedY, collectedY) - 58) + 30}
                          textAnchor="middle"
                          fill="#60a5fa"
                          fontSize="10px"
                          fontWeight="600"
                        >
                          Billed: ₹{m.billed.toLocaleString()}
                        </text>
                        <text 
                          x={Math.min(380, Math.max(60, slotX - 40)) + 80} 
                          y={Math.max(10, Math.min(billedY, collectedY) - 58) + 44}
                          textAnchor="middle"
                          fill="#fb923c"
                          fontSize="10px"
                          fontWeight="600"
                        >
                          Collected: ₹{m.collected.toLocaleString()} ({m.rate}%)
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Show as table button */}
          <button 
            type="button" 
            className="sgf-table-toggle-btn"
            onClick={() => setShowBillingTable(!showBillingTable)}
          >
            {showBillingTable ? '▼ Hide table' : '▶ Show as table'}
          </button>

          {/* Expanded Table Breakdown */}
          {showBillingTable && (
            <div className="sgf-chart-table-wrap">
              <table className="sgf-chart-table">
                <thead>
                  <tr>
                    <th>Billing Month</th>
                    <th>Invoices Raised</th>
                    <th>Total Billed (₹)</th>
                    <th>Total Collected (₹)</th>
                    <th>Outstanding Due (₹)</th>
                    <th>Collection Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {financial6Months.map(m => (
                    <tr key={m.month}>
                      <td style={{ fontWeight: 600 }}>{m.fullName}</td>
                      <td>{m.invoicesCount}</td>
                      <td style={{ fontWeight: 700 }}>
                        {m.billed > 0 ? `₹${m.billed.toLocaleString()}` : '—'}
                      </td>
                      <td style={{ fontWeight: 700, color: m.collected > 0 ? 'var(--status-success)' : 'inherit' }}>
                        {m.collected > 0 ? `₹${m.collected.toLocaleString()}` : '—'}
                      </td>
                      <td style={{ color: m.outstanding > 0 ? 'var(--status-warning-fg)' : 'var(--text-muted)' }}>
                        {m.outstanding > 0 ? `₹${m.outstanding.toLocaleString()}` : '—'}
                      </td>
                      <td>
                        {m.rate > 0 ? (
                          <span className="badge badge-success">{m.rate}%</span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ROW 4: Operations Command Section (Deployment Strength & Quick Log) */}
      <div className="card" style={{ marginTop: '10px' }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '16px' }}>
          <div>
            <span className="card-title" style={{ fontSize: '16px', fontWeight: 700 }}>
              <Shield size={18} color="var(--brand-gold-400)" />
              Pan-India Site Deployments & Manpower Fulfillment
            </span>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Real-time post coverage across Delhi NCR, Mumbai, Bengaluru, and Hyderabad branches
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleExportSummary}>
              <Download size={13} />
              <span>Export CSV</span>
            </button>
            <button className="btn btn-gold btn-sm" onClick={() => setActiveModule('deployments')}>
              <span>Open Deployment Planner</span>
            </button>
          </div>
        </div>

        {/* Site Deployment Progress Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {sites.map(s => {
            const pct = Math.round((s.assignedGuardsCount / (s.requiredStrength || 1)) * 100);
            const isShortage = s.assignedGuardsCount < s.requiredStrength;

            return (
              <div 
                key={s.id} 
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{s.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.clientName} • {s.city}</div>
                  </div>
                  <span className={`badge ${isShortage ? 'badge-warning' : 'badge-success'}`}>
                    {s.assignedGuardsCount} / {s.requiredStrength}
                  </span>
                </div>

                <div className="sgf-progress-track" style={{ margin: '8px 0 4px' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${Math.min(100, pct)}%`, 
                      background: isShortage ? '#ea580c' : '#10b981',
                      borderRadius: '9999px' 
                    }} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>{pct}% deployed</span>
                  <span style={{ color: isShortage ? 'var(--status-warning-fg)' : 'var(--status-success)' }}>
                    {isShortage ? `${s.requiredStrength - s.assignedGuardsCount} guards shortage` : '✓ Fully deployed'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
