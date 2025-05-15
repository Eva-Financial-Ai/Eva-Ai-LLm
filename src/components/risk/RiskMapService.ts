import { RiskMapType } from './RiskMapNavigator';
import { RiskCategory } from './RiskMapOptimized';

// Define interfaces for risk data
export interface RiskCategoryData {
  score: number;
  status: 'green' | 'yellow' | 'red';
}

export interface RiskFinding {
  type: 'positive' | 'warning' | 'negative';
  text: string;
}

export interface RiskData {
  score: number;
  industry_avg: number;
  confidence: number;
  categories: {
    [key: string]: RiskCategoryData;
  };
  findings: RiskFinding[];
}

/**
 * A service for managing risk map data and operations
 * This centralizes all risk map related logic to prevent inconsistencies
 */
class RiskMapService {
  // Fetch risk data based on type
  async fetchRiskData(type: RiskMapType): Promise<RiskData> {
    console.log(`Fetching risk data for type: ${type}`);
    
    // In a real implementation, this would make an API call
    // For demo purposes, return mock data with a small delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockRiskData(type));
      }, 800);
    });
  }
  
  // Get available credits
  getAvailableCredits(): number {
    const storedCredits = localStorage.getItem('availableCredits');
    return storedCredits ? parseInt(storedCredits, 10) : 0;
  }
  
  // Update available credits
  updateAvailableCredits(newValue: number): void {
    localStorage.setItem('availableCredits', newValue.toString());
  }
  
  // Use a credit
  useCredit(): boolean {
    const credits = this.getAvailableCredits();
    if (credits <= 0) {
      return false;
    }
    
    this.updateAvailableCredits(credits - 1);
    return true;
  }
  
  // Add credits
  addCredits(amount: number): void {
    const credits = this.getAvailableCredits();
    this.updateAvailableCredits(credits + amount);
  }
  
  // Convert between RiskMapType and LoanType
  mapRiskMapTypeToLoanType(riskMapType: RiskMapType): string {
    switch (riskMapType) {
      case 'equipment':
        return 'equipment';
      case 'realestate':
        return 'realestate';
      default:
        return 'general';
    }
  }
  
  // Convert from LoanType to RiskMapType
  mapLoanTypeToRiskMapType(loanType: string): RiskMapType {
    switch (loanType) {
      case 'equipment':
        return 'equipment';
      case 'realestate':
        return 'realestate';
      default:
        return 'unsecured';
    }
  }
  
  // Private method to get mock risk data
  private getMockRiskData(type: RiskMapType): RiskData {
    if (type === 'equipment') {
      return {
        score: 76,
        industry_avg: 70,
        confidence: 88,
        categories: {
          credit: { score: 80, status: 'green' },
          capacity: { score: 72, status: 'yellow' },
          capital: { score: 85, status: 'green' },
          collateral: { score: 90, status: 'green' },
          conditions: { score: 68, status: 'yellow' },
          character: { score: 92, status: 'green' },
        },
        findings: [
          { type: 'positive', text: 'Equipment valuation indicates sufficient collateral' },
          { type: 'positive', text: 'Strong business credit profile' },
          { type: 'warning', text: 'Debt service coverage ratio is slightly below ideal range' },
          { type: 'positive', text: 'Clear equipment maintenance records' },
        ],
      };
    } else if (type === 'realestate') {
      return {
        score: 88,
        industry_avg: 75,
        confidence: 94,
        categories: {
          credit: { score: 90, status: 'green' },
          capacity: { score: 82, status: 'green' },
          capital: { score: 88, status: 'green' },
          collateral: { score: 95, status: 'green' },
          conditions: { score: 78, status: 'yellow' },
          character: { score: 90, status: 'green' },
        },
        findings: [
          { type: 'positive', text: 'Property valuation exceeds loan requirements' },
          { type: 'positive', text: 'Excellent repayment history on previous loans' },
          { type: 'positive', text: 'Solid rental income history for the property' },
          { type: 'warning', text: 'Market conditions in the area show moderate volatility' },
        ],
      };
    } else {
      // Unsecured (default)
      return {
        score: 82,
        industry_avg: 74,
        confidence: 92,
        categories: {
          credit: { score: 85, status: 'green' },
          capacity: { score: 78, status: 'yellow' },
          capital: { score: 90, status: 'green' },
          collateral: { score: 82, status: 'green' },
          conditions: { score: 94, status: 'green' },
          character: { score: 95, status: 'green' },
        },
        findings: [
          { type: 'positive', text: 'Strong credit history with consistent payment behavior over last 24 months' },
          { type: 'positive', text: 'Business has demonstrated ability to service existing debt obligations' },
          { type: 'warning', text: 'Debt service coverage ratio is adequate but lower than industry average' },
          { type: 'positive', text: 'Excellent character assessment with no detected compliance issues' },
        ],
      };
    }
  }
}

// Export as a singleton to ensure consistent state across components
export default new RiskMapService(); 