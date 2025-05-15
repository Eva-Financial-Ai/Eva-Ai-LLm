import { RiskMapType } from './RiskMapNavigator';
import { RiskCategory } from './RiskMapOptimized';
import evaReportApi from '../../api/evaReportApi';

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

// Interface for purchased reports
export interface PurchasedReport {
  id: string;
  transactionId: string;
  riskMapType: RiskMapType;
  purchaseDate: string;
  expiryDate: string; // Reports can expire after a certain time
}

// Interface for cached risk data
interface CachedRiskData {
  data: RiskData;
  timestamp: number;
  type: RiskMapType;
}

/**
 * A service for managing risk map data and operations
 * This centralizes all risk map related logic to prevent inconsistencies
 */
class RiskMapService {
  // Cache storage for risk data
  private riskDataCache: CachedRiskData | null = null;
  private readonly CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
  private loadingPromise: Promise<RiskData> | null = null;
  private abortController: AbortController | null = null;
  private currentType: RiskMapType | null = null;

  // Fetch risk data based on type with caching and abort capability
  async fetchRiskData(type: RiskMapType, forceReload = false): Promise<RiskData> {
    console.log(`[RiskMapService] Fetching risk data for type: ${type}, forceReload: ${forceReload}`);
    
    // If a different type is being requested, abort any current request
    if (this.currentType && this.currentType !== type && this.abortController) {
      console.log(`[RiskMapService] Aborting previous request for ${this.currentType}`);
      this.abortController.abort();
      this.loadingPromise = null;
      this.abortController = null;
    }
    
    this.currentType = type;

    // Check if we already have this data type in cache and it's not expired
    const now = Date.now();
    if (
      !forceReload &&
      this.riskDataCache && 
      this.riskDataCache.type === type && 
      now - this.riskDataCache.timestamp < this.CACHE_EXPIRY_MS
    ) {
      console.log(`[RiskMapService] Using cached risk data for ${type}`);
      return this.riskDataCache.data;
    }

    // If there's already a loading promise for the data, return that
    if (this.loadingPromise) {
      console.log(`[RiskMapService] Already loading risk data for ${type}, returning existing promise`);
      return this.loadingPromise;
    }

    // Create new abort controller for this request
    this.abortController = new AbortController();
    
    // In a real implementation, this would make an API call with the abort signal
    this.loadingPromise = new Promise<RiskData>((resolve, reject) => {
      console.log(`[RiskMapService] Starting mock API call for ${type}`);
      
      // Set up abort handling
      this.abortController?.signal.addEventListener('abort', () => {
        console.log(`[RiskMapService] Request for ${type} was aborted`);
        reject(new Error('Request aborted'));
      });
      
      const timeoutId = setTimeout(() => {
        if (this.abortController?.signal.aborted) {
          return;
        }
        
        try {
          console.log(`[RiskMapService] Mock API call completed for ${type}`);
          const data = this.getMockRiskData(type);
          
          // Cache the result
          this.riskDataCache = {
            data,
            timestamp: Date.now(),
            type
          };
          
          // Clear the loading state
          this.loadingPromise = null;
          this.abortController = null;
          
          resolve(data);
        } catch (error) {
          console.error(`[RiskMapService] Error in mock API call for ${type}:`, error);
          this.loadingPromise = null;
          this.abortController = null;
          reject(error);
        }
      }, 800);
      
      // Also handle abort by clearing the timeout
      this.abortController?.signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
      });
    }).catch(error => {
      // Clean up on error
      this.loadingPromise = null;
      this.abortController = null;
      
      if (error.name === 'AbortError') {
        console.log(`[RiskMapService] Request for ${type} was aborted`);
        // Return a rejected promise to propagate the abort
        return Promise.reject(error);
      }
      
      console.error(`[RiskMapService] Error loading risk data for ${type}:`, error);
      // Return a rejected promise to propagate the error
      return Promise.reject(error);
    });
    
    return this.loadingPromise;
  }
  
  // Clear the cache to force a reload
  clearCache(): void {
    console.log('[RiskMapService] Clearing cache');
    this.riskDataCache = null;
    
    // Also abort any pending request
    if (this.abortController) {
      console.log('[RiskMapService] Aborting pending request during cache clear');
      this.abortController.abort();
      this.loadingPromise = null;
      this.abortController = null;
      this.currentType = null;
    }
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
      console.log('[RiskMapService] No credits available to use');
      return false;
    }
    
    console.log(`[RiskMapService] Using 1 credit. Before: ${credits}, After: ${credits - 1}`);
    this.updateAvailableCredits(credits - 1);
    return true;
  }
  
  // Add credits
  addCredits(amount: number): void {
    const credits = this.getAvailableCredits();
    console.log(`[RiskMapService] Adding ${amount} credits. Before: ${credits}, After: ${credits + amount}`);
    this.updateAvailableCredits(credits + amount);
  }
  
  // Get purchased reports
  getPurchasedReports(): PurchasedReport[] {
    const reports = localStorage.getItem('purchasedReports');
    return reports ? JSON.parse(reports) : [];
  }
  
  // Save purchased reports
  savePurchasedReports(reports: PurchasedReport[]): void {
    localStorage.setItem('purchasedReports', JSON.stringify(reports));
  }
  
  // Add a purchased report
  addPurchasedReport(transactionId: string, riskMapType: RiskMapType): PurchasedReport {
    console.log(`[RiskMapService] Adding purchased report for transaction ${transactionId}, type ${riskMapType}`);
    const reports = this.getPurchasedReports();
    
    // Create a new report
    const newReport: PurchasedReport = {
      id: `report_${Date.now()}`,
      transactionId,
      riskMapType,
      purchaseDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days validity
    };
    
    // Add to reports list
    reports.push(newReport);
    this.savePurchasedReports(reports);
    
    console.log(`[RiskMapService] Report added successfully: ${newReport.id}`);
    return newReport;
  }
  
  // Check if a report is already purchased
  isReportPurchased(transactionId: string, riskMapType: RiskMapType): boolean {
    const reports = this.getPurchasedReports();
    const currentDate = new Date();
    
    // Look for a valid (non-expired) report
    const isPurchased = reports.some(report => 
      report.transactionId === transactionId && 
      report.riskMapType === riskMapType && 
      new Date(report.expiryDate) > currentDate
    );
    
    console.log(`[RiskMapService] Report purchase check for ${transactionId}, ${riskMapType}: ${isPurchased}`);
    return isPurchased;
  }
  
  // Purchase a report using credits
  purchaseReport(transactionId: string, riskMapType: RiskMapType): boolean {
    console.log(`[RiskMapService] Attempting to purchase report for transaction ${transactionId}, type ${riskMapType}`);
    
    // First check if already purchased
    if (this.isReportPurchased(transactionId, riskMapType)) {
      console.log('[RiskMapService] Report already purchased, no need to use credits');
      return true; // Already purchased, no need to use credits
    }
    
    // Try to use a credit
    const creditUsed = this.useCredit();
    if (creditUsed) {
      console.log('[RiskMapService] Credit used successfully, adding to purchased reports');
      // Add to purchased reports
      this.addPurchasedReport(transactionId, riskMapType);
      return true;
    } else {
      console.log('[RiskMapService] Failed to use credit - insufficient credits');
    }
    
    return false; // Not enough credits
  }
  
  // Get full risk score and report
  async fetchFullRiskReport(transactionId: string, riskMapType: RiskMapType): Promise<any> {
    // Check if the report is purchased or purchase it now
    const isPurchased = this.isReportPurchased(transactionId, riskMapType) || 
                        this.purchaseReport(transactionId, riskMapType);
    
    if (!isPurchased) {
      throw new Error('Insufficient credits to purchase report');
    }
    
    // Fetch both risk data and detailed report
    const [riskData, fullReport] = await Promise.all([
      this.fetchRiskData(riskMapType),
      evaReportApi.fetchFullReport(transactionId, riskMapType)
    ]);
    
    // Combine the data
    return {
      ...riskData,
      reportDetails: fullReport,
      isPremium: true
    };
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