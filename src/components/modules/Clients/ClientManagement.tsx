import React, { useState } from 'react';
import { 
  Building2, MapPin, Plus, Search, Filter, 
  ExternalLink, Phone, Mail, Shield, CheckCircle, 
  Navigation, Crosshair 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { Client, Site } from '../../../types/erp';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

export const ClientManagement: React.FC = () => {
  const { clients, sites, addClient, addSite, t, addToast } = useERP();

  const [activeTab, setActiveTab] = useState<'clients' | 'sites'>('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientForSite, setSelectedClientForSite] = useState<string>('');

  // Modals
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [viewingSite, setViewingSite] = useState<Site | null>(null);

  // Form states
  const [clientForm, setClientForm] = useState({
    name: '',
    legalEntityName: '',
    industry: 'Commercial Real Estate',
    gstin: '',
    primaryContactName: '',
    email: '',
    phone: '',
    billingAddress: '',
    monthlyBilledAmount: 450000
  });

  const [siteForm, setSiteForm] = useState({
    clientId: clients[0]?.id || '',
    name: '',
    address: '',
    city: 'Gurugram',
    latitude: 28.4986,
    longitude: 77.0878,
    geofenceRadiusMeters: 180,
    requiredStrength: 16,
    supervisorName: 'Subedar Balwant Singh',
    supervisorPhone: '+91 98711 00112'
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSites = sites.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = !selectedClientForSite || s.clientId === selectedClientForSite;
    return matchesSearch && matchesClient;
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.primaryContactName) {
      addToast('warning', 'Validation Error', 'Company name and contact person are required.');
      return;
    }
    addClient(clientForm);
    setIsAddClientModalOpen(false);
    setClientForm({
      name: '',
      legalEntityName: '',
      industry: 'Commercial Real Estate',
      gstin: '',
      primaryContactName: '',
      email: '',
      phone: '',
      billingAddress: '',
      monthlyBilledAmount: 450000
    });
  };

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteForm.name || !siteForm.address) {
      addToast('warning', 'Validation Error', 'Site name and address are required.');
      return;
    }
    addSite(siteForm);
    setIsAddSiteModalOpen(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Building2 size={26} color="var(--brand-gold-400)" />
            {t('clients')}
          </h1>
          <p>
            Multi-client organization hierarchy, active sites, contract values, and GPS geofence parameters.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-secondary" onClick={() => setIsAddSiteModalOpen(true)}>
            <MapPin size={15} />
            <span>Add Facility / Site</span>
          </button>
          <button className="btn btn-gold" onClick={() => setIsAddClientModalOpen(true)}>
            <Plus size={16} />
            <span>Onboard Client</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          Contracted Clients ({clients.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sites' ? 'active' : ''}`}
          onClick={() => setActiveTab('sites')}
        >
          Guarded Sites & Geofences ({sites.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="table-container" style={{ marginBottom: '20px' }}>
        <div className="table-toolbar">
          <div className="table-search-input">
            <Search size={15} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder={activeTab === 'clients' ? "Search client name, GSTIN, code..." : "Search site name, city..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {activeTab === 'sites' && (
            <select 
              className="form-control"
              value={selectedClientForSite}
              onChange={e => setSelectedClientForSite(e.target.value)}
              style={{ width: '220px', height: '34px', fontSize: '12.5px' }}
            >
              <option value="">All Clients</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* View 1: Clients List */}
        {activeTab === 'clients' && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client Code</th>
                  <th>Company & Industry</th>
                  <th>GSTIN</th>
                  <th>Primary Contact</th>
                  <th>Active Sites</th>
                  <th>Monthly Billing</th>
                  <th>Outstanding AR</th>
                  <th>Contract Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)' }}>
                      {c.clientCode}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.industry}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                      {c.gstin}
                    </td>
                    <td>
                      <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{c.primaryContactName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.phone} • {c.email}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {c.activeSitesCount} Sites
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      ₹{c.monthlyBilledAmount.toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600, color: c.totalOutstanding > 0 ? 'var(--status-warning-fg)' : 'var(--status-success)' }}>
                      ₹{c.totalOutstanding.toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge status={c.contractStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View 2: Guarded Sites & Geofences */}
        {activeTab === 'sites' && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Site Name</th>
                  <th>Client</th>
                  <th>City / Address</th>
                  <th>GPS Coordinates</th>
                  <th>Geofence Radius</th>
                  <th>Strength (Assigned / Req.)</th>
                  <th>Site Supervisor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map(s => {
                  const isShortage = s.assignedGuardsCount < s.requiredStrength;

                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin size={15} color="var(--brand-gold-400)" />
                          <span>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '12.5px' }}>{s.clientName}</td>
                      <td>
                        <div style={{ fontSize: '12.5px' }}>{s.city}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.address}</div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                      </td>
                      <td>
                        <span style={{ 
                          fontSize: '11.5px', 
                          fontWeight: 700, 
                          padding: '2px 8px', 
                          borderRadius: 'var(--radius-full)', 
                          background: 'var(--status-info-bg)', 
                          color: 'var(--status-info-fg)' 
                        }}>
                          {s.geofenceRadiusMeters} meters
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: isShortage ? 'var(--status-warning-fg)' : 'var(--status-success)' }}>
                          {s.assignedGuardsCount} / {s.requiredStrength} Guards
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{s.supervisorName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.supervisorPhone}</div>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setViewingSite(s)}
                          title="Inspect Geofence Map Context"
                        >
                          <Crosshair size={13} />
                          <span>Geofence</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Geofence Map Context Modal */}
      {viewingSite && (
        <Modal
          isOpen={true}
          onClose={() => setViewingSite(null)}
          title={`Geofence Configuration: ${viewingSite.name}`}
          subtitle={`Radius: ${viewingSite.geofenceRadiusMeters}m • Required Strength: ${viewingSite.requiredStrength} guards`}
          size="lg"
        >
          <div>
            {/* Simulated Interactive Geofence Map Radar View */}
            <div style={{
              height: '240px',
              borderRadius: 'var(--radius-lg)',
              background: 'radial-gradient(circle at center, #1c2541 0%, #0b132b 80%)',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              {/* Geofence concentric radius rings */}
              <div style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '2px dashed #f59e0b',
                background: 'rgba(245, 158, 11, 0.08)',
                animation: 'pulse-subtle 3s infinite'
              }} />
              <div style={{
                position: 'absolute',
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                border: '1px solid rgba(245, 158, 11, 0.4)'
              }} />

              {/* Center Pin */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px #f59e0b'
                }}>
                  <Shield size={18} />
                </div>
                <div style={{
                  marginTop: '6px',
                  background: 'rgba(11, 19, 43, 0.85)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#ffffff'
                }}>
                  {viewingSite.name}
                </div>
              </div>

              {/* Map coordinates overlay tag */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '14px',
                fontSize: '11px',
                color: '#94a3b8',
                fontFamily: 'monospace'
              }}>
                Lat: {viewingSite.latitude.toFixed(6)} | Lng: {viewingSite.longitude.toFixed(6)} | Precision: ±5m
              </div>
            </div>

            <div className="form-grid">
              <div>
                <span className="form-label">Full Site Address</span>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{viewingSite.address}, {viewingSite.city}</div>
              </div>
              <div>
                <span className="form-label">Site Supervisor</span>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{viewingSite.supervisorName} ({viewingSite.supervisorPhone})</div>
              </div>
              <div>
                <span className="form-label">Emergency Control Room</span>
                <div style={{ fontSize: '13px', color: 'var(--status-danger-fg)', fontWeight: 600 }}>{viewingSite.emergencyContact}</div>
              </div>
              <div>
                <span className="form-label">Geofence Compliance Rule</span>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Punches within {viewingSite.geofenceRadiusMeters}m automatically verified. Punches outside require supervisor sign-off.
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Onboard Client Modal */}
      {isAddClientModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddClientModalOpen(false)}
          title="Onboard New Corporate Client"
          subtitle="Register client entity, billing details, and GSTIN"
          size="lg"
        >
          <form onSubmit={handleCreateClient}>
            <div className="form-grid" style={{ marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label">Trading / Brand Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="e.g. DLF CyberCity Developers"
                  value={clientForm.name}
                  onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Legal Registered Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. DLF CyberCity Pvt Ltd"
                  value={clientForm.legalEntityName}
                  onChange={e => setClientForm({ ...clientForm, legalEntityName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Industry *</label>
                <select 
                  className="form-control"
                  value={clientForm.industry}
                  onChange={e => setClientForm({ ...clientForm, industry: e.target.value })}
                >
                  <option>Commercial IT Park</option>
                  <option>Retail & Hospitality</option>
                  <option>Healthcare & Hospitals</option>
                  <option>Technology Campus</option>
                  <option>Luxury Residential</option>
                  <option>Manufacturing & Industrial</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN (15 Digits)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="07AAACD1234F1Z5"
                  value={clientForm.gstin}
                  onChange={e => setClientForm({ ...clientForm, gstin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Contact Person *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="e.g. Col. Rajiv Mathur"
                  value={clientForm.primaryContactName}
                  onChange={e => setClientForm({ ...clientForm, primaryContactName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="+91 98XXX XXXXX"
                  value={clientForm.phone}
                  onChange={e => setClientForm({ ...clientForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="security.admin@client.com"
                  value={clientForm.email}
                  onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Monthly Contract (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={clientForm.monthlyBilledAmount}
                  onChange={e => setClientForm({ ...clientForm, monthlyBilledAmount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsAddClientModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Save & Onboard Client
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Site Modal */}
      {isAddSiteModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddSiteModalOpen(false)}
          title="Add Guarded Site / Facility"
          subtitle="Configure geofence coordinates and post requirements"
          size="lg"
        >
          <form onSubmit={handleCreateSite}>
            <div className="form-grid" style={{ marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label">Client *</label>
                <select 
                  className="form-control"
                  value={siteForm.clientId}
                  onChange={e => setSiteForm({ ...siteForm, clientId: e.target.value })}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Site / Facility Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="e.g. Tower C Corporate Plaza"
                  value={siteForm.name}
                  onChange={e => setSiteForm({ ...siteForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={siteForm.city}
                  onChange={e => setSiteForm({ ...siteForm, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="Plot 14, Sector 25"
                  value={siteForm.address}
                  onChange={e => setSiteForm({ ...siteForm, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Geofence Radius (Meters) *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={siteForm.geofenceRadiusMeters}
                  onChange={e => setSiteForm({ ...siteForm, geofenceRadiusMeters: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Required Guard Strength *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={siteForm.requiredStrength}
                  onChange={e => setSiteForm({ ...siteForm, requiredStrength: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsAddSiteModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Create & Save Site
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
