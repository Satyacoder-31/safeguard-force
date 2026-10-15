// Safe Guard Force ERP - Comprehensive Data Types

export type RoleType = 
  | 'SUPER_ADMIN'
  | 'MANAGEMENT'
  | 'OPERATIONS_MANAGER'
  | 'SITE_SUPERVISOR'
  | 'HR_RECRUITMENT'
  | 'PAYROLL_ACCOUNTS'
  | 'SALES_CRM'
  | 'CLIENT_USER'
  | 'GUARD_FIELD';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  avatar?: string;
  clientId?: string; // For CLIENT_USER tenant isolation
  branchId?: string;
}

export type GuardCategory = 
  | 'Armed Guard'
  | 'Security Supervisor'
  | 'Unarmed Guard'
  | 'Bouncer'
  | 'Lady Guard'
  | 'Dog Handler';

export interface GuardDocument {
  id: string;
  type: 'Aadhaar' | 'PAN' | 'Police Verification' | 'Gun License' | 'Training Certificate' | 'Medical Fitness';
  docNumber: string;
  issueDate: string;
  expiryDate?: string;
  verified: boolean;
  fileUrl?: string;
}

export interface Guard {
  id: string;
  guardIdNumber: string; // e.g. SGF-GD-1042
  name: string;
  nameHi?: string;
  phone: string;
  email: string;
  photo: string;
  category: GuardCategory;
  rank: string;
  dateOfJoining: string;
  status: 'Active' | 'On Leave' | 'Suspended' | 'Inactive';
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  policeVerificationStatus: 'Verified' | 'In Process' | 'Pending' | 'Rejected';
  currentSiteId?: string;
  currentSiteName?: string;
  shiftPreference: 'Morning' | 'Evening' | 'Night' | 'Any';
  bankDetails: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    holderName: string;
  };
  salaryStructure: {
    basic: number;
    hra: number;
    conveyance: number;
    specialAllowance: number;
    overtimeHourlyRate: number;
  };
  documents: GuardDocument[];
  uniformIssued: string[];
}

export interface Site {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  requiredStrength: number;
  assignedGuardsCount: number;
  supervisorName: string;
  supervisorPhone: string;
  emergencyContact: string;
  status: 'Active' | 'Under Review' | 'Suspended';
}

export interface Client {
  id: string;
  clientCode: string; // e.g. SGF-CL-001
  name: string;
  legalEntityName: string;
  industry: string;
  gstin: string;
  primaryContactName: string;
  email: string;
  phone: string;
  billingAddress: string;
  contractStatus: 'Active' | 'Expiring' | 'Draft' | 'Expired';
  activeSitesCount: number;
  monthlyBilledAmount: number;
  totalOutstanding: number;
}

export interface ContractItemRate {
  category: GuardCategory;
  requiredCount: number;
  ratePerMonth: number;
  otRatePerHour: number;
}

export interface Contract {
  id: string;
  contractNumber: string;
  clientId: string;
  clientName: string;
  title: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  status: 'Active' | 'Expiring' | 'Draft' | 'Expired';
  siteIds: string[];
  rates: ContractItemRate[];
  serviceFeePercent: number;
  gstRatePercent: number;
  billingFrequency: 'Monthly' | 'Bi-Weekly';
  totalMonthlyValue: number;
}

export interface ShiftRoster {
  id: string;
  siteId: string;
  siteName: string;
  date: string;
  shiftType: 'Morning' | 'Evening' | 'Night' | 'Special';
  timing: string;
  requiredGuards: number;
  assignedGuardIds: string[];
  assignedGuards: { id: string; name: string; category: GuardCategory }[];
  status: 'Fully Staffed' | 'Shortage' | 'Overstaffed';
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  guardId: string;
  guardName: string;
  siteId: string;
  siteName: string;
  date: string;
  shiftType: 'Morning' | 'Evening' | 'Night';
  punchInTime: string;
  punchOutTime?: string;
  gpsLat: number;
  gpsLng: number;
  isInsideGeofence: boolean;
  distanceFromSiteMeters: number;
  status: 'Present' | 'Late' | 'Absent' | 'Regularized' | 'Overtime';
  supervisorVerified: boolean;
  verificationNotes?: string;
  photoUrl?: string;
}

export interface PatrolCheckpoint {
  id: string;
  name: string;
  qrCode: string;
  latitude: number;
  longitude: number;
  scannedAt?: string;
  status: 'Completed' | 'Pending' | 'Missed';
}

export interface PatrolLog {
  id: string;
  patrolNumber: string;
  siteId: string;
  siteName: string;
  routeName: string;
  assignedGuardId: string;
  assignedGuardName: string;
  scheduledTime: string;
  completedTime?: string;
  status: 'Completed' | 'In Progress' | 'Missed' | 'Late';
  complianceScorePercent: number;
  checkpoints: PatrolCheckpoint[];
}

export interface Incident {
  id: string;
  incidentNumber: string; // e.g. INC-2026-089
  siteId: string;
  siteName: string;
  reportedByGuardId: string;
  reportedByName: string;
  timestamp: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Theft' | 'Trespassing' | 'Fire Alarm' | 'Equipment Damage' | 'Medical' | 'Disorderly Conduct' | 'Suspicious Activity';
  title: string;
  description: string;
  immediateActionTaken: string;
  investigator?: string;
  status: 'Reported' | 'Acknowledged' | 'Under Investigation' | 'Action Required' | 'Resolved' | 'Closed';
  rootCause?: string;
  preventiveAction?: string;
  evidenceUrl?: string;
}

export interface SOSAlert {
  id: string;
  guardId: string;
  guardName: string;
  guardPhone: string;
  siteId: string;
  siteName: string;
  timestamp: string;
  gpsLat: number;
  gpsLng: number;
  isTestAlert: boolean;
  status: 'Triggered' | 'Acknowledged' | 'Responder Dispatched' | 'Resolved';
  responderName?: string;
  resolutionNotes?: string;
}

export interface RecruitmentCandidate {
  id: string;
  candidateNumber: string;
  fullName: string;
  phone: string;
  email: string;
  appliedCategory: GuardCategory;
  source: 'Direct Walk-in' | 'Staff Referral' | 'Online Ad' | 'Placement Agency';
  stage: 
    | 'New Candidate'
    | 'Contacted'
    | 'Interview Scheduled'
    | 'Interview Completed'
    | 'Selected'
    | 'Documents Pending'
    | 'Police Verification'
    | 'Training/Induction'
    | 'Ready for Deployment'
    | 'Joined'
    | 'Rejected';
  experienceYears: number;
  interviewDate?: string;
  policeVerificationStatus: 'Verified' | 'In Process' | 'Pending' | 'Rejected';
  expectedSalary: number;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  guardId: string;
  guardName: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Earned Leave';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export interface UniformItem {
  id: string;
  code: string;
  name: string;
  category: 'Uniform' | 'Protective Gear' | 'Accessories';
  totalStock: number;
  issuedCount: number;
  availableStock: number;
  unitCost: number;
}

export interface PayslipItem {
  guardId: string;
  guardName: string;
  category: GuardCategory;
  daysWorked: number;
  otHours: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  otPay: number;
  grossSalary: number;
  pfDeduction: number;
  esicDeduction: number;
  ptDeduction: number;
  otherDeductions: number;
  netSalary: number;
  payslipNumber: string;
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
}

export interface PayrollRun {
  id: string;
  periodMonth: string; // e.g. "October 2026"
  runDate: string;
  totalGuards: number;
  grossPayroll: number;
  totalDeductions: number;
  netPayroll: number;
  status: 'Draft' | 'Calculated' | 'Approved' | 'Locked';
  approvedBy?: string;
  payslips: PayslipItem[];
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  category: GuardCategory;
  guardsCount: number;
  ratePerMonth: number;
  amount: number;
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string; // e.g. SGF-INV-2026-104
  clientId: string;
  clientName: string;
  billingPeriod: string;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  serviceChargePercent: number;
  serviceChargeAmount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'Draft' | 'Review' | 'Approved' | 'Issued' | 'Partially Paid' | 'Paid' | 'Overdue';
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  clientId: string;
  clientName: string;
  paymentDate: string;
  amount: number;
  tdsDeducted: number;
  tdsAmount?: number;
  netReceived: number;
  paymentMode: 'NEFT/RTGS' | 'Cheque' | 'UPI' | 'Direct Transfer';
  referenceNumber: string;
  allocatedInvoiceIds: string[];
  notes?: string;
}

export interface CRMLead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  requiredGuards: number;
  estimatedMonthlyValue: number;
  stage: 'Lead' | 'Contacted' | 'Site Survey' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  assignedTo: string;
  expectedClosingDate: string;
  probabilityPercent: number;
  notes?: string;
}

export interface ClientComplaint {
  id: string;
  complaintNumber: string;
  clientId: string;
  clientName: string;
  siteId: string;
  siteName: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  resolutionNotes?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: RoleType;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'EXPORT' | 'LOGIN' | 'REJECT';
  module: string;
  details: string;
  ipAddress: string;
}

export interface SystemMasterItem {
  id: string;
  type: 'GUARD_CATEGORY' | 'UNIFORM_ITEM' | 'LEAVE_TYPE' | 'SHIFT_TIMING' | 'INCIDENT_TYPE' | 'BRANCH';
  code: string;
  nameEn: string;
  nameHi: string;
  isActive: boolean;
  meta?: Record<string, any>;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  category: 'Accounting' | 'Maps' | 'Communication' | 'Biometrics' | 'Payment';
  status: 'Connected' | 'Configured' | 'Setup Required';
  lastPing?: string;
  endpointUrl?: string;
}
