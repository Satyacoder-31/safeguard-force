import React, { useState } from 'react';
import { 
  Users, Plus, Search, Filter, Download, 
  Upload, Eye, Edit, Trash2, Shield, AlertTriangle, 
  CheckCircle, FileText, Smartphone, Mail, CreditCard 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { Guard, GuardCategory } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const GuardDirectory: React.FC = () => {
  const { 
    guards, addGuard, updateGuard, deleteGuard, 
    sites, t, addToast 
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPoliceVerif, setSelectedPoliceVerif] = useState<string>('All');

  // Modals
  const [viewingGuard, setViewingGuard] = useState<Guard | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<'profile' | 'documents' | 'salary' | 'uniform'>('profile');

  // Form State for New Guard
  const [formData, setFormData] = useState({
    name: '',
    nameHi: '',
    phone: '',
    email: '',
    category: 'Unarmed Guard' as GuardCategory,
    rank: 'Security Guard',
    currentSiteId: sites[0]?.id || '',
    shiftPreference: 'Morning' as const,
    basicSalary: 16000,
    hra: 4000,
    overtimeRate: 130,
    policeVerificationStatus: 'Verified' as const
  });

  // Filter guards
  const filteredGuards = guards.filter(g => {
    const matchesSearch = 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.guardIdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);

    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || g.status === selectedStatus;
    const matchesPolice = selectedPoliceVerif === 'All' || g.policeVerificationStatus === selectedPoliceVerif;

    return matchesSearch && matchesCategory && matchesStatus && matchesPolice;
  });

  const handleExportCSV = () => {
    const headers = "Guard ID,Name,Category,Rank,Phone,Site,Status,KYC Status,Police Verification,Basic Salary\n";
    const rows = filteredGuards.map(g => 
      `"${g.guardIdNumber}","${g.name}","${g.category}","${g.rank}","${g.phone}","${g.currentSiteName || 'Unassigned'}","${g.status}","${g.kycStatus}","${g.policeVerificationStatus}","${g.salaryStructure.basic}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SGF_Guard_Directory_${new Date().toISOString().substring(0, 10)}.csv`;
    link.click();
    addToast('success', 'Export Complete', `${filteredGuards.length} guards exported to CSV.`);
  };

  const handleCreateGuard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      addToast('warning', 'Validation Error', 'Name and mobile number are required.');
      return;
    }

    addGuard({
      name: formData.name,
      nameHi: formData.nameHi,
      phone: formData.phone,
      email: formData.email,
      category: formData.category,
      rank: formData.rank,
      currentSiteId: formData.currentSiteId,
      shiftPreference: formData.shiftPreference,
      policeVerificationStatus: formData.policeVerificationStatus,
      salaryStructure: {
        basic: Number(formData.basicSalary),
        hra: Number(formData.hra),
        conveyance: 1500,
        specialAllowance: 1000,
        overtimeHourlyRate: Number(formData.overtimeRate)
      }
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      nameHi: '',
      phone: '',
      email: '',
      category: 'Unarmed Guard',
      rank: 'Security Guard',
      currentSiteId: sites[0]?.id || '',
      shiftPreference: 'Morning',
      basicSalary: 16000,
      hra: 4000,
      overtimeRate: 130,
      policeVerificationStatus: 'Verified'
    });
  };

  return (
    <div>
      {/* Header Row */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Users size={26} color="var(--brand-gold-400)" />
            {t('guards')}
          </h1>
          <p>
            Master employee registry, verified KYC credentials, duty assignments, and weapon licenses.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={15} />
            <span>{t('exportCsv')}</span>
          </button>
          <button className="btn btn-gold" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            <span>Onboard Guard</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="table-container" style={{ marginBottom: '20px' }}>
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={15} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by name, ID, phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-actions">
            {/* Category Filter */}
            <select 
              className="form-control" 
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{ fontSize: '12.5px', height: '34px' }}
            >
              <option value="All">All Categories</option>
              <option value="Armed Guard">Armed Guard</option>
              <option value="Security Supervisor">Security Supervisor</option>
              <option value="Unarmed Guard">Unarmed Guard</option>
              <option value="Bouncer">Bouncer</option>
              <option value="Lady Guard">Lady Guard</option>
            </select>

            {/* Status Filter */}
            <select 
              className="form-control" 
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{ fontSize: '12.5px', height: '34px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
            </select>

            {/* Police Verification Filter */}
            <select 
              className="form-control" 
              value={selectedPoliceVerif}
              onChange={e => setSelectedPoliceVerif(e.target.value)}
              style={{ fontSize: '12.5px', height: '34px' }}
            >
              <option value="All">All Police Statuses</option>
              <option value="Verified">Police Verified</option>
              <option value="In Process">In Process</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Guard ID</th>
                <th>Employee / Photo</th>
                <th>Category & Rank</th>
                <th>Current Site</th>
                <th>Police Verification</th>
                <th>KYC Status</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuards.map(guard => (
                <tr key={guard.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                    {guard.guardIdNumber}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={guard.photo} 
                        alt={guard.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{guard.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{guard.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{guard.category}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{guard.rank}</div>
                  </td>
                  <td>
                    {guard.currentSiteName ? (
                      <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {guard.currentSiteName.split('-')[0]}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Reserve / Reliever
                      </span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={guard.policeVerificationStatus} />
                  </td>
                  <td>
                    <StatusBadge status={guard.kycStatus} />
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {guard.dateOfJoining}
                  </td>
                  <td>
                    <StatusBadge status={guard.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setViewingGuard(guard);
                          setDetailTab('profile');
                        }}
                        title="View Full Guard Profile"
                      >
                        <Eye size={13} />
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          deleteGuard(guard.id);
                        }}
                        title="Archive Guard"
                        style={{ color: 'var(--status-danger)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guard Detail Modal */}
      {viewingGuard && (
        <Modal
          isOpen={true}
          onClose={() => setViewingGuard(null)}
          title={`${viewingGuard.name} (${viewingGuard.guardIdNumber})`}
          subtitle={`${viewingGuard.category} • ${viewingGuard.rank}`}
          size="lg"
        >
          <div>
            {/* Modal Tabs Header */}
            <div className="tabs-header">
              <button 
                className={`tab-btn ${detailTab === 'profile' ? 'active' : ''}`}
                onClick={() => setDetailTab('profile')}
              >
                Personal & Deployment
              </button>
              <button 
                className={`tab-btn ${detailTab === 'documents' ? 'active' : ''}`}
                onClick={() => setDetailTab('documents')}
              >
                KYC & Licenses ({viewingGuard.documents.length})
              </button>
              <button 
                className={`tab-btn ${detailTab === 'salary' ? 'active' : ''}`}
                onClick={() => setDetailTab('salary')}
              >
                Salary & Bank Details
              </button>
              <button 
                className={`tab-btn ${detailTab === 'uniform' ? 'active' : ''}`}
                onClick={() => setDetailTab('uniform')}
              >
                Uniform & Kit Issued
              </button>
            </div>

            {/* Tab 1: Profile & Deployment */}
            {detailTab === 'profile' && (
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ flexShrink: 0 }}>
                  <img 
                    src={viewingGuard.photo} 
                    alt={viewingGuard.name}
                    style={{ width: '120px', height: '140px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '2px solid var(--border-subtle)' }}
                  />
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <StatusBadge status={viewingGuard.status} />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '240px' }} className="form-grid">
                  <div>
                    <span className="form-label">Full Legal Name</span>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{viewingGuard.name}</div>
                  </div>
                  <div>
                    <span className="form-label">Mobile Number</span>
                    <div style={{ fontSize: '14px' }}>{viewingGuard.phone}</div>
                  </div>
                  <div>
                    <span className="form-label">Official SGF Email</span>
                    <div style={{ fontSize: '14px' }}>{viewingGuard.email}</div>
                  </div>
                  <div>
                    <span className="form-label">Date of Joining</span>
                    <div style={{ fontSize: '14px' }}>{viewingGuard.dateOfJoining}</div>
                  </div>
                  <div>
                    <span className="form-label">Assigned Site</span>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-gold)' }}>
                      {viewingGuard.currentSiteName || 'Unassigned / Reserve Force'}
                    </div>
                  </div>
                  <div>
                    <span className="form-label">Shift Preference</span>
                    <div style={{ fontSize: '14px' }}>{viewingGuard.shiftPreference} Shift</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: KYC & Licenses */}
            {detailTab === 'documents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {viewingGuard.documents.map(doc => {
                  const isExpiringSoon = doc.expiryDate && new Date(doc.expiryDate) <= new Date(Date.now() + 30 * 86400000);

                  return (
                    <div 
                      key={doc.id}
                      style={{
                        padding: '14px',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isExpiringSoon ? 'var(--status-warning-border)' : 'var(--border-subtle)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FileText size={20} color={isExpiringSoon ? 'var(--status-warning)' : 'var(--brand-gold-400)'} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px' }}>{doc.type}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Doc #: {doc.docNumber} • Issued: {doc.issueDate}
                            {doc.expiryDate && ` • Expires: ${doc.expiryDate}`}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isExpiringSoon && (
                          <span className="badge badge-warning">
                            ⚠ Expiring in 8 days!
                          </span>
                        )}
                        <StatusBadge status={doc.verified ? 'Verified' : 'Pending'} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 3: Salary & Bank Structure */}
            {detailTab === 'salary' && (
              <div>
                <div className="card" style={{ marginBottom: '16px', background: 'var(--bg-subtle)' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Wage / Salary Structure (Monthly)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Basic Pay</div>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>₹{viewingGuard.salaryStructure.basic.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HRA</div>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>₹{viewingGuard.salaryStructure.hra.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Allowances</div>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>
                        ₹{(viewingGuard.salaryStructure.conveyance + viewingGuard.salaryStructure.specialAllowance).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OT Rate / Hour</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-info)' }}>
                        ₹{viewingGuard.salaryStructure.overtimeHourlyRate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ background: 'var(--bg-subtle)' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Bank Account Details (Restricted Access)</h4>
                  <div className="form-grid">
                    <div>
                      <span className="form-label">Bank Name</span>
                      <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{viewingGuard.bankDetails.bankName}</div>
                    </div>
                    <div>
                      <span className="form-label">Account Number</span>
                      <div style={{ fontSize: '13.5px', fontFamily: 'monospace' }}>{viewingGuard.bankDetails.accountNumber}</div>
                    </div>
                    <div>
                      <span className="form-label">IFSC Code</span>
                      <div style={{ fontSize: '13.5px', fontFamily: 'monospace' }}>{viewingGuard.bankDetails.ifsc}</div>
                    </div>
                    <div>
                      <span className="form-label">Beneficiary Holder</span>
                      <div style={{ fontSize: '13.5px' }}>{viewingGuard.bankDetails.holderName}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Uniform Issued */}
            {detailTab === 'uniform' && (
              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Issued Kit & Security Accessories</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {viewingGuard.uniformIssued.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>✓ {item}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Issued & Acknowledged</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Onboard Guard Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Onboard New Security Guard"
          subtitle="Register employee profile, category, wage structure, and verification"
          size="lg"
        >
          <form onSubmit={handleCreateGuard}>
            <div className="form-grid" style={{ marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label">Full Legal Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="e.g. Ramesh Kumar Yadav"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
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

              <div className="form-group">
                <label className="form-label">Guard Category *</label>
                <select 
                  className="form-control"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as GuardCategory })}
                >
                  <option value="Armed Guard">Armed Guard</option>
                  <option value="Security Supervisor">Security Supervisor</option>
                  <option value="Unarmed Guard">Unarmed Guard</option>
                  <option value="Bouncer">Bouncer</option>
                  <option value="Lady Guard">Lady Guard</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Rank / Designation</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Senior Guard"
                  value={formData.rank}
                  onChange={e => setFormData({ ...formData, rank: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Site Assignment</label>
                <select 
                  className="form-control"
                  value={formData.currentSiteId}
                  onChange={e => setFormData({ ...formData, currentSiteId: e.target.value })}
                >
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Police Verification Status</label>
                <select 
                  className="form-control"
                  value={formData.policeVerificationStatus}
                  onChange={e => setFormData({ ...formData, policeVerificationStatus: e.target.value as any })}
                >
                  <option value="Verified">Verified</option>
                  <option value="In Process">In Process</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Basic Monthly Wage (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.basicSalary}
                  onChange={e => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">HRA (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.hra}
                  onChange={e => setFormData({ ...formData, hra: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Overtime Rate / Hour (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={formData.overtimeRate}
                  onChange={e => setFormData({ ...formData, overtimeRate: Number(e.target.value) })}
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
                Save & Onboard Guard
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
