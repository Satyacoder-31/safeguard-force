import React, { useState } from 'react';
import { 
  FileSpreadsheet, Plus, Download, AlertTriangle, 
  Calendar, CheckCircle, Receipt, ArrowRight, Shield 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { Contract, GuardCategory } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const ContractManagement: React.FC = () => {
  const { 
    contracts, clients, addContract, 
    generateInvoiceFromContract, setActiveModule, 
    t, addToast 
  } = useERP();

  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New contract form
  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    title: '',
    startDate: '2026-11-01',
    endDate: '2028-10-31',
    renewalDate: '2028-09-15',
    serviceFeePercent: 10,
    supervisorRate: 29000,
    armedGuardRate: 24000,
    unarmedGuardRate: 18500,
    ladyGuardRate: 19500
  });

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formData.clientId);
    if (!client) return;

    addContract({
      clientId: client.id,
      clientName: client.name,
      title: formData.title || `Integrated Security Master Contract - ${client.name}`,
      startDate: formData.startDate,
      endDate: formData.endDate,
      renewalDate: formData.renewalDate,
      serviceFeePercent: Number(formData.serviceFeePercent),
      rates: [
        { category: 'Security Supervisor', requiredCount: 4, ratePerMonth: Number(formData.supervisorRate), otRatePerHour: 220 },
        { category: 'Armed Guard', requiredCount: 6, ratePerMonth: Number(formData.armedGuardRate), otRatePerHour: 180 },
        { category: 'Unarmed Guard', requiredCount: 20, ratePerMonth: Number(formData.unarmedGuardRate), otRatePerHour: 140 },
        { category: 'Lady Guard', requiredCount: 4, ratePerMonth: Number(formData.ladyGuardRate), otRatePerHour: 150 }
      ],
      totalMonthlyValue: 
        (4 * formData.supervisorRate) + 
        (6 * formData.armedGuardRate) + 
        (20 * formData.unarmedGuardRate) + 
        (4 * formData.ladyGuardRate)
    });

    setIsAddModalOpen(false);
  };

  const handleTriggerInvoice = (contract: Contract) => {
    generateInvoiceFromContract(contract.clientId, 'October 2026');
    setActiveModule('billing');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <FileSpreadsheet size={26} color="var(--brand-gold-400)" />
            {t('contracts')}
          </h1>
          <p>
            Service agreements, contractual post structures, category billing tariffs, and renewal terms.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-gold" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            <span>Create Master Contract</span>
          </button>
        </div>
      </div>

      {/* Contract Expiry Alert banner */}
      {contracts.some(c => c.status === 'Expiring') && (
        <div style={{
          marginBottom: '20px',
          padding: '14px 18px',
          background: 'var(--status-warning-bg)',
          border: '1px solid var(--status-warning-border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="var(--status-warning-fg)" />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--status-warning-fg)' }}>
                Upcoming Contract Renewal Reminder
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Phoenix Marketcity Mall contract (SGF-CT-2025-094) is expiring in 45 days. Rate escalation review due.
              </div>
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              const exp = contracts.find(c => c.status === 'Expiring');
              if (exp) setViewingContract(exp);
            }}
          >
            Review Terms & Escalate
          </button>
        </div>
      )}

      {/* Contracts Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ fontSize: '13.5px', fontWeight: 700 }}>
            Active Security Service Level Agreements (SLAs)
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            {contracts.length} Approved Master Agreements
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contract #</th>
                <th>Client & Agreement Title</th>
                <th>Validity Period</th>
                <th>Monthly Contract Value</th>
                <th>Service Fee</th>
                <th>GST Rate</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                    {c.contractNumber}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.clientName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.title}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12.5px' }}>{c.startDate} to {c.endDate}</div>
                    <div style={{ fontSize: '11px', color: c.status === 'Expiring' ? 'var(--status-warning-fg)' : 'var(--text-muted)' }}>
                      Renewal: {c.renewalDate}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{c.totalMonthlyValue.toLocaleString()}
                  </td>
                  <td>{c.serviceFeePercent}%</td>
                  <td>{c.gstRatePercent}% GST</td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewingContract(c)}
                        title="View Category Billing Rates"
                      >
                        Rates & Posts
                      </button>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleTriggerInvoice(c)}
                        title="Auto-generate monthly billing invoice"
                      >
                        <Receipt size={13} />
                        <span>Bill Client</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Detail Modal */}
      {viewingContract && (
        <Modal
          isOpen={true}
          onClose={() => setViewingContract(null)}
          title={`Contract Tariffs: ${viewingContract.contractNumber}`}
          subtitle={`${viewingContract.clientName} — ${viewingContract.title}`}
          size="lg"
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Monthly Value</div>
                <div style={{ fontSize: '20px', fontWeight: 800 }}>₹{viewingContract.totalMonthlyValue.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Service Management Fee</div>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>{viewingContract.serviceFeePercent}% on Gross</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Agreement Status</div>
                <StatusBadge status={viewingContract.status} />
              </div>
            </div>

            <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Agreed Manpower Tariff Rates by Category</h4>
            <table className="data-table" style={{ marginBottom: '16px' }}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Required Strength</th>
                  <th>Rate / Month (₹)</th>
                  <th>Overtime Rate / Hr (₹)</th>
                  <th>Monthly Subtotal (₹)</th>
                </tr>
              </thead>
              <tbody>
                {viewingContract.rates.map((rate, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{rate.category}</td>
                    <td>{rate.requiredCount} Guards</td>
                    <td>₹{rate.ratePerMonth.toLocaleString()}</td>
                    <td>₹{rate.otRatePerHour}</td>
                    <td style={{ fontWeight: 700 }}>₹{(rate.requiredCount * rate.ratePerMonth).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setViewingContract(null)}
              >
                Close
              </button>
              <button 
                className="btn btn-gold"
                onClick={() => {
                  handleTriggerInvoice(viewingContract);
                  setViewingContract(null);
                }}
              >
                <Receipt size={14} />
                <span>Generate Client Invoice</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Contract Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Create Security Master Contract"
          subtitle="Configure contracted strength, billing rates, and renewal terms"
          size="lg"
        >
          <form onSubmit={handleCreateContract}>
            <div className="form-grid" style={{ marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label">Client *</label>
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

              <div className="form-group">
                <label className="form-label">Agreement Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. 24x7 Facility Security Agreement"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Security Supervisor Rate / Mo (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.supervisorRate}
                  onChange={e => setFormData({ ...formData, supervisorRate: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Armed Guard Rate / Mo (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.armedGuardRate}
                  onChange={e => setFormData({ ...formData, armedGuardRate: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unarmed Guard Rate / Mo (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.unarmedGuardRate}
                  onChange={e => setFormData({ ...formData, unarmedGuardRate: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lady Guard Rate / Mo (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.ladyGuardRate}
                  onChange={e => setFormData({ ...formData, ladyGuardRate: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Activate Master Contract
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
