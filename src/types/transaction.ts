export interface TimeMetrics {
  createdAt: string; // ISO string
  stageStartTimes: Record<string, string>; // Map of stage to ISO timestamp
  stageDurations: Record<string, number>; // Map of stage to duration in milliseconds
  lastPageVisit: Record<string, string>; // Map of page path to ISO timestamp
  totalTimeSpent: Record<string, number>; // Map of page path to total time spent in milliseconds
  totalTimeElapsed: number; // Total time since transaction creation in milliseconds
}

export interface Metrics {
  // Compliance with Regulations metrics
  complianceScore: number;
  regulatoryCompliance: {
    keyPoints: string[];
    complianceCoverage: number;
    riskExposures: { name: string; value: number }[];
  };
  
  // Legal History metrics
  legalHistoryScore: number;
  legalRecord: {
    judgmentsCount: number;
    litigationRisk: number;
    recentCases: number;
    pendingLitigation: number;
  };
  
  // Business Duration metrics
  businessDurationScore: number;
  businessAge: {
    yearsInBusiness: number;
    industryPeerPercentile: number;
    stabilityRating: number;
    historicalConsistency: number;
  };
  
  // Industry Reputation metrics
  industryReputationScore: number;
  reputation: {
    marketPerception: number;
    publicSentiment: number;
    customerSatisfaction: number;
    industryAwards: number;
  };
  
  // Business Stability metrics
  businessStabilityScore: number;
  stability: {
    cashFlowConsistency: number;
    revenueGrowth: number;
    employeeRetention: number;
    marketPositionStrength: number;
  };
}

export interface TransactionTimeTracking {
  metrics: Metrics;
  timeMetrics: TimeMetrics;
} 