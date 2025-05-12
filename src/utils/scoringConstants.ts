// Define the scoring thresholds for each parameter
export const SCORING_THRESHOLDS = {
  creditworthiness: {
    creditScore: {
      good: { min: 720, max: 850, points: 2 },
      average: { min: 650, max: 719, points: 1 },
      negative: { min: 300, max: 649, points: 0 }
    },
    paymentHistory: {
      good: { missedPayments: 0, points: 2 },
      average: { missedPayments: [1, 2, 3], points: 1 },
      negative: { missedPayments: 4, comparator: ">", points: 0 }
    },
    publicRecords: {
      good: { count: 0, points: 2 },
      average: { count: [1, 2], points: 1 },
      negative: { count: 3, comparator: ">=", points: 0 }
    },
    creditUtilization: {
      good: { max: 30, points: 2 },
      average: { min: 31, max: 50, points: 1 },
      negative: { min: 51, points: 0 }
    },
    creditHistoryAge: {
      good: { min: 7, points: 2 }, // years
      average: { min: 3, max: 6, points: 1 },
      negative: { max: 2, points: 0 }
    }
  },
  
  financial: {
    debtToEquity: {
      good: { max: 1.0, points: 2 },
      average: { min: 1.01, max: 2.0, points: 1 },
      negative: { min: 2.01, points: 0 }
    },
    currentRatio: {
      good: { min: 1.5, points: 2 },
      average: { min: 1.0, max: 1.49, points: 1 },
      negative: { max: 0.99, points: 0 }
    },
    quickRatio: {
      good: { min: 1.0, points: 2 },
      average: { min: 0.7, max: 0.99, points: 1 },
      negative: { max: 0.69, points: 0 }
    },
    grossMargin: {
      good: { min: 20, points: 2 }, // percentage
      average: { min: 10, max: 19, points: 1 },
      negative: { max: 9, points: 0 }
    },
    netProfitMargin: {
      good: { min: 10, points: 2 }, // percentage
      average: { min: 5, max: 9, points: 1 },
      negative: { max: 4, points: 0 }
    }
  },
  
  cashflow: {
    debtServiceCoverageRatio: {
      good: { min: 1.5, points: 2 },
      average: { min: 1.2, max: 1.49, points: 1 },
      negative: { max: 1.19, points: 0 }
    },
    operatingCashFlow: {
      good: { comparison: "positive_trend", points: 2 },
      average: { comparison: "stable", points: 1 },
      negative: { comparison: "negative_trend", points: 0 }
    },
    cashFlowToDebtRatio: {
      good: { min: 0.4, points: 2 },
      average: { min: 0.2, max: 0.39, points: 1 },
      negative: { max: 0.19, points: 0 }
    },
    cashConversionCycle: {
      good: { max: 30, points: 2 }, // days
      average: { min: 31, max: 60, points: 1 },
      negative: { min: 61, points: 0 }
    }
  },
  
  legal: {
    legalHistory: {
      good: { issues: 0, points: 2 },
      average: { issues: 1, type: "minor", points: 1 },
      negative: { issues: 1, type: "major", points: 0 }
    },
    regulatoryCompliance: {
      good: { status: "compliant", points: 2 },
      average: { status: "minor_violations", points: 1 },
      negative: { status: "major_violations", points: 0 }
    },
    ownershipStructure: {
      good: { status: "clear", points: 2 },
      average: { status: "complex", points: 1 },
      negative: { status: "unclear", points: 0 }
    }
  },
  
  equipment: {
    equipmentType: {
      good: { demand: "high", points: 2 },
      average: { demand: "medium", points: 1 },
      negative: { demand: "low", points: 0 }
    },
    equipmentAge: {
      good: { max: 1, points: 2 }, // years
      average: { min: 2, max: 5, points: 1 },
      negative: { min: 6, points: 0 }
    },
    equipmentResaleValue: {
      good: { percentage: 80, comparison: ">=", points: 2 }, // percentage of original value
      average: { percentage: [50, 79], points: 1 },
      negative: { percentage: 49, comparison: "<=", points: 0 }
    },
    maintenanceHistory: {
      good: { status: "excellent", points: 2 },
      average: { status: "adequate", points: 1 },
      negative: { status: "poor", points: 0 }
    }
  },
  
  property: {
    loanToValue: {
      good: { max: 65, points: 2 }, // percentage
      average: { min: 66, max: 75, points: 1 },
      negative: { min: 76, points: 0 }
    },
    propertyType: {
      good: { type: "class_a", points: 2 },
      average: { type: "class_b", points: 1 },
      negative: { type: "class_c", points: 0 }
    },
    occupancyRate: {
      good: { min: 90, points: 2 }, // percentage
      average: { min: 80, max: 89, points: 1 },
      negative: { max: 79, points: 0 }
    },
    locationQuality: {
      good: { quality: "prime", points: 2 },
      average: { quality: "good", points: 1 },
      negative: { quality: "fair", points: 0 }
    },
    propertyCondition: {
      good: { condition: "excellent", points: 2 },
      average: { condition: "good", points: 1 },
      negative: { condition: "fair", points: 0 }
    }
  }
};

// Define default weights for categories based on loan type
export const DEFAULT_WEIGHTS: Record<string, number> = {
  // General loan weights - sums to 100
  creditworthiness: 40,
  financial: 25,
  cashflow: 20,
  legal: 15,
  equipment: 0,
  property: 0,
};

// Loan-specific weight presets
export const LOAN_TYPE_WEIGHTS = {
  equipment: {
    creditworthiness: 30,
    financial: 20,
    cashflow: 15,
    legal: 15,
    equipment: 20,
    property: 0
  },
  
  realestate: {
    creditworthiness: 25,
    financial: 20,
    cashflow: 20,
    legal: 10,
    equipment: 0,
    property: 25
  }
};

// Default scoring profiles
export const DEFAULT_PROFILES: Array<{
  id: string;
  name: string;
  description: string;
  weights: Record<string, number>;
  thresholds: typeof SCORING_THRESHOLDS;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}> = [
  {
    id: 'default-general',
    name: 'Standard Commercial Loan',
    description: 'Default profile for general commercial loans',
    weights: DEFAULT_WEIGHTS,
    thresholds: SCORING_THRESHOLDS,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true
  },
  {
    id: 'default-equipment',
    name: 'Equipment Financing',
    description: 'Default profile for equipment financing with emphasis on asset value',
    weights: LOAN_TYPE_WEIGHTS.equipment,
    thresholds: SCORING_THRESHOLDS,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'default-realestate',
    name: 'Commercial Real Estate',
    description: 'Default profile for CRE loans with property metrics focus',
    weights: LOAN_TYPE_WEIGHTS.realestate,
    thresholds: SCORING_THRESHOLDS,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'conservative',
    name: 'Conservative Underwriting',
    description: 'Stricter thresholds for higher risk environments',
    weights: {
      creditworthiness: 45,
      financial: 25,
      cashflow: 20,
      legal: 10,
      equipment: 0,
      property: 0
    },
    thresholds: {
      ...SCORING_THRESHOLDS,
      // Adjusted thresholds for more conservative approach
      creditworthiness: {
        ...SCORING_THRESHOLDS.creditworthiness,
        creditScore: {
          good: { min: 750, max: 850, points: 2 },
          average: { min: 680, max: 749, points: 1 },
          negative: { min: 300, max: 679, points: 0 }
        }
      },
      financial: {
        ...SCORING_THRESHOLDS.financial,
        debtToEquity: {
          good: { max: 0.8, points: 2 },
          average: { min: 0.81, max: 1.5, points: 1 },
          negative: { min: 1.51, points: 0 }
        }
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 