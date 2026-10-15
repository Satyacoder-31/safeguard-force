import React, { useState } from 'react';
import { 
  Target, Plus, Search, CheckCircle, 
  ArrowRight, DollarSign, Building2, User, Phone 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { CRMLead } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const CRMPipeline: React.FC = () => {
  const { crmLeads, addCRMLead, updateLeadStage, convertLeadToClient, t, addToast } = useERP();

  const [activeView, setActiveView] = useState<'kanban' | 'table'>('kanban');
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // New lead state
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: 'Commercial IT Park',
    requiredGuards: 24,
    estimatedMonthlyValue: 550000,
    expectedClosingDate: '2026-11-20',
    notes: 'Inquiry received via web for round-the-clock commercial security.'
  });

  const stages: CRMLead['stage'][] = [
    'Lead',
    'Contacted',
    'Site Survey',
    'Proposal Sent',
    'Negotiation',
    'Won'
  ];

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.contactPerson.trim()) {
      addToast('warning', 'Validation Error', 'Company name and contact person are required.');
      return;
    }

    addCRMLead({
      companyName: formData.companyName.trim(),
      contactPerson: formData.contactPerson.trim(),
      email: formData.email.trim() || 'contact@client.com',
      phone: formData.phone.trim() || '+91 98000 00000',
      industry: formData.industry,
      estimatedMonthlyValue: Number(formData.estimatedMonthlyValue) || 150000,
      stage: 'Lead',
      notes: formData.notes
    });

    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      industry: 'Commercial IT Park',
      requiredGuards: 24,
      estimatedMonthlyValue: 550000,
      expectedClosingDate: '2026-11-20',
      notes: 'Inquiry received via web for round-the-clock commercial security.'
    });
    setIsAddLeadModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Target size={26} color="var(--brand-gold-400)" />
            {t('crm')}
          </h1>
          <p>
            Sales opportunity pipeline, commercial security quotations, site surveys, and one-click client conversion.
          </p>
        </div>

        <div className="page-actions-group">
          <div className="lang-switcher">
            <button 
              className={`lang-btn ${activeView === 'kanban' ? 'active' : ''}`}
              onClick={() => setActiveView('kanban')}
            >
              Kanban Pipeline
            </button>
            <button 
              className={`lang-btn ${activeView === 'table' ? 'active' : ''}`}
              onClick={() => setActiveView('table')}
            >
              Opportunities Table
            </button>
          </div>

          <button className="btn btn-gold" onClick={() => setIsAddLeadModalOpen(true)}>
            <Plus size={16} />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {activeView === 'kanban' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '20px'
        }}>
          {stages.map(stage => {
            const stageLeads = crmLeads.filter(l => l.stage === stage);

            return (
              <div 
                key={stage}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '75vh'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {stage}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-muted)',
                    fontWeight: 700
                  }}>
                    {stageLeads.length}
                  </span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stageLeads.map(lead => (
                    <div 
                      key={lead.id}
                      style={{
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '3px' }}>
                        {lead.companyName}
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        {lead.industry} • Contact: {lead.contactPerson}
                      </div>

                      <div style={{
                        background: 'var(--bg-surface)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Value</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--status-success)' }}>
                          ₹{lead.estimatedMonthlyValue.toLocaleString()} / mo
                        </span>
                      </div>

                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Requirement: <strong>{lead.requiredGuards} Guards</strong> ({lead.probabilityPercent}% probability)
                      </div>

                      {/* Action buttons */}
                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {stage === 'Negotiation' ? (
                          <button 
                            className="btn btn-success btn-sm"
                            style={{ width: '100%' }}
                            onClick={() => convertLeadToClient(lead.id)}
                            title="Convert won contract into live Client & Sites"
                          >
                            <CheckCircle size={13} />
                            <span>Close Won & Convert to Client</span>
                          </button>
                        ) : stage !== 'Won' ? (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                const currentIndex = stages.indexOf(stage);
                                if (currentIndex < stages.length - 1) {
                                  updateLeadStage(lead.id, stages[currentIndex + 1]);
                                }
                              }}
                            >
                              <span>Next Stage</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: 'var(--status-success)', fontWeight: 700 }}>
                            ✓ Active Contracted Client
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      No deals in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {activeView === 'table' && (
        <div className="table-container">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company / Prospect</th>
                  <th>Contact Person</th>
                  <th>Industry</th>
                  <th>Guard Strength Req.</th>
                  <th>Monthly Contract Value</th>
                  <th>Win Probability</th>
                  <th>Sales Lead Owner</th>
                  <th>Stage</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {crmLeads.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{l.companyName}</td>
                    <td>
                      <div style={{ fontSize: '12.5px' }}>{l.contactPerson}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l.phone}</div>
                    </td>
                    <td>{l.industry}</td>
                    <td>{l.requiredGuards} Guards</td>
                    <td style={{ fontWeight: 700, color: 'var(--status-success)' }}>
                      ₹{l.estimatedMonthlyValue.toLocaleString()}
                    </td>
                    <td>{l.probabilityPercent}%</td>
                    <td>{l.assignedTo}</td>
                    <td><StatusBadge status={l.stage} /></td>
                    <td style={{ textAlign: 'right' }}>
                      {l.stage !== 'Won' && (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => convertLeadToClient(l.id)}
                        >
                          Convert to Client
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Opportunity Modal */}
      {isAddLeadModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddLeadModalOpen(false)}
          title="Create New Sales Opportunity"
          subtitle="Record security contract prospect and manpower requirements"
          size="md"
        >
          <form onSubmit={handleCreateLead}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Company / Facility Name *</label>
              <input 
                type="text" 
                className="form-control" 
                required
                placeholder="e.g. Oberoi Mall Commercial"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Contact Person *</label>
              <input 
                type="text" 
                className="form-control" 
                required
                placeholder="e.g. Sanjay Nair (Head of Security)"
                value={formData.contactPerson}
                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>

            <div className="form-grid" style={{ marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label">Required Guard Count</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.requiredGuards}
                  onChange={e => setFormData({ ...formData, requiredGuards: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Est. Monthly Value (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.estimatedMonthlyValue}
                  onChange={e => setFormData({ ...formData, estimatedMonthlyValue: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsAddLeadModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Create Opportunity
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
