import React, { useState } from 'react';
import { 
  UserPlus, CheckCircle, ArrowRight, Plus, 
  Search, Shield, Phone, Mail, Award, Clock 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { RecruitmentCandidate, GuardCategory } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const RecruitmentPipeline: React.FC = () => {
  const { 
    candidates, addCandidate, updateCandidateStage, convertCandidateToGuard, 
    t, addToast 
  } = useERP();

  const [activeView, setActiveView] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New candidate form
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    appliedCategory: 'Unarmed Guard' as GuardCategory,
    source: 'Direct Walk-in' as const,
    experienceYears: 2,
    expectedSalary: 17000,
    policeVerificationStatus: 'In Process' as const
  });

  const stages: RecruitmentCandidate['stage'][] = [
    'New Candidate',
    'Interview Scheduled',
    'Selected',
    'Police Verification',
    'Ready for Deployment',
    'Joined'
  ];

  const filteredCandidates = candidates.filter(c => 
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.candidateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      addToast('warning', 'Validation Error', 'Candidate name and mobile number are required.');
      return;
    }

    addCandidate({
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || 'candidate@gmail.com',
      appliedCategory: formData.appliedCategory,
      source: formData.source,
      experienceYears: Number(formData.experienceYears) || 0,
      expectedSalary: Number(formData.expectedSalary) || 16000,
      policeVerificationStatus: formData.policeVerificationStatus
    });

    setFormData({
      fullName: '',
      phone: '',
      email: '',
      appliedCategory: 'Unarmed Guard',
      source: 'Direct Walk-in',
      experienceYears: 2,
      expectedSalary: 17000,
      policeVerificationStatus: 'In Process'
    });
    setIsAddModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <UserPlus size={26} color="var(--brand-gold-400)" />
            {t('recruitment')}
          </h1>
          <p>
            Candidate hiring funnel, physical fitness vetting, police verification tracking, and 1-click employee conversion.
          </p>
        </div>

        <div className="page-actions-group">
          <div className="lang-switcher">
            <button 
              className={`lang-btn ${activeView === 'kanban' ? 'active' : ''}`}
              onClick={() => setActiveView('kanban')}
            >
              Kanban Board
            </button>
            <button 
              className={`lang-btn ${activeView === 'table' ? 'active' : ''}`}
              onClick={() => setActiveView('table')}
            >
              Table View
            </button>
          </div>

          <button className="btn btn-gold" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            <span>New Candidate</span>
          </button>
        </div>
      </div>

      {/* Kanban Pipeline View */}
      {activeView === 'kanban' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '20px'
        }}>
          {stages.map(stage => {
            const stageCandidates = filteredCandidates.filter(c => c.stage === stage);

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
                {/* Column Header */}
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
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stageCandidates.map(c => (
                    <div
                      key={c.id}
                      style={{
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--brand-gold-500)', fontWeight: 700 }}>
                          {c.candidateNumber}
                        </span>
                        <StatusBadge status={c.policeVerificationStatus} />
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                        {c.fullName}
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        {c.appliedCategory} • {c.experienceYears}y exp
                      </div>

                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        {c.phone}
                      </div>

                      {/* Progression / Conversion Action */}
                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {stage === 'Ready for Deployment' ? (
                          <button 
                            className="btn btn-success btn-sm"
                            style={{ width: '100%' }}
                            onClick={() => convertCandidateToGuard(c.id)}
                            title="Instantly create Guard master record"
                          >
                            <CheckCircle size={13} />
                            <span>1-Click Onboard Guard</span>
                          </button>
                        ) : stage !== 'Joined' ? (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                const currentIndex = stages.indexOf(stage);
                                if (currentIndex < stages.length - 1) {
                                  updateCandidateStage(c.id, stages[currentIndex + 1]);
                                }
                              }}
                            >
                              <span>Next Stage</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: 'var(--status-success)', fontWeight: 600 }}>
                            ✓ Active Guard
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageCandidates.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      No candidates in this stage
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
                  <th>Candidate #</th>
                  <th>Full Name</th>
                  <th>Applied Category</th>
                  <th>Mobile Phone</th>
                  <th>Source</th>
                  <th>Experience</th>
                  <th>Police Verification</th>
                  <th>Pipeline Stage</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                      {c.candidateNumber}
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.fullName}</td>
                    <td>{c.appliedCategory}</td>
                    <td>{c.phone}</td>
                    <td>{c.source}</td>
                    <td>{c.experienceYears} Years</td>
                    <td><StatusBadge status={c.policeVerificationStatus} /></td>
                    <td><StatusBadge status={c.stage} /></td>
                    <td style={{ textAlign: 'right' }}>
                      {c.stage === 'Ready for Deployment' && (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => convertCandidateToGuard(c.id)}
                        >
                          Convert to Guard
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

      {/* Add Candidate Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Register New Job Applicant"
          subtitle="Add applicant to recruitment screening and verification pipeline"
          size="md"
        >
          <form onSubmit={handleCreateCandidate}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Full Candidate Name *</label>
              <input 
                type="text" 
                className="form-control" 
                required
                placeholder="e.g. Kuldeep Singh"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Mobile Number *</label>
              <input 
                type="tel" 
                className="form-control" 
                required
                placeholder="+91 98XXX XXXXX"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Category Applied For</label>
              <select 
                className="form-control"
                value={formData.appliedCategory}
                onChange={e => setFormData({ ...formData, appliedCategory: e.target.value as GuardCategory })}
              >
                <option value="Armed Guard">Armed Guard</option>
                <option value="Security Supervisor">Security Supervisor</option>
                <option value="Unarmed Guard">Unarmed Guard</option>
                <option value="Bouncer">Bouncer</option>
                <option value="Lady Guard">Lady Guard</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label">Prior Experience (Years)</label>
              <input 
                type="number" 
                className="form-control"
                value={formData.experienceYears}
                onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Save Applicant
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
