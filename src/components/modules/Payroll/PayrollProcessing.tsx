import React, { useState } from 'react';
import { 
  Wallet, Calculator, CheckCircle, Download, 
  Printer, Eye, Lock, FileSpreadsheet, Shield 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { PayrollRun, PayslipItem } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const PayrollProcessing: React.FC = () => {
  const { 
    payrollRuns, generateCurrentMonthPayroll, 
    approvePayrollRun, t, addToast 
  } = useERP();

  const [selectedRunId, setSelectedRunId] = useState<string>(payrollRuns[0]?.id || '');
  const selectedRun = payrollRuns.find(r => r.id === selectedRunId) || payrollRuns[0];
  const [viewingPayslip, setViewingPayslip] = useState<PayslipItem | null>(null);

  const handleCalculatePayroll = () => {
    generateCurrentMonthPayroll();
    setSelectedRunId('pay-2026-10');
  };

  const handlePrintPayslip = () => {
    window.print();
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Wallet size={26} color="var(--brand-gold-400)" />
            {t('payroll')}
          </h1>
          <p>
            Attendance-linked wage calculations, statutory PF (12%) & ESIC (0.75%) deductions, and corporate payslips.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-secondary" onClick={() => handlePrintPayslip()}>
            <Printer size={15} />
            <span>Print Current Register</span>
          </button>
          <button className="btn btn-gold" onClick={handleCalculatePayroll}>
            <Calculator size={16} />
            <span>Process October 2026 Payroll</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards for Payroll Run */}
      {selectedRun && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--brand-gold-400)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Payroll Month
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
              {selectedRun.periodMonth}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Status: <strong style={{ color: 'var(--status-success)' }}>{selectedRun.status}</strong>
            </div>
          </div>

          <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--status-info)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Guards Covered
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--status-info)', marginTop: '4px' }}>
              {selectedRun.totalGuards} Guards
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Verified Biometric Attendance
            </div>
          </div>

          <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--brand-navy-600)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Gross Wages Payable
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '4px' }}>
              ₹{selectedRun.grossPayroll.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Basic + HRA + Allowances + OT
            </div>
          </div>

          <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--status-success)' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Net Salary Disbursal
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--status-success)', marginTop: '4px' }}>
              ₹{selectedRun.netPayroll.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Deductions: ₹{selectedRun.totalDeductions.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Payslips Table */}
      {selectedRun && (
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>
                Workforce Payslip Register:
              </div>
              <select
                className="form-control"
                style={{ width: 'auto', padding: '4px 10px', fontSize: '13px', fontWeight: 600 }}
                value={selectedRun?.id}
                onChange={e => setSelectedRunId(e.target.value)}
              >
                {payrollRuns.map(run => (
                  <option key={run.id} value={run.id}>
                    {run.periodMonth} ({run.status} — ₹{run.netPayroll.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedRun.status !== 'Approved' && selectedRun.status !== 'Locked' ? (
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => approvePayrollRun(selectedRun.id)}
                >
                  <Lock size={13} />
                  <span>Approve & Lock Payroll Run</span>
                </button>
              ) : (
                <span className="badge badge-success">
                  ✓ Run Approved & Locked
                </span>
              )}
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payslip #</th>
                  <th>Guard Personnel</th>
                  <th>Category</th>
                  <th>Days Worked</th>
                  <th>OT Hours</th>
                  <th>Basic Salary</th>
                  <th>Gross Salary</th>
                  <th>PF (12%)</th>
                  <th>ESIC (0.75%)</th>
                  <th>Net Payable</th>
                  <th>Payment</th>
                  <th style={{ textAlign: 'right' }}>Print Payslip</th>
                </tr>
              </thead>
              <tbody>
                {selectedRun.payslips.map(ps => (
                  <tr key={ps.payslipNumber}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                      {ps.payslipNumber}
                    </td>
                    <td style={{ fontWeight: 600 }}>{ps.guardName}</td>
                    <td>{ps.category}</td>
                    <td>{ps.daysWorked} Days</td>
                    <td>{ps.otHours} hrs</td>
                    <td>₹{ps.basicSalary.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>₹{ps.grossSalary.toLocaleString()}</td>
                    <td>₹{ps.pfDeduction.toLocaleString()}</td>
                    <td>₹{ps.esicDeduction.toLocaleString()}</td>
                    <td style={{ fontWeight: 800, color: 'var(--status-success)' }}>
                      ₹{ps.netSalary.toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge status={ps.paymentStatus} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewingPayslip(ps)}
                        title="View & Print Official Payslip"
                      >
                        <Eye size={13} />
                        <span>Payslip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Corporate Payslip Modal */}
      {viewingPayslip && (
        <Modal
          isOpen={true}
          onClose={() => setViewingPayslip(null)}
          title={`Corporate Payslip: ${viewingPayslip.payslipNumber}`}
          subtitle={`${viewingPayslip.guardName} • ${selectedRun?.periodMonth}`}
          size="lg"
        >
          <div style={{
            background: 'var(--bg-surface)',
            border: '2px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px'
          }}>
            {/* Payslip Corporate Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid var(--border-strong)',
              paddingBottom: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)' }}>
                  SAFE GUARD FORCE ENTERPRISE
                </h2>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Security & Workforce Management Services Pvt. Ltd. • PSARA Licensed
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  CIN: U74920DL2018PTC123456 • Regional HQ: Gurugram, Haryana
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-neutral" style={{ fontSize: '12px' }}>
                  {selectedRun?.periodMonth}
                </span>
                <div style={{ fontSize: '12.5px', fontWeight: 700, marginTop: '4px' }}>
                  {viewingPayslip.payslipNumber}
                </div>
              </div>
            </div>

            {/* Guard Info Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              background: 'var(--bg-subtle)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Employee Name</div>
                <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{viewingPayslip.guardName}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Designation / Category</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{viewingPayslip.category}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Duty Days Worked</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{viewingPayslip.daysWorked} Days (OT: {viewingPayslip.otHours}h)</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Disbursal Bank</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>SBI (NEFT Transfer)</div>
              </div>
            </div>

            {/* Earnings and Deductions Two-Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Earnings */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '8px' }}>
                  EARNINGS
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Basic Wages:</span>
                    <span style={{ fontWeight: 600 }}>₹{viewingPayslip.basicSalary.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>House Rent Allowance (HRA):</span>
                    <span style={{ fontWeight: 600 }}>₹{viewingPayslip.hra.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Uniform & Conveyance:</span>
                    <span style={{ fontWeight: 600 }}>₹{viewingPayslip.allowances.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Overtime Duty Pay:</span>
                    <span style={{ fontWeight: 600 }}>₹{viewingPayslip.otPay.toLocaleString()}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '6px',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}>
                    <span>GROSS EARNINGS:</span>
                    <span>₹{viewingPayslip.grossSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '8px' }}>
                  STATUTORY DEDUCTIONS
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Provident Fund (EPF 12%):</span>
                    <span style={{ fontWeight: 600 }}>₹{viewingPayslip.pfDeduction.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>ESIC Contribution (0.75%):</span>
                    <span style={{ fontWeight: 600 }}>₹{viewingPayslip.esicDeduction.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Professional Tax (PT):</span>
                    <span style={{ fontWeight: 600 }}>₹{viewingPayslip.ptDeduction.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Loan / Uniform Recoveries:</span>
                    <span style={{ fontWeight: 600 }}>₹0</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '6px',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}>
                    <span>TOTAL DEDUCTIONS:</span>
                    <span>₹{(viewingPayslip.pfDeduction + viewingPayslip.esicDeduction + viewingPayslip.ptDeduction).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Payable Box */}
            <div style={{
              background: 'var(--brand-gold-bg)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                  NET SALARY CREDITED TO BANK
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Disbursed via automated corporate NEFT batch
                </div>
              </div>

              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent-gold)' }}>
                ₹{viewingPayslip.netSalary.toLocaleString()}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setViewingPayslip(null)}>
                Close
              </button>
              <button className="btn btn-gold" onClick={() => window.print()}>
                <Printer size={15} />
                <span>Print Official Payslip</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
