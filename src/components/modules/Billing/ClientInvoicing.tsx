import React, { useState } from 'react';
import { 
  Receipt, Plus, Printer, Download, Eye, 
  CheckCircle, FileText, AlertTriangle, Building2 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { ClientInvoice } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const ClientInvoicing: React.FC = () => {
  const { 
    invoices, clients, approveInvoice, 
    generateInvoiceFromContract, t, addToast 
  } = useERP();

  const [selectedInvoice, setSelectedInvoice] = useState<ClientInvoice | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [billingPeriod, setBillingPeriod] = useState('October 2026');

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    generateInvoiceFromContract(selectedClientId, billingPeriod);
    setIsGenerateModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Receipt size={26} color="var(--brand-gold-400)" />
            {t('billing')}
          </h1>
          <p>
            Contractual tariff-driven GST invoicing, service charge calculation, and formal client billing registers.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-gold" onClick={() => setIsGenerateModalOpen(true)}>
            <Plus size={16} />
            <span>Generate Client Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ fontSize: '14px', fontWeight: 700 }}>
            GST Tax Invoices Register
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {invoices.length} Registered Tax Invoices
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client Legal Entity</th>
                <th>Period</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Taxable Subtotal</th>
                <th>GST (18%)</th>
                <th>Total Invoiced</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Tax Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                    {inv.invoiceNumber}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {inv.clientName}
                  </td>
                  <td>{inv.billingPeriod}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inv.issueDate}</td>
                  <td style={{ fontSize: '12px', color: inv.status === 'Overdue' ? 'var(--status-danger)' : 'var(--text-muted)', fontWeight: inv.status === 'Overdue' ? 700 : 400 }}>
                    {inv.dueDate}
                  </td>
                  <td>₹{inv.subtotal.toLocaleString()}</td>
                  <td>₹{(inv.cgst + inv.sgst).toLocaleString()}</td>
                  <td style={{ fontWeight: 800 }}>
                    ₹{inv.totalAmount.toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 700, color: inv.balanceDue > 0 ? 'var(--status-warning-fg)' : 'var(--status-success)' }}>
                    ₹{inv.balanceDue.toLocaleString()}
                  </td>
                  <td>
                    <StatusBadge status={inv.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {inv.status === 'Review' && (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => approveInvoice(inv.id)}
                        >
                          Approve & Issue
                        </button>
                      )}
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedInvoice(inv)}
                        title="View & Print Official GST Tax Invoice"
                      >
                        <Eye size={13} />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable GST Tax Invoice Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
          title={`Corporate Tax Invoice: ${selectedInvoice.invoiceNumber}`}
          subtitle={`${selectedInvoice.clientName} • ${selectedInvoice.billingPeriod}`}
          size="lg"
        >
          <div style={{
            background: 'var(--bg-surface)',
            border: '2px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px'
          }}>
            {/* Invoice Top Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid var(--border-strong)',
              paddingBottom: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--brand-navy-900)' }}>
                  SAFE GUARD FORCE ENTERPRISE
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Facility Security & Manpower Management Solutions Pvt. Ltd.
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  GSTIN: <strong>07AAAFS9876Q1Z9</strong> • PAN: AAAFS9876Q • State Code: 07 (Delhi)
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Registered HQ: Sector 24, Cyber City Phase 2, Gurugram, Haryana 122002
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--accent-gold)' }}>
                  TAX INVOICE
                </span>
                <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', marginTop: '2px' }}>
                  {selectedInvoice.invoiceNumber}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Date: {selectedInvoice.issueDate}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Payment Due: <strong>{selectedInvoice.dueDate}</strong>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <StatusBadge status={selectedInvoice.status} />
                </div>
              </div>
            </div>

            {/* Billed To Client Details */}
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  BILLED TO (CLIENT)
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px' }}>
                  {selectedInvoice.clientName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Billing Period: <strong>{selectedInvoice.billingPeriod}</strong>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  SAC CODE
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>
                  998525 (Security Guarding Services)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Reverse Charge Applicable: <strong>NO</strong>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="data-table" style={{ marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th>Description of Security Deployments</th>
                  <th>Guard Category</th>
                  <th style={{ textAlign: 'center' }}>Staff Strength</th>
                  <th>Contract Tariff / Mo</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.lineItems.map(li => (
                  <tr key={li.id}>
                    <td style={{ fontWeight: 600 }}>{li.description}</td>
                    <td>{li.category}</td>
                    <td style={{ textAlign: 'center' }}>{li.guardsCount} Guards</td>
                    <td>₹{li.ratePerMonth.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{li.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculation Breakdown & Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Manpower Subtotal:</span>
                  <span style={{ fontWeight: 600 }}>₹{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Management Service Fee ({selectedInvoice.serviceChargePercent}%):</span>
                  <span style={{ fontWeight: 600 }}>₹{selectedInvoice.serviceChargeAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Central GST (CGST 9%):</span>
                  <span style={{ fontWeight: 600 }}>₹{selectedInvoice.cgst.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>State GST (SGST 9%):</span>
                  <span style={{ fontWeight: 600 }}>₹{selectedInvoice.sgst.toLocaleString()}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '2px solid var(--border-strong)',
                  paddingTop: '8px',
                  fontSize: '16px',
                  fontWeight: 900,
                  color: 'var(--brand-navy-900)'
                }}>
                  <span>TOTAL INVOICE VALUE:</span>
                  <span>₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: selectedInvoice.balanceDue > 0 ? 'var(--status-warning-fg)' : 'var(--status-success)'
                }}>
                  <span>OUTSTANDING BALANCE DUE:</span>
                  <span>₹{selectedInvoice.balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bank Remittance Details */}
            <div style={{
              background: 'var(--bg-subtle)',
              border: '1px dashed var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              fontSize: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>NEFT / RTGS Bank Details for Client Remittance:</strong>
                <div>A/C Name: Safe Guard Force Services Pvt. Ltd. | Bank: HDFC Bank, DLF Cyber City Branch</div>
                <div>A/C No: 50200089123456 | IFSC Code: HDFC0000123</div>
              </div>
              <div style={{ textAlign: 'right', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                Computer Generated Invoice
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedInvoice(null)}>
                Close
              </button>
              <button className="btn btn-gold" onClick={handlePrint}>
                <Printer size={15} />
                <span>Print Tax Invoice PDF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Generate Invoice Modal */}
      {isGenerateModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsGenerateModalOpen(false)}
          title="Generate Monthly Client Invoice"
          subtitle="Auto-compile billable shifts, tariffs, and statutory GST"
          size="md"
        >
          <form onSubmit={handleGenerateInvoice}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Select Client *</label>
              <select 
                className="form-control"
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label">Billing Period *</label>
              <input 
                type="text" 
                className="form-control" 
                value={billingPeriod}
                onChange={e => setBillingPeriod(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsGenerateModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Compile & Create Invoice
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
