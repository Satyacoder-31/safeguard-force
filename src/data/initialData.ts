// Safe Guard Force ERP - Realistic Master Datasets (Indian Market)

import { 
  Guard, Client, Site, Contract, ShiftRoster, AttendanceRecord, 
  PatrolLog, Incident, SOSAlert, RecruitmentCandidate, LeaveRequest, 
  UniformItem, PayrollRun, ClientInvoice, PaymentReceipt, CRMLead, 
  ClientComplaint, SystemMasterItem, IntegrationStatus 
} from '../types/erp';

export const initialClients: Client[] = [
  {
    id: 'cl-1',
    clientCode: 'SGF-CL-001',
    name: 'DLF CyberCity Developers',
    legalEntityName: 'DLF CyberCity Pvt Ltd',
    industry: 'Commercial IT Park',
    gstin: '07AAACD1234F1Z5',
    primaryContactName: 'Col. Rajiv Mathur (Retd.)',
    email: 'security.admin@dlfcybercity.com',
    phone: '+91 98112 34567',
    billingAddress: 'DLF Cyber City, Tower 10, Sector 24, Gurugram, Haryana 122002',
    contractStatus: 'Active',
    activeSitesCount: 2,
    monthlyBilledAmount: 840000,
    totalOutstanding: 168000
  },
  {
    id: 'cl-2',
    clientCode: 'SGF-CL-002',
    name: 'Phoenix Marketcity Mall',
    legalEntityName: 'Phoenix Mills Retail Ltd',
    industry: 'Retail & Hospitality',
    gstin: '27AAACP5678B1Z2',
    primaryContactName: 'Anil Deshmukh (VP Ops)',
    email: 'facilities@phoenixmarketcity.in',
    phone: '+91 98201 87654',
    billingAddress: 'LBS Marg, Kurla West, Mumbai, Maharashtra 400070',
    contractStatus: 'Active',
    activeSitesCount: 2,
    monthlyBilledAmount: 920000,
    totalOutstanding: 230000
  },
  {
    id: 'cl-3',
    clientCode: 'SGF-CL-003',
    name: 'Max Super Speciality Hospital',
    legalEntityName: 'Max Healthcare Institute Ltd',
    industry: 'Healthcare & Hospitals',
    gstin: '07AABCM9012C1Z8',
    primaryContactName: 'Dr. S. K. Narang',
    email: 'admin.saket@maxhealthcare.com',
    phone: '+91 98100 45678',
    billingAddress: '1, 2, Press Enclave Marg, Saket, New Delhi 110017',
    contractStatus: 'Active',
    activeSitesCount: 1,
    monthlyBilledAmount: 650000,
    totalOutstanding: 0
  },
  {
    id: 'cl-4',
    clientCode: 'SGF-CL-004',
    name: 'Infosys Knowledge City',
    legalEntityName: 'Infosys BPM Limited',
    industry: 'Technology Campus',
    gstin: '29AAACI3456D1Z1',
    primaryContactName: 'Praveen Rao',
    email: 'campus.security@infosys.com',
    phone: '+91 98450 11223',
    billingAddress: 'Electronic City, Hosur Road, Bengaluru, Karnataka 560100',
    contractStatus: 'Expiring',
    activeSitesCount: 1,
    monthlyBilledAmount: 720000,
    totalOutstanding: 360000
  },
  {
    id: 'cl-5',
    clientCode: 'SGF-CL-005',
    name: 'Godrej Prime One Towers',
    legalEntityName: 'Godrej Properties Ltd',
    industry: 'Luxury Residential',
    gstin: '27AAACG7890E1Z9',
    primaryContactName: 'Ramesh Shenoy',
    email: 'society.sec@godrejprime.com',
    phone: '+91 98210 99887',
    billingAddress: 'Eastern Express Highway, Vikhroli, Mumbai 400079',
    contractStatus: 'Active',
    activeSitesCount: 1,
    monthlyBilledAmount: 350000,
    totalOutstanding: 112000
  }
];

export const initialSites: Site[] = [
  {
    id: 'st-1',
    clientId: 'cl-1',
    clientName: 'DLF CyberCity Developers',
    name: 'DLF CyberCity - Tower 10A & 10B',
    address: 'Sector 24, Cyber City Phase 2, Gurugram, Haryana',
    city: 'Gurugram',
    latitude: 28.4986,
    longitude: 77.0878,
    geofenceRadiusMeters: 180,
    requiredStrength: 24,
    assignedGuardsCount: 24,
    supervisorName: 'Subedar Balwant Singh',
    supervisorPhone: '+91 98711 00112',
    emergencyContact: '0124-4567890',
    status: 'Active'
  },
  {
    id: 'st-2',
    clientId: 'cl-1',
    clientName: 'DLF CyberCity Developers',
    name: 'DLF CyberHub Central Plaza',
    address: 'DLF Phase 2, Sector 25, Gurugram, Haryana',
    city: 'Gurugram',
    latitude: 28.4950,
    longitude: 77.0890,
    geofenceRadiusMeters: 200,
    requiredStrength: 18,
    assignedGuardsCount: 16, // Shortage of 2
    supervisorName: 'Subedar Balwant Singh',
    supervisorPhone: '+91 98711 00112',
    emergencyContact: '0124-4567891',
    status: 'Active'
  },
  {
    id: 'st-3',
    clientId: 'cl-2',
    clientName: 'Phoenix Marketcity Mall',
    name: 'Phoenix Mall - Main Atrium & Gates',
    address: 'LBS Marg, Kurla West, Mumbai',
    city: 'Mumbai',
    latitude: 19.0864,
    longitude: 72.8890,
    geofenceRadiusMeters: 250,
    requiredStrength: 32,
    assignedGuardsCount: 32,
    supervisorName: 'Havildar Suresh Patil',
    supervisorPhone: '+91 98200 44332',
    emergencyContact: '022-61801100',
    status: 'Active'
  },
  {
    id: 'st-4',
    clientId: 'cl-2',
    clientName: 'Phoenix Marketcity Mall',
    name: 'Phoenix Mall - Multi-Level Parking',
    address: 'North Parking Wing, Kurla West, Mumbai',
    city: 'Mumbai',
    latitude: 19.0872,
    longitude: 72.8898,
    geofenceRadiusMeters: 150,
    requiredStrength: 14,
    assignedGuardsCount: 14,
    supervisorName: 'Havildar Suresh Patil',
    supervisorPhone: '+91 98200 44332',
    emergencyContact: '022-61801101',
    status: 'Active'
  },
  {
    id: 'st-5',
    clientId: 'cl-3',
    clientName: 'Max Super Speciality Hospital',
    name: 'Max Saket - Emergency & Trauma Wing',
    address: '1, 2, Press Enclave Marg, Saket, New Delhi',
    city: 'New Delhi',
    latitude: 28.5273,
    longitude: 77.2159,
    geofenceRadiusMeters: 120,
    requiredStrength: 20,
    assignedGuardsCount: 20,
    supervisorName: 'Deepak Verma',
    supervisorPhone: '+91 98119 55667',
    emergencyContact: '011-26515050',
    status: 'Active'
  },
  {
    id: 'st-6',
    clientId: 'cl-4',
    clientName: 'Infosys Knowledge City',
    name: 'Infosys Campus Main Gate & IT Block',
    address: 'Electronics City Phase 1, Hosur Road, Bengaluru',
    city: 'Bengaluru',
    latitude: 12.8452,
    longitude: 77.6602,
    geofenceRadiusMeters: 300,
    requiredStrength: 28,
    assignedGuardsCount: 26, // Shortage of 2
    supervisorName: 'K. R. Venkatraman',
    supervisorPhone: '+91 98455 77889',
    emergencyContact: '080-28520261',
    status: 'Active'
  },
  {
    id: 'st-7',
    clientId: 'cl-5',
    clientName: 'Godrej Prime One Towers',
    name: 'Godrej Prime Residence - Gates 1 & 2',
    address: 'Vikhroli East, Mumbai',
    city: 'Mumbai',
    latitude: 19.0988,
    longitude: 72.9272,
    geofenceRadiusMeters: 160,
    requiredStrength: 14,
    assignedGuardsCount: 14,
    supervisorName: 'Pradeep Rawat',
    supervisorPhone: '+91 98330 66778',
    emergencyContact: '022-25188000',
    status: 'Active'
  }
];

export const initialGuards: Guard[] = [
  {
    id: 'gd-1',
    guardIdNumber: 'SGF-GD-101',
    name: 'Vikram Singh Shekhawat',
    nameHi: 'विक्रम सिंह शेखावत',
    phone: '+91 98101 23456',
    email: 'vikram.singh@sgf.in',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    category: 'Armed Guard',
    rank: 'Head Guard (Ex-Serviceman)',
    dateOfJoining: '2022-03-15',
    status: 'Active',
    kycStatus: 'Verified',
    policeVerificationStatus: 'Verified',
    currentSiteId: 'st-1',
    currentSiteName: 'DLF CyberCity - Tower 10A & 10B',
    shiftPreference: 'Morning',
    bankDetails: {
      accountNumber: '••••••••4812',
      ifsc: 'SBIN0001234',
      bankName: 'State Bank of India',
      holderName: 'Vikram Singh'
    },
    salaryStructure: {
      basic: 18500,
      hra: 4500,
      conveyance: 1800,
      specialAllowance: 1200,
      overtimeHourlyRate: 145
    },
    documents: [
      { id: 'doc-1', type: 'Aadhaar', docNumber: '••••-••••-9812', issueDate: '2016-04-10', verified: true },
      { id: 'doc-2', type: 'Gun License', docNumber: 'GL-HR-2018-994', issueDate: '2020-01-15', expiryDate: '2026-10-23', verified: true }, // Expiring in 8 days!
      { id: 'doc-3', type: 'Police Verification', docNumber: 'PV-GUR-2023-881', issueDate: '2023-03-10', expiryDate: '2027-03-10', verified: true }
    ],
    uniformIssued: ['2 Safari Shirts', '2 Trousers', '1 Security Cap', '1 Belt', '1 Pair DMS Boots']
  },
  {
    id: 'gd-2',
    guardIdNumber: 'SGF-GD-102',
    name: 'Balwant Singh Rathore',
    nameHi: 'बलवंत सिंह राठौर',
    phone: '+91 98711 00112',
    email: 'balwant.rathore@sgf.in',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    category: 'Security Supervisor',
    rank: 'Site Security Supervisor',
    dateOfJoining: '2021-08-01',
    status: 'Active',
    kycStatus: 'Verified',
    policeVerificationStatus: 'Verified',
    currentSiteId: 'st-1',
    currentSiteName: 'DLF CyberCity - Tower 10A & 10B',
    shiftPreference: 'Morning',
    bankDetails: {
      accountNumber: '••••••••7731',
      ifsc: 'PUNB0123400',
      bankName: 'Punjab National Bank',
      holderName: 'Balwant Singh'
    },
    salaryStructure: {
      basic: 22000,
      hra: 5500,
      conveyance: 2500,
      specialAllowance: 2000,
      overtimeHourlyRate: 180
    },
    documents: [
      { id: 'doc-4', type: 'Aadhaar', docNumber: '••••-••••-4421', issueDate: '2015-06-20', verified: true },
      { id: 'doc-5', type: 'Training Certificate', docNumber: 'SGF-TC-2021', issueDate: '2021-08-01', verified: true },
      { id: 'doc-6', type: 'Police Verification', docNumber: 'PV-GUR-2022-312', issueDate: '2022-08-05', verified: true }
    ],
    uniformIssued: ['3 Formal Shirts', '3 Trousers', '1 Supervisor Blazer', '1 Whistle Cord', '1 Pair Oxford Shoes']
  },
  {
    id: 'gd-3',
    guardIdNumber: 'SGF-GD-103',
    name: 'Sunita Devi Yadav',
    nameHi: 'सुनीता देवी यादव',
    phone: '+91 98115 67890',
    email: 'sunita.yadav@sgf.in',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    category: 'Lady Guard',
    rank: 'Security Guard (Frisking & Access)',
    dateOfJoining: '2023-01-10',
    status: 'Active',
    kycStatus: 'Verified',
    policeVerificationStatus: 'Verified',
    currentSiteId: 'st-1',
    currentSiteName: 'DLF CyberCity - Tower 10A & 10B',
    shiftPreference: 'Morning',
    bankDetails: {
      accountNumber: '••••••••1199',
      ifsc: 'HDFC0000456',
      bankName: 'HDFC Bank',
      holderName: 'Sunita Devi'
    },
    salaryStructure: {
      basic: 16500,
      hra: 4000,
      conveyance: 1500,
      specialAllowance: 1000,
      overtimeHourlyRate: 130
    },
    documents: [
      { id: 'doc-7', type: 'Aadhaar', docNumber: '••••-••••-7788', issueDate: '2018-09-12', verified: true },
      { id: 'doc-8', type: 'Police Verification', docNumber: 'PV-DEL-2023-109', issueDate: '2023-01-05', verified: true }
    ],
    uniformIssued: ['2 Lady Uniform Sets', '1 Female Beret', '1 Handheld Metal Detector']
  },
  {
    id: 'gd-4',
    guardIdNumber: 'SGF-GD-104',
    name: 'Rajesh Kumar Meena',
    nameHi: 'राजेश कुमार मीणा',
    phone: '+91 98290 12345',
    email: 'rajesh.meena@sgf.in',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    category: 'Unarmed Guard',
    rank: 'Static Post Guard',
    dateOfJoining: '2023-05-18',
    status: 'Active',
    kycStatus: 'Verified',
    policeVerificationStatus: 'Verified',
    currentSiteId: 'st-2',
    currentSiteName: 'DLF CyberHub Central Plaza',
    shiftPreference: 'Evening',
    bankDetails: {
      accountNumber: '••••••••6543',
      ifsc: 'BARB0DELHI',
      bankName: 'Bank of Baroda',
      holderName: 'Rajesh Kumar'
    },
    salaryStructure: {
      basic: 15000,
      hra: 3500,
      conveyance: 1500,
      specialAllowance: 800,
      overtimeHourlyRate: 120
    },
    documents: [
      { id: 'doc-9', type: 'Aadhaar', docNumber: '••••-••••-3321', issueDate: '2017-02-14', verified: true },
      { id: 'doc-10', type: 'Police Verification', docNumber: 'PV-RAJ-2023-455', issueDate: '2023-05-02', verified: true }
    ],
    uniformIssued: ['2 Security Shirts', '2 Trousers', '1 Cap', '1 Lanyard & Whistle']
  },
  {
    id: 'gd-5',
    guardIdNumber: 'SGF-GD-105',
    name: 'Gurpreet Singh Randhawa',
    nameHi: 'गुरप्रीत सिंह रंधावा',
    phone: '+91 98140 98765',
    email: 'gurpreet.singh@sgf.in',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    category: 'Bouncer',
    rank: 'VIP Protection & Crowd Marshall',
    dateOfJoining: '2022-11-01',
    status: 'Active',
    kycStatus: 'Verified',
    policeVerificationStatus: 'Verified',
    currentSiteId: 'st-3',
    currentSiteName: 'Phoenix Mall - Main Atrium & Gates',
    shiftPreference: 'Evening',
    bankDetails: {
      accountNumber: '••••••••9012',
      ifsc: 'ICIC0000104',
      bankName: 'ICICI Bank',
      holderName: 'Gurpreet Singh'
    },
    salaryStructure: {
      basic: 21000,
      hra: 5000,
      conveyance: 2000,
      specialAllowance: 2500,
      overtimeHourlyRate: 175
    },
    documents: [
      { id: 'doc-11', type: 'Aadhaar', docNumber: '••••-••••-6654', issueDate: '2014-11-20', verified: true },
      { id: 'doc-12', type: 'Police Verification', docNumber: 'PV-PUN-2022-901', issueDate: '2022-10-25', verified: true }
    ],
    uniformIssued: ['3 Black Tactical Polos', '2 Tactical Cargo Trousers', '1 Heavy Duty Duty Belt']
  },
  {
    id: 'gd-6',
    guardIdNumber: 'SGF-GD-106',
    name: 'Suresh Patil',
    nameHi: 'सुरेश पाटिल',
    phone: '+91 98200 44332',
    email: 'suresh.patil@sgf.in',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    category: 'Security Supervisor',
    rank: 'Area Security Supervisor',
    dateOfJoining: '2020-04-12',
    status: 'Active',
    kycStatus: 'Verified',
    policeVerificationStatus: 'Verified',
    currentSiteId: 'st-3',
    currentSiteName: 'Phoenix Mall - Main Atrium & Gates',
    shiftPreference: 'Morning',
    bankDetails: {
      accountNumber: '••••••••3421',
      ifsc: 'MAHB0000234',
      bankName: 'Bank of Maharashtra',
      holderName: 'Suresh Patil'
    },
    salaryStructure: {
      basic: 23000,
      hra: 6000,
      conveyance: 2500,
      specialAllowance: 2000,
      overtimeHourlyRate: 190
    },
    documents: [
      { id: 'doc-13', type: 'Aadhaar', docNumber: '••••-••••-8812', issueDate: '2015-01-10', verified: true },
      { id: 'doc-14', type: 'Police Verification', docNumber: 'PV-MUM-2023-772', issueDate: '2023-04-15', verified: true }
    ],
    uniformIssued: ['3 Uniform Shirts', '3 Trousers', '1 Supervisor Cap', '1 Walkie-Talkie Holster']
  },
  {
    id: 'gd-7',
    guardIdNumber: 'SGF-GD-107',
    name: 'Deepak Verma',
    nameHi: 'दीपक वर्मा',
    phone: '+91 98119 55667',
    email: 'deepak.verma@sgf.in',
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    category: 'Security Supervisor',
    rank: 'Hospital Wing Supervisor',
    dateOfJoining: '2021-09-15',
    status: 'Active',
    kycStatus: 'Verified',
    policeVerificationStatus: 'Verified',
    currentSiteId: 'st-5',
    currentSiteName: 'Max Saket - Emergency & Trauma Wing',
    shiftPreference: 'Morning',
    bankDetails: {
      accountNumber: '••••••••6781',
      ifsc: 'SBIN0004567',
      bankName: 'State Bank of India',
      holderName: 'Deepak Verma'
    },
    salaryStructure: {
      basic: 21500,
      hra: 5200,
      conveyance: 2000,
      specialAllowance: 1800,
      overtimeHourlyRate: 175
    },
    documents: [
      { id: 'doc-15', type: 'Aadhaar', docNumber: '••••-••••-9901', issueDate: '2016-08-11', verified: true },
      { id: 'doc-16', type: 'Police Verification', docNumber: 'PV-DEL-2022-441', issueDate: '2022-09-10', verified: true }
    ],
    uniformIssued: ['3 White Hospital Security Shirts', '3 Navy Trousers', '1 Badge']
  },
  {
    id: 'gd-8',
    guardIdNumber: 'SGF-GD-108',
    name: 'Kavita Shinde',
    nameHi: 'कविता शिंदे',
    phone: '+91 98205 66778',
    email: 'kavita.shinde@sgf.in',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    category: 'Lady Guard',
    rank: 'Female Access Control Guard',
    dateOfJoining: '2023-07-20',
    status: 'Active',
    kycStatus: 'Verified',
    policeVerificationStatus: 'In Process', // Document alert
    currentSiteId: 'st-3',
    currentSiteName: 'Phoenix Mall - Main Atrium & Gates',
    shiftPreference: 'Morning',
    bankDetails: {
      accountNumber: '••••••••4512',
      ifsc: 'AXIS0000891',
      bankName: 'Axis Bank',
      holderName: 'Kavita Shinde'
    },
    salaryStructure: {
      basic: 16500,
      hra: 4000,
      conveyance: 1500,
      specialAllowance: 1000,
      overtimeHourlyRate: 130
    },
    documents: [
      { id: 'doc-17', type: 'Aadhaar', docNumber: '••••-••••-2244', issueDate: '2019-03-12', verified: true }
    ],
    uniformIssued: ['2 Uniform Sets', '1 Female Beret']
  },
  {
    id: 'gd-9',
    guardIdNumber: 'SGF-GD-109',
    name: 'Manoj Tiwari',
    nameHi: 'मनोज तिवारी',
    phone: '+91 98188 33445',
    email: 'manoj.tiwari@sgf.in',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    category: 'Unarmed Guard',
    rank: 'Patrol Guard',
    dateOfJoining: '2024-02-01',
    status: 'Active',
    kycStatus: 'Pending',
    policeVerificationStatus: 'Pending',
    currentSiteId: 'st-5',
    currentSiteName: 'Max Saket - Emergency & Trauma Wing',
    shiftPreference: 'Night',
    bankDetails: {
      accountNumber: '••••••••7890',
      ifsc: 'CNRB0001290',
      bankName: 'Canara Bank',
      holderName: 'Manoj Tiwari'
    },
    salaryStructure: {
      basic: 15000,
      hra: 3500,
      conveyance: 1500,
      specialAllowance: 800,
      overtimeHourlyRate: 120
    },
    documents: [
      { id: 'doc-18', type: 'Aadhaar', docNumber: '••••-••••-9012', issueDate: '2020-05-18', verified: false }
    ],
    uniformIssued: ['2 Security Shirts', '2 Trousers', '1 Flashlight']
  },
  {
    id: 'gd-10',
    guardIdNumber: 'SGF-GD-110',
    name: 'Amitabh Sen',
    nameHi: 'अमिताभ सेन',
    phone: '+91 98300 77889',
    email: 'amitabh.sen@sgf.in',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    category: 'Armed Guard',
    rank: 'Senior Armed Escort',
    dateOfJoining: '2021-12-10',
    status: 'On Leave',
    kycStatus: 'Verified',
    policeVerificationStatus: 'Verified',
    currentSiteId: 'st-6',
    currentSiteName: 'Infosys Campus Main Gate & IT Block',
    shiftPreference: 'Morning',
    bankDetails: {
      accountNumber: '••••••••1234',
      ifsc: 'UTIB0000456',
      bankName: 'Axis Bank',
      holderName: 'Amitabh Sen'
    },
    salaryStructure: {
      basic: 19000,
      hra: 4800,
      conveyance: 1800,
      specialAllowance: 1500,
      overtimeHourlyRate: 150
    },
    documents: [
      { id: 'doc-19', type: 'Aadhaar', docNumber: '••••-••••-3412', issueDate: '2015-07-22', verified: true },
      { id: 'doc-20', type: 'Gun License', docNumber: 'GL-KAR-2020-112', issueDate: '2020-03-10', expiryDate: '2028-03-10', verified: true }
    ],
    uniformIssued: ['2 Safari Suits', '1 Holster', '1 Ammo Pouch']
  }
];

export const initialContracts: Contract[] = [
  {
    id: 'ct-1',
    contractNumber: 'SGF-CT-2025-081',
    clientId: 'cl-1',
    clientName: 'DLF CyberCity Developers',
    title: 'Integrated Security Services - DLF CyberCity Phase 2',
    startDate: '2025-04-01',
    endDate: '2027-03-31',
    renewalDate: '2027-02-15',
    status: 'Active',
    siteIds: ['st-1', 'st-2'],
    rates: [
      { category: 'Security Supervisor', requiredCount: 4, ratePerMonth: 28500, otRatePerHour: 220 },
      { category: 'Armed Guard', requiredCount: 6, ratePerMonth: 24000, otRatePerHour: 180 },
      { category: 'Unarmed Guard', requiredCount: 26, ratePerMonth: 18500, otRatePerHour: 140 },
      { category: 'Lady Guard', requiredCount: 6, ratePerMonth: 19500, otRatePerHour: 150 }
    ],
    serviceFeePercent: 10,
    gstRatePercent: 18,
    billingFrequency: 'Monthly',
    totalMonthlyValue: 840000
  },
  {
    id: 'ct-2',
    contractNumber: 'SGF-CT-2025-094',
    clientId: 'cl-2',
    clientName: 'Phoenix Marketcity Mall',
    title: 'Mall Perimeter & Crowd Management Contract',
    startDate: '2025-06-01',
    endDate: '2026-11-30', // Expiring in 45 days!
    renewalDate: '2026-10-15',
    status: 'Expiring',
    siteIds: ['st-3', 'st-4'],
    rates: [
      { category: 'Security Supervisor', requiredCount: 6, ratePerMonth: 30000, otRatePerHour: 230 },
      { category: 'Bouncer', requiredCount: 10, ratePerMonth: 26500, otRatePerHour: 200 },
      { category: 'Unarmed Guard', requiredCount: 22, ratePerMonth: 18500, otRatePerHour: 140 },
      { category: 'Lady Guard', requiredCount: 8, ratePerMonth: 19500, otRatePerHour: 150 }
    ],
    serviceFeePercent: 10,
    gstRatePercent: 18,
    billingFrequency: 'Monthly',
    totalMonthlyValue: 920000
  },
  {
    id: 'ct-3',
    contractNumber: 'SGF-CT-2026-012',
    clientId: 'cl-3',
    clientName: 'Max Super Speciality Hospital',
    title: 'Hospital Ward & Emergency Wing Security',
    startDate: '2026-01-01',
    endDate: '2028-12-31',
    renewalDate: '2028-11-01',
    status: 'Active',
    siteIds: ['st-5'],
    rates: [
      { category: 'Security Supervisor', requiredCount: 3, ratePerMonth: 29000, otRatePerHour: 220 },
      { category: 'Unarmed Guard', requiredCount: 14, ratePerMonth: 18500, otRatePerHour: 140 },
      { category: 'Lady Guard', requiredCount: 3, ratePerMonth: 19500, otRatePerHour: 150 }
    ],
    serviceFeePercent: 10,
    gstRatePercent: 18,
    billingFrequency: 'Monthly',
    totalMonthlyValue: 650000
  }
];

export const initialShifts: ShiftRoster[] = [
  {
    id: 'rf-1',
    siteId: 'st-1',
    siteName: 'DLF CyberCity - Tower 10A & 10B',
    date: '2026-10-15',
    shiftType: 'Morning',
    timing: '06:00 - 14:00',
    requiredGuards: 8,
    assignedGuardIds: ['gd-1', 'gd-2', 'gd-3'],
    assignedGuards: [
      { id: 'gd-1', name: 'Vikram Singh Shekhawat', category: 'Armed Guard' },
      { id: 'gd-2', name: 'Balwant Singh Rathore', category: 'Security Supervisor' },
      { id: 'gd-3', name: 'Sunita Devi Yadav', category: 'Lady Guard' }
    ],
    status: 'Fully Staffed'
  },
  {
    id: 'rf-2',
    siteId: 'st-2',
    siteName: 'DLF CyberHub Central Plaza',
    date: '2026-10-15',
    shiftType: 'Evening',
    timing: '14:00 - 22:00',
    requiredGuards: 6,
    assignedGuardIds: ['gd-4'],
    assignedGuards: [
      { id: 'gd-4', name: 'Rajesh Kumar Meena', category: 'Unarmed Guard' }
    ],
    status: 'Shortage', // Vacancy alert!
    notes: '2 Vacancies awaiting reliever assignment'
  },
  {
    id: 'rf-3',
    siteId: 'st-3',
    siteName: 'Phoenix Mall - Main Atrium & Gates',
    date: '2026-10-15',
    shiftType: 'Morning',
    timing: '06:00 - 14:00',
    requiredGuards: 10,
    assignedGuardIds: ['gd-5', 'gd-6', 'gd-8'],
    assignedGuards: [
      { id: 'gd-5', name: 'Gurpreet Singh Randhawa', category: 'Bouncer' },
      { id: 'gd-6', name: 'Suresh Patil', category: 'Security Supervisor' },
      { id: 'gd-8', name: 'Kavita Shinde', category: 'Lady Guard' }
    ],
    status: 'Fully Staffed'
  },
  {
    id: 'rf-4',
    siteId: 'st-5',
    siteName: 'Max Saket - Emergency & Trauma Wing',
    date: '2026-10-15',
    shiftType: 'Night',
    timing: '22:00 - 06:00',
    requiredGuards: 6,
    assignedGuardIds: ['gd-7', 'gd-9'],
    assignedGuards: [
      { id: 'gd-7', name: 'Deepak Verma', category: 'Security Supervisor' },
      { id: 'gd-9', name: 'Manoj Tiwari', category: 'Unarmed Guard' }
    ],
    status: 'Fully Staffed'
  }
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    guardId: 'gd-1',
    guardName: 'Vikram Singh Shekhawat',
    siteId: 'st-1',
    siteName: 'DLF CyberCity - Tower 10A & 10B',
    date: '2026-10-15',
    shiftType: 'Morning',
    punchInTime: '05:54 AM',
    gpsLat: 28.4987,
    gpsLng: 77.0879,
    isInsideGeofence: true,
    distanceFromSiteMeters: 22,
    status: 'Present',
    supervisorVerified: true
  },
  {
    id: 'att-2',
    guardId: 'gd-2',
    guardName: 'Balwant Singh Rathore',
    siteId: 'st-1',
    siteName: 'DLF CyberCity - Tower 10A & 10B',
    date: '2026-10-15',
    shiftType: 'Morning',
    punchInTime: '05:48 AM',
    gpsLat: 28.4986,
    gpsLng: 77.0877,
    isInsideGeofence: true,
    distanceFromSiteMeters: 14,
    status: 'Present',
    supervisorVerified: true
  },
  {
    id: 'att-3',
    guardId: 'gd-3',
    guardName: 'Sunita Devi Yadav',
    siteId: 'st-1',
    siteName: 'DLF CyberCity - Tower 10A & 10B',
    date: '2026-10-15',
    shiftType: 'Morning',
    punchInTime: '06:14 AM',
    gpsLat: 28.4985,
    gpsLng: 77.0876,
    isInsideGeofence: true,
    distanceFromSiteMeters: 35,
    status: 'Late', // Marked as Late
    supervisorVerified: true
  },
  {
    id: 'att-4',
    guardId: 'gd-4',
    guardName: 'Rajesh Kumar Meena',
    siteId: 'st-2',
    siteName: 'DLF CyberHub Central Plaza',
    date: '2026-10-15',
    shiftType: 'Evening',
    punchInTime: '13:50 PM',
    gpsLat: 28.5020, // Outside geofence!
    gpsLng: 77.0910,
    isInsideGeofence: false,
    distanceFromSiteMeters: 840,
    status: 'Late',
    supervisorVerified: false,
    verificationNotes: 'GPS Exception: Punch located 840m outside geofence boundary. Supervisor review pending.'
  },
  {
    id: 'att-5',
    guardId: 'gd-6',
    guardName: 'Suresh Patil',
    siteId: 'st-3',
    siteName: 'Phoenix Mall - Main Atrium & Gates',
    date: '2026-10-15',
    shiftType: 'Morning',
    punchInTime: '05:50 AM',
    gpsLat: 19.0865,
    gpsLng: 72.8891,
    isInsideGeofence: true,
    distanceFromSiteMeters: 18,
    status: 'Present',
    supervisorVerified: true
  },
  {
    id: 'att-6',
    guardId: 'gd-8',
    guardName: 'Kavita Shinde',
    siteId: 'st-3',
    siteName: 'Phoenix Mall - Main Atrium & Gates',
    date: '2026-10-15',
    shiftType: 'Morning',
    punchInTime: '05:58 AM',
    gpsLat: 19.0863,
    gpsLng: 72.8889,
    isInsideGeofence: true,
    distanceFromSiteMeters: 25,
    status: 'Present',
    supervisorVerified: true
  }
];

export const initialPatrols: PatrolLog[] = [
  {
    id: 'pt-1',
    patrolNumber: 'PTR-2026-1001',
    siteId: 'st-1',
    siteName: 'DLF CyberCity - Tower 10A & 10B',
    routeName: 'Tower 10 Perimeter & Server Room Route',
    assignedGuardId: 'gd-1',
    assignedGuardName: 'Vikram Singh Shekhawat',
    scheduledTime: '07:00 AM - 08:00 AM',
    completedTime: '07:48 AM',
    status: 'Completed',
    complianceScorePercent: 100,
    checkpoints: [
      { id: 'cp-1', name: 'Main Reception Barrier', qrCode: 'QR-DLF-10A-01', latitude: 28.4986, longitude: 77.0878, scannedAt: '07:08 AM', status: 'Completed' },
      { id: 'cp-2', name: 'Server Room Entry Lock', qrCode: 'QR-DLF-10A-02', latitude: 28.4988, longitude: 77.0879, scannedAt: '07:22 AM', status: 'Completed' },
      { id: 'cp-3', name: 'Basement B1 Fire Hydrant', qrCode: 'QR-DLF-10A-03', latitude: 28.4984, longitude: 77.0875, scannedAt: '07:35 AM', status: 'Completed' },
      { id: 'cp-4', name: 'North Exit Gate 4', qrCode: 'QR-DLF-10A-04', latitude: 28.4989, longitude: 77.0880, scannedAt: '07:48 AM', status: 'Completed' }
    ]
  },
  {
    id: 'pt-2',
    patrolNumber: 'PTR-2026-1002',
    siteId: 'st-3',
    siteName: 'Phoenix Mall - Main Atrium & Gates',
    routeName: 'Mall Floor 1 & Jewelry Zone Route',
    assignedGuardId: 'gd-6',
    assignedGuardName: 'Suresh Patil',
    scheduledTime: '09:00 AM - 10:00 AM',
    status: 'In Progress',
    complianceScorePercent: 75,
    checkpoints: [
      { id: 'cp-5', name: 'Atrium Glass Lift Core', qrCode: 'QR-PHX-AT-01', latitude: 19.0864, longitude: 72.8890, scannedAt: '09:12 AM', status: 'Completed' },
      { id: 'cp-6', name: 'Jewelry Court Corridor East', qrCode: 'QR-PHX-JW-02', latitude: 19.0867, longitude: 72.8892, scannedAt: '09:30 AM', status: 'Completed' },
      { id: 'cp-7', name: 'Food Court Rear Service Exit', qrCode: 'QR-PHX-FC-03', latitude: 19.0862, longitude: 72.8888, scannedAt: '09:48 AM', status: 'Completed' },
      { id: 'cp-8', name: 'Loading Dock Roller Gate', qrCode: 'QR-PHX-LD-04', latitude: 19.0870, longitude: 72.8895, status: 'Pending' }
    ]
  },
  {
    id: 'pt-3',
    patrolNumber: 'PTR-2026-1003',
    siteId: 'st-2',
    siteName: 'DLF CyberHub Central Plaza',
    routeName: 'Plaza Amphitheater & Rear Walkway',
    assignedGuardId: 'gd-4',
    assignedGuardName: 'Rajesh Kumar Meena',
    scheduledTime: '15:00 PM - 16:00 PM',
    status: 'Missed',
    complianceScorePercent: 0,
    checkpoints: [
      { id: 'cp-9', name: 'Amphitheater Center', qrCode: 'QR-CH-AMP-01', latitude: 28.4950, longitude: 77.0890, status: 'Missed' },
      { id: 'cp-10', name: 'Subway Link Gate', qrCode: 'QR-CH-SUB-02', latitude: 28.4952, longitude: 77.0892, status: 'Missed' }
    ]
  }
];

export const initialIncidents: Incident[] = [
  {
    id: 'inc-1',
    incidentNumber: 'INC-2026-089',
    siteId: 'st-1',
    siteName: 'DLF CyberCity - Tower 10A & 10B',
    reportedByGuardId: 'gd-1',
    reportedByName: 'Vikram Singh Shekhawat',
    timestamp: '2026-10-14 23:45',
    severity: 'High',
    category: 'Trespassing',
    title: 'Attempted Entry by Unauthorized Courier after Permitted Hours',
    description: 'An individual claiming to be a delivery person attempted to bypass visitor registration at Gate 2 after 23:00 without tenant invitation or OTP verification.',
    immediateActionTaken: 'Guard detained individual at visitor booth, checked credentials, and refused access. Client facility manager notified.',
    investigator: 'Subedar Balwant Singh',
    status: 'Under Investigation',
    rootCause: 'Tenant delivery instruction not aligned with building night security protocol.',
    preventiveAction: 'Night delivery drop box established at exterior lobby.'
  },
  {
    id: 'inc-2',
    incidentNumber: 'INC-2026-090',
    siteId: 'st-5',
    siteName: 'Max Saket - Emergency & Trauma Wing',
    reportedByGuardId: 'gd-7',
    reportedByName: 'Deepak Verma',
    timestamp: '2026-10-15 02:15',
    severity: 'Critical',
    category: 'Disorderly Conduct',
    title: 'Crowd Agitation at Emergency Triage Area',
    description: 'Family members of an emergency trauma patient engaged in verbal argument with duty nurses and attempted to enter ICU restricted zone forcefully.',
    immediateActionTaken: 'Security supervisor and 2 bouncers deployed within 90 seconds. Crowd de-escalated, barricade maintained, resident medical officer mediated.',
    investigator: 'Deepak Verma',
    status: 'Resolved',
    rootCause: 'Lack of timely patient status update causing distress and panic.',
    preventiveAction: 'Dedicated family liaison desk staffed outside ICU entrance.'
  },
  {
    id: 'inc-3',
    incidentNumber: 'INC-2026-091',
    siteId: 'st-3',
    siteName: 'Phoenix Mall - Main Atrium & Gates',
    reportedByGuardId: 'gd-6',
    reportedByName: 'Suresh Patil',
    timestamp: '2026-10-15 11:30',
    severity: 'Low',
    category: 'Equipment Damage',
    title: 'Bollard Malfunction at Basement 1 Ramp',
    description: 'Automatic hydraulic vehicle barrier failed to retract smoothly upon RFID scan, causing brief traffic slowdown.',
    immediateActionTaken: 'Manual override engaged, traffic diverted to Ramp B, mall technical maintenance team summoned.',
    investigator: 'Suresh Patil',
    status: 'Action Required'
  }
];

export const initialSOSAlerts: SOSAlert[] = [
  {
    id: 'sos-1',
    guardId: 'gd-4',
    guardName: 'Rajesh Kumar Meena',
    guardPhone: '+91 98290 12345',
    siteId: 'st-2',
    siteName: 'DLF CyberHub Central Plaza',
    timestamp: '2026-10-15 14:10',
    gpsLat: 28.4950,
    gpsLng: 77.0890,
    isTestAlert: false,
    status: 'Acknowledged',
    responderName: 'Subedar Balwant Singh (Patrol Quick Response Team)',
    resolutionNotes: 'QRT vehicle dispatched. Security supervisor Balwant Singh on site inspecting perimeter.'
  }
];

export const initialCandidates: RecruitmentCandidate[] = [
  {
    id: 'can-1',
    candidateNumber: 'REC-2026-041',
    fullName: 'Harpreet Singh Gill',
    phone: '+91 98722 33441',
    email: 'harpreet.gill@gmail.com',
    appliedCategory: 'Bouncer',
    source: 'Staff Referral',
    stage: 'Ready for Deployment',
    experienceYears: 4,
    policeVerificationStatus: 'Verified',
    expectedSalary: 23000,
    notes: 'Cleared physical agility test and verification. Fit for high-footfall mall deployment.'
  },
  {
    id: 'can-2',
    candidateNumber: 'REC-2026-042',
    fullName: 'Mohd. Salim Khan',
    phone: '+91 98104 55667',
    email: 'salim.khan@yahoo.com',
    appliedCategory: 'Unarmed Guard',
    source: 'Direct Walk-in',
    stage: 'Police Verification',
    experienceYears: 2,
    policeVerificationStatus: 'In Process',
    expectedSalary: 16000,
    notes: 'Aadhaar and biometric done. Verification sent to Delhi Police Saket station.'
  },
  {
    id: 'can-3',
    candidateNumber: 'REC-2026-043',
    fullName: 'Pooja Rawat',
    phone: '+91 98118 77665',
    email: 'pooja.rawat@outlook.com',
    appliedCategory: 'Lady Guard',
    source: 'Online Ad',
    stage: 'Interview Scheduled',
    interviewDate: '2026-10-16 11:00 AM',
    experienceYears: 1,
    policeVerificationStatus: 'Pending',
    expectedSalary: 17500
  },
  {
    id: 'can-4',
    candidateNumber: 'REC-2026-044',
    fullName: 'Subedar Mohan Joshi (Retd.)',
    phone: '+91 98212 99001',
    email: 'mohan.joshi@gmail.com',
    appliedCategory: 'Security Supervisor',
    source: 'Direct Walk-in',
    stage: 'Selected',
    experienceYears: 18,
    policeVerificationStatus: 'Verified',
    expectedSalary: 28000,
    notes: 'Indian Army Corps of Military Police background. Outstanding candidate for multi-tower site.'
  }
];

export const initialLeaves: LeaveRequest[] = [
  {
    id: 'lv-1',
    guardId: 'gd-10',
    guardName: 'Amitabh Sen',
    leaveType: 'Earned Leave',
    startDate: '2026-10-12',
    endDate: '2026-10-18',
    daysCount: 7,
    reason: 'Family wedding in hometown (Kolkata). Approved with reliever deployed.',
    status: 'Approved',
    approvedBy: 'Operations Manager'
  },
  {
    id: 'lv-2',
    guardId: 'gd-9',
    guardName: 'Manoj Tiwari',
    leaveType: 'Sick Leave',
    startDate: '2026-10-16',
    endDate: '2026-10-17',
    daysCount: 2,
    reason: 'Severe viral fever and medical prescription attached.',
    status: 'Pending'
  }
];

export const initialUniformStock: UniformItem[] = [
  { id: 'ui-1', code: 'UNF-SAF-01', name: 'Navy Safari Suit (Armed Guard/Supervisor)', category: 'Uniform', totalStock: 120, issuedCount: 88, availableStock: 32, unitCost: 1450 },
  { id: 'ui-2', code: 'UNF-SHR-02', name: 'Standard SGF Light Blue Shirt with Epaulettes', category: 'Uniform', totalStock: 250, issuedCount: 210, availableStock: 40, unitCost: 650 },
  { id: 'ui-3', code: 'UNF-TR-03', name: 'Midnight Navy Trousers', category: 'Uniform', totalStock: 250, issuedCount: 215, availableStock: 35, unitCost: 750 },
  { id: 'ui-4', code: 'ACC-BTS-04', name: 'Tactical DMS Leather Boots (Pair)', category: 'Protective Gear', totalStock: 100, issuedCount: 78, availableStock: 22, unitCost: 1800 },
  { id: 'ui-5', code: 'ACC-HMD-05', name: 'Handheld Metal Detector (Garrett Style)', category: 'Protective Gear', totalStock: 45, issuedCount: 38, availableStock: 7, unitCost: 3200 },
  { id: 'ui-6', code: 'ACC-BAT-06', name: 'Polycarbonate Security Lathi / Baton', category: 'Accessories', totalStock: 80, issuedCount: 65, availableStock: 15, unitCost: 450 }
];

export const initialPayrollRuns: PayrollRun[] = [
  {
    id: 'pay-2026-09',
    periodMonth: 'September 2026',
    runDate: '2026-10-02',
    totalGuards: 142,
    grossPayroll: 2845000,
    totalDeductions: 362700,
    netPayroll: 2482300,
    status: 'Locked',
    approvedBy: 'Director of Operations',
    payslips: [
      {
        guardId: 'gd-1',
        guardName: 'Vikram Singh Shekhawat',
        category: 'Armed Guard',
        daysWorked: 26,
        otHours: 18,
        basicSalary: 18500,
        hra: 4500,
        allowances: 3000,
        otPay: 2610,
        grossSalary: 28610,
        pfDeduction: 2220, // 12% of basic
        esicDeduction: 215, // 0.75% of gross
        ptDeduction: 200,
        otherDeductions: 0,
        netSalary: 25975,
        payslipNumber: 'SGF-PS-202609-001',
        paymentStatus: 'Paid'
      },
      {
        guardId: 'gd-2',
        guardName: 'Balwant Singh Rathore',
        category: 'Security Supervisor',
        daysWorked: 26,
        otHours: 12,
        basicSalary: 22000,
        hra: 5500,
        allowances: 4500,
        otPay: 2160,
        grossSalary: 34160,
        pfDeduction: 2640,
        esicDeduction: 256,
        ptDeduction: 200,
        otherDeductions: 0,
        netSalary: 31064,
        payslipNumber: 'SGF-PS-202609-002',
        paymentStatus: 'Paid'
      },
      {
        guardId: 'gd-3',
        guardName: 'Sunita Devi Yadav',
        category: 'Lady Guard',
        daysWorked: 25,
        otHours: 10,
        basicSalary: 16500,
        hra: 4000,
        allowances: 2500,
        otPay: 1300,
        grossSalary: 24300,
        pfDeduction: 1980,
        esicDeduction: 182,
        ptDeduction: 200,
        otherDeductions: 0,
        netSalary: 21938,
        payslipNumber: 'SGF-PS-202609-003',
        paymentStatus: 'Paid'
      }
    ]
  }
];

export const initialInvoices: ClientInvoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'SGF-INV-2026-104',
    clientId: 'cl-1',
    clientName: 'DLF CyberCity Developers',
    billingPeriod: 'September 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-20',
    lineItems: [
      { id: 'li-1', description: 'Armed Security Guards (Day & Night)', category: 'Armed Guard', guardsCount: 6, ratePerMonth: 24000, amount: 144000 },
      { id: 'li-2', description: 'Security Supervisors (Ex-Military)', category: 'Security Supervisor', guardsCount: 4, ratePerMonth: 28500, amount: 114000 },
      { id: 'li-3', description: 'Unarmed Security Guards (Tower Access)', category: 'Unarmed Guard', guardsCount: 26, ratePerMonth: 18500, amount: 481000 },
      { id: 'li-4', description: 'Lady Security Guards (Frisking Booths)', category: 'Lady Guard', guardsCount: 6, ratePerMonth: 19500, amount: 117000 }
    ],
    subtotal: 856000,
    serviceChargePercent: 10,
    serviceChargeAmount: 85600,
    cgst: 84744, // 9%
    sgst: 84744, // 9%
    totalAmount: 1111088,
    paidAmount: 943088,
    balanceDue: 168000,
    status: 'Partially Paid'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'SGF-INV-2026-105',
    clientId: 'cl-2',
    clientName: 'Phoenix Marketcity Mall',
    billingPeriod: 'September 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    lineItems: [
      { id: 'li-5', description: 'Security Supervisors', category: 'Security Supervisor', guardsCount: 6, ratePerMonth: 30000, amount: 180000 },
      { id: 'li-6', description: 'Event & Mall Bouncers', category: 'Bouncer', guardsCount: 10, ratePerMonth: 26500, amount: 265000 },
      { id: 'li-7', description: 'Unarmed Perimeter Guards', category: 'Unarmed Guard', guardsCount: 22, ratePerMonth: 18500, amount: 407000 },
      { id: 'li-8', description: 'Lady Frisking Guards', category: 'Lady Guard', guardsCount: 8, ratePerMonth: 19500, amount: 156000 }
    ],
    subtotal: 1008000,
    serviceChargePercent: 10,
    serviceChargeAmount: 100800,
    cgst: 99792,
    sgst: 99792,
    totalAmount: 1308384,
    paidAmount: 1078384,
    balanceDue: 230000,
    status: 'Overdue' // Past due date!
  },
  {
    id: 'inv-3',
    invoiceNumber: 'SGF-INV-2026-106',
    clientId: 'cl-3',
    clientName: 'Max Super Speciality Hospital',
    billingPeriod: 'September 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-25',
    lineItems: [
      { id: 'li-9', description: 'Supervisors (Hospital Wing)', category: 'Security Supervisor', guardsCount: 3, ratePerMonth: 29000, amount: 87000 },
      { id: 'li-10', description: 'Ward Guards (General)', category: 'Unarmed Guard', guardsCount: 14, ratePerMonth: 18500, amount: 259000 },
      { id: 'li-11', description: 'Lady Hospital Guards', category: 'Lady Guard', guardsCount: 3, ratePerMonth: 19500, amount: 58500 }
    ],
    subtotal: 404500,
    serviceChargePercent: 10,
    serviceChargeAmount: 40450,
    cgst: 40045,
    sgst: 40045,
    totalAmount: 525040,
    paidAmount: 525040,
    balanceDue: 0,
    status: 'Paid'
  }
];

export const initialPayments: PaymentReceipt[] = [
  {
    id: 'rc-1',
    receiptNumber: 'SGF-RCP-2026-088',
    clientId: 'cl-1',
    clientName: 'DLF CyberCity Developers',
    paymentDate: '2026-10-08',
    amount: 943088,
    tdsDeducted: 18861,
    netReceived: 924227,
    paymentMode: 'NEFT/RTGS',
    referenceNumber: 'HDFCR5202610088912',
    allocatedInvoiceIds: ['inv-1'],
    notes: 'Part-payment received with 2% Section 194C TDS certificate uploaded.'
  },
  {
    id: 'rc-2',
    receiptNumber: 'SGF-RCP-2026-089',
    clientId: 'cl-3',
    clientName: 'Max Super Speciality Hospital',
    paymentDate: '2026-10-10',
    amount: 525040,
    tdsDeducted: 10500,
    netReceived: 514540,
    paymentMode: 'NEFT/RTGS',
    referenceNumber: 'SBIN00293812039',
    allocatedInvoiceIds: ['inv-3'],
    notes: 'Full payment cleared in single tranche against invoice SGF-INV-2026-106.'
  }
];

export const initialCRMLeads: CRMLead[] = [
  {
    id: 'crm-1',
    companyName: 'Fortis Memorial Research Institute',
    contactPerson: 'Col. Sanjeev Vohra',
    email: 'facilities@fortishealthcare.com',
    phone: '+91 98110 88992',
    industry: 'Healthcare',
    requiredGuards: 36,
    estimatedMonthlyValue: 780000,
    stage: 'Negotiation',
    assignedTo: 'Vikrant Verma (Sales Head)',
    expectedClosingDate: '2026-10-25',
    probabilityPercent: 85,
    notes: 'Quotation submitted for 3 shifts + emergency bouncers. Commercial negotiation on service fee.'
  },
  {
    id: 'crm-2',
    companyName: 'Amazon Fulfilment Center (DEL4)',
    contactPerson: 'Karan Malhotra',
    email: 'karanm@amazon.com',
    phone: '+91 98200 11993',
    industry: 'E-Commerce Logistics',
    requiredGuards: 60,
    estimatedMonthlyValue: 1350000,
    stage: 'Proposal Sent',
    assignedTo: 'Vikrant Verma (Sales Head)',
    expectedClosingDate: '2026-11-15',
    probabilityPercent: 60,
    notes: 'RFP submitted for 24x7 gate security and vehicle frisking bays in Bilaspur hub.'
  },
  {
    id: 'crm-3',
    companyName: 'Oberoi Realty Sky City',
    contactPerson: 'Rohit Kothari',
    email: 'society.sec@oberoiskycity.in',
    phone: '+91 98333 44556',
    industry: 'Residential Complex',
    requiredGuards: 20,
    estimatedMonthlyValue: 420000,
    stage: 'Site Survey',
    assignedTo: 'Sanjay Nair (BDM Mumbai)',
    expectedClosingDate: '2026-10-30',
    probabilityPercent: 40,
    notes: 'Completed site visit for 4 residential towers and podium amenities.'
  }
];

export const initialComplaints: ClientComplaint[] = [
  {
    id: 'cmp-1',
    complaintNumber: 'TKT-2026-034',
    clientId: 'cl-2',
    clientName: 'Phoenix Marketcity Mall',
    siteId: 'st-3',
    siteName: 'Phoenix Mall - Main Atrium & Gates',
    title: 'Replacement Request for Evening Shift Entry Gate 2',
    description: 'Guard was observed sitting down during peak 18:00 footfall rush. Kindly rotate or provide briefing on standing vigilance.',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-10-14 19:30',
    resolutionNotes: 'Site supervisor issued counseling memo. Relief guard assigned to entry gate.'
  },
  {
    id: 'cmp-2',
    complaintNumber: 'TKT-2026-035',
    clientId: 'cl-1',
    clientName: 'DLF CyberCity Developers',
    siteId: 'st-2',
    siteName: 'DLF CyberHub Central Plaza',
    title: 'Request for 2 Extra Bouncers for Corporate Weekend Concert',
    description: 'CyberHub stage event scheduled for Friday 17th Oct. Require 2 senior bouncers from 17:00 to 23:00.',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-10-15 10:15'
  }
];

export const initialIntegrations: IntegrationStatus[] = [
  { id: 'int-1', name: 'TallyPrime ERP XML/ODBC Connector', category: 'Accounting', status: 'Connected', lastPing: '10 mins ago', endpointUrl: 'http://localhost:9000' },
  { id: 'int-2', name: 'Google Maps Geocoding & Distance Matrix', category: 'Maps', status: 'Connected', lastPing: 'Live' },
  { id: 'int-3', name: 'SMS & OTP Gateway (Fast2SMS / Msg91)', category: 'Communication', status: 'Connected', lastPing: 'Live' },
  { id: 'int-4', name: 'WhatsApp Business API (Gupshup / Meta)', category: 'Communication', status: 'Connected', lastPing: '1 hour ago' },
  { id: 'int-5', name: 'Biometric Attendance Device Adapter (eSSL/ZKTeco)', category: 'Biometrics', status: 'Connected', lastPing: 'Live Sync' },
  { id: 'int-6', name: 'Razorpay / Cashfree Client Payment Gateway', category: 'Payment', status: 'Connected', lastPing: 'Active' }
];

export const initialBranches = [
  { id: 'br-1', name: 'Delhi NCR Regional HQ', code: 'SGF-NCR', city: 'Gurugram', state: 'Haryana', manager: 'Brig. Alok Sharma (Retd.)', phone: '+91 124 4567890' },
  { id: 'br-2', name: 'Mumbai Western Operations', code: 'SGF-MUM', city: 'Mumbai', state: 'Maharashtra', manager: 'Ajay Kadam', phone: '+91 22 28456789' },
  { id: 'br-3', name: 'Bengaluru Southern Hub', code: 'SGF-BLR', city: 'Bengaluru', state: 'Karnataka', manager: 'M. S. Murthy', phone: '+91 80 23456789' },
  { id: 'br-4', name: 'Hyderabad Cyberabad Operations', code: 'SGF-HYD', city: 'Hyderabad', state: 'Telangana', manager: 'K. V. Reddy', phone: '+91 40 24567890' }
];
