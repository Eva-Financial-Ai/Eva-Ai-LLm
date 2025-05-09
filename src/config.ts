// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.eva-ai.com/v1';

// General Application Configuration
export const APP_CONFIG = {
  APP_NAME: 'EVA AI Financial System',
  VERSION: '1.0.0',
  DEFAULT_PAGINATION_LIMIT: 10,
  MAX_PAGINATION_LIMIT: 100,
  SESSION_TIMEOUT_MINUTES: 30,
  ENABLE_ANALYTICS: true,
};

// Risk Assessment Configuration
export const RISK_CONFIG = {
  DEFAULT_RISK_THRESHOLD: 65,
  HIGH_RISK_THRESHOLD: 50, // Scores below this are high risk
  LOW_RISK_THRESHOLD: 80, // Scores above this are low risk
  AUTO_APPROVAL_THRESHOLD: 90, // Scores above this can be auto-approved
  AUTO_DECLINE_THRESHOLD: 30, // Scores below this can be auto-declined
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_BLOCKCHAIN_VERIFICATION: true,
  ENABLE_AI_RISK_ADVISOR: true,
  ENABLE_AUTOMATED_CREDIT_DECISIONS: true,
  ENABLE_HUMAN_IN_THE_LOOP: true,
  ENABLE_QUANTUM_SECURE_LOGIN: true,
};

// Default reason codes for decline
export const DECLINE_REASON_CODES = {
  HARD_DECLINE: [
    { value: 'credit_score', label: 'Insufficient Credit Score' },
    { value: 'identity_verification', label: 'Failed Identity Verification' },
    { value: 'compliance_issue', label: 'Compliance/Regulatory Issue' },
    { value: 'fraud_risk', label: 'Suspected Fraud' },
    { value: 'bankruptcy', label: 'Recent Bankruptcy' },
    { value: 'other', label: 'Other Reason' },
  ],
  SOFT_DECLINE: [
    { value: 'missing_documents', label: 'Missing Documentation' },
    { value: 'insufficient_income', label: 'Insufficient Income Verification' },
    { value: 'time_in_business', label: 'Insufficient Time in Business' },
    { value: 'collateral_issue', label: 'Collateral Valuation Issue' },
    { value: 'debt_ratio', label: 'High Debt-to-Income Ratio' },
    { value: 'other', label: 'Other Reason' },
  ],
};

// Reconsideration timelines for soft declines
export const RECONSIDERATION_TIMELINES = [
  { value: 'immediate', label: 'Immediate - When Issues Resolved' },
  { value: '30days', label: 'After 30 Days' },
  { value: '60days', label: 'After 60 Days' },
  { value: '90days', label: 'After 90 Days' },
  { value: 'custom', label: 'Custom Timeline' },
];
