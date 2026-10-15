import React, { useState } from 'react';
import { 
  Landmark, Plus, Search, Filter, Download, 
  FileCheck, Clock, CheckCircle, ArrowRight 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { PaymentReceipt } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const CollectionsLedger: React.FC = () => {
  const { 
    payments, invoices, clients, recordPaymentReceipt, 
    kpis, t, addToast 
  } = useERP();

  const [activeTab, setActiveTab] = useState<'receipts' | 'ageing'>('receipts');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    amount: 150000,
    tdsAmount: 3000,
    paymentMode: 'NEFT/RTGS' as PaymentReceipt['paymentMode'],
    referenceNumber: '',
    allocatedInvoiceId: invoices[0]?.id || '',
    notes: 'Electronic NEFT settlement credited to HDFC corporate account.'
  });

  const handleRecordReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) {
      addToast('warning', 'Validation Error', 'Payment amount must be greater than 0.');
      return;
    }

    recordPaymentReceipt({
      clientId: formData.clientId,
      amount: Number(formData.amount),
      tdsAmount: Number(formData.tdsAmount),
      paymentMode: formData.paymentMode,
      referenceNumber: formData.referenceNumber || 'UTR' + Math.random().toString().substring(2, 12),
      allocatedInvoiceIds: [formData.allocatedInvoiceId],
      notes: formData.notes
    });

    setIsRecordModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Landmark size={26} color="var(--brand-gold-400)" />
            {t('collections')}
          </h1>
          <p>
            Accounts receivable recovery, invoice ageing buckets, and TDS Section 194C payment reconciliation.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-gold" onClick={() => setIsRecordModalOpen(true)}>
            <Plus size={16} />
            <span>Record Payment Receipt</span>
          </button>
        </div>
      </div>

      {/* AR Ageing Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--status-success)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Collections Realized
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--status-success)', marginTop: '4px' }}>
            ₹{kpis.collectionsTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Recovery Rate: <strong>{Math.round((kpis.collectionsTotal / (kpis.monthlyBillingTotal || 1)) * 100)}%</strong>
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--brand-gold-400)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Current Receivables (0-30d)
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand-gold-400)', marginTop: '4px' }}>
            ₹5,10,000
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Within contractual credit period
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--status-warning)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Ageing (31-60 Days)
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--status-warning-fg)', marginTop: '4px' }}>
            ₹2,30,000
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            First follow-up notice sent
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid var(--status-danger)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Overdue (60+ Days)
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--status-danger)', marginTop: '4px' }}>
            ₹{kpis.overdueInvoicesTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Escalated to management
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'receipts' ? 'active' : ''}`}
          onClick={() => setActiveTab('receipts')}
        >
          Payment Receipts Register ({payments.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ageing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ageing')}
        >
          Client Ageing Ledger Analysis
        </button>
      </div>

      {/* Tab 1: Payment Receipts */}
      {activeTab === 'receipts' && (
        <div className="table-container">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Client</th>
                  <th>Receipt Date</th>
                  <th>Gross Amount</th>
                  <th>TDS Deducted (2%)</th>
                  <th>Net Realized</th>
                  <th>Mode & Reference</th>
                  <th>Allocated Invoices</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                      {p.receiptNumber}
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.clientName}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.paymentDate}</td>
                    <td style={{ fontWeight: 700 }}>₹{p.amount.toLocaleString()}</td>
                    <td style={{ color: 'var(--status-warning-fg)' }}>₹{p.tdsDeducted.toLocaleString()}</td>
                    <td style={{ fontWeight: 800, color: 'var(--status-success)' }}>
                      ₹{p.netReceived.toLocaleString()}
                    </td>
                    <td>
                      <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{p.paymentMode}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.referenceNumber}</div>
                    </td>
                    <td>
                      <span className="badge badge-info">{p.allocatedInvoiceIds.join(', ')}</span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {p.notes || 'Settled'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Ageing Breakdown */}
      {activeTab === 'ageing' && (
        <div className="table-container">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Total Billed</th>
                  <th>Total Collected</th>
                  <th>Current (0-30d)</th>
                  <th>31-60 Days</th>
                  <th>61-90 Days</th>
                  <th>90+ Days (Overdue)</th>
                  <th>Total Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => {
                  const clientInvoices = invoices.filter(inv => inv.clientId === c.id);
                  const totalBilled = clientInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
                  const totalPaid = clientInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
                  const bal = totalBilled - totalPaid;

                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700 }}>{c.name}</td>
                      <td>₹{totalBilled.toLocaleString()}</td>
                      <td style={{ color: 'var(--status-success)', fontWeight: 600 }}>₹{totalPaid.toLocaleString()}</td>
                      <td>₹{bal > 0 ? (bal * 0.6).toFixed(0) : 0}</td>
                      <td>₹{bal > 0 ? (bal * 0.3).toFixed(0) : 0}</td>
                      <td>₹0</td>
                      <td style={{ color: c.totalOutstanding > 200000 ? 'var(--status-danger)' : 'inherit', fontWeight: c.totalOutstanding > 200000 ? 700 : 400 }}>
                        ₹{c.totalOutstanding > 200000 ? '1,12,000' : '0'}
                      </td>
                      <td style={{ fontWeight: 800, color: bal > 0 ? 'var(--status-warning-fg)' : 'var(--status-success)' }}>
                        ₹{bal.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsRecordModalOpen(false)}
          title="Record Client Payment Receipt"
          subtitle="Credit NEFT/RTGS settlement and update invoice balances"
          size="md"
        >
          <form onSubmit={handleRecordReceipt}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Client Remitter *</label>
              <select 
                className="form-control"
                value={formData.clientId}
                onChange={e => setFormData({ ...formData, clientId: e.target.value })}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Allocate to Open Invoice *</label>
              <select 
                className="form-control"
                value={formData.allocatedInvoiceId}
                onChange={e => setFormData({ ...formData, allocatedInvoiceId: e.target.value })}
              >
                {invoices.filter(i => i.balanceDue > 0).map(i => (
                  <option key={i.id} value={i.id}>
                    {i.invoiceNumber} — {i.clientName} (Bal: ₹{i.balanceDue.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid" style={{ marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label">Gross Amount (₹) *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required
                  value={formData.amount}
                  onChange={e => {
                    const amt = Number(e.target.value);
                    setFormData({ ...formData, amount: amt, tdsAmount: Math.round(amt * 0.02) });
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">TDS Section 194C (2%)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.tdsAmount}
                  onChange={e => setFormData({ ...formData, tdsAmount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label">Payment Mode *</label>
                <select 
                  className="form-control"
                  value={formData.paymentMode}
                  onChange={e => setFormData({ ...formData, paymentMode: e.target.value as any })}
                >
                  <option value="NEFT/RTGS">NEFT / RTGS</option>
                  <option value="UPI">Corporate UPI</option>
                  <option value="Cheque">Banker's Cheque</option>
                  <option value="Direct Transfer">Direct IMPS</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bank UTR / Reference # *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. HDFCR520261015"
                  value={formData.referenceNumber}
                  onChange={e => setFormData({ ...formData, referenceNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label">Remittance Notes</label>
              <textarea 
                className="form-control" 
                rows={2}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsRecordModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Save & Issue Receipt Voucher
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
