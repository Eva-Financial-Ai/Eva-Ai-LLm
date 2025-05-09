import { Transaction } from '../../contexts/WorkflowContext';
import { mockTransactions } from '../../api/mockData';

interface DiagnosticResult {
  component: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  fixes?: string[];
  autoFixed?: boolean;
}

class DiagnosticService {
  private static instance: DiagnosticService;
  private isRunning: boolean = false;
  private lastResults: DiagnosticResult[] = [];
  private errorCallback?: (error: Error) => void;
  private resultCallback?: (results: DiagnosticResult[]) => void;
  private hasFixedData: boolean = false;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): DiagnosticService {
    if (!DiagnosticService.instance) {
      DiagnosticService.instance = new DiagnosticService();
    }
    return DiagnosticService.instance;
  }

  public getLastResults(): DiagnosticResult[] {
    return this.lastResults;
  }

  public isDiagnosticRunning(): boolean {
    return this.isRunning;
  }

  public setErrorCallback(callback: (error: Error) => void): void {
    this.errorCallback = callback;
  }

  public setResultCallback(callback: (results: DiagnosticResult[]) => void): void {
    this.resultCallback = callback;
  }

  private ensureRiskTransactionData(): boolean {
    // Check if we have transactions in risk_assessment stage
    try {
      // Get transactions from localStorage
      const storedTransactions = localStorage.getItem('transactions');
      let transactions: Transaction[] = storedTransactions ? JSON.parse(storedTransactions) : [];

      // Check if there are any transactions in the risk_assessment stage
      const riskTransactions = transactions.filter(t => t.currentStage === 'risk_assessment');

      if (riskTransactions.length === 0) {
        console.log('No risk assessment transactions found, adding mock data...');

        // Add the mock transactions that are in risk_assessment stage
        const riskMockTransactions = mockTransactions.filter(
          t => t.currentStage === 'risk_assessment'
        );

        if (riskMockTransactions.length > 0) {
          // Add the risk transactions to the stored transactions
          const updatedTransactions = [...transactions, ...riskMockTransactions];

          // Save back to localStorage
          localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
          this.hasFixedData = true;

          console.log(`Added ${riskMockTransactions.length} risk assessment transactions`);
          return true;
        }
      } else {
        // We already have risk assessment transactions
        console.log(`Found ${riskTransactions.length} existing risk assessment transactions`);
        return false; // No changes needed
      }
    } catch (error) {
      console.error('Error ensuring risk transaction data:', error);
    }

    return false;
  }

  public async runDiagnostics(): Promise<DiagnosticResult[]> {
    if (this.isRunning) {
      console.log('Diagnostics already running, skipping...');
      return this.lastResults;
    }

    this.isRunning = true;
    console.log('Starting automated background diagnostics...');

    try {
      const results: DiagnosticResult[] = [];

      // Check for risk assessment transactions
      const fixedData = this.ensureRiskTransactionData();

      results.push({
        component: 'RiskMapNavigator',
        status: fixedData ? 'warning' : 'ok',
        message: fixedData
          ? 'Added missing risk assessment transaction data automatically'
          : 'Risk assessment transaction data available',
        autoFixed: fixedData,
      });

      // Check for other potential issues
      // In the future, additional diagnostic checks could be added here

      this.lastResults = results;

      // Log results to console
      const successCount = results.filter(r => r.status === 'ok').length;
      const warningCount = results.filter(r => r.status === 'warning').length;
      const errorCount = results.filter(r => r.status === 'error').length;

      console.log(
        `Diagnostics completed: ${successCount} ok, ${warningCount} warnings, ${errorCount} errors`
      );
      console.log(`Auto-fixed ${results.filter(r => r.autoFixed).length} issues`);

      // Call the result callback if provided
      if (this.resultCallback) {
        this.resultCallback(results);
      }

      return results;
    } catch (error) {
      console.error('Error running automated diagnostics:', error);

      // Call the error callback if provided
      if (this.errorCallback && error instanceof Error) {
        this.errorCallback(error);
      }

      throw error;
    } finally {
      this.isRunning = false;
    }
  }
}

// Export the singleton instance
export default DiagnosticService.getInstance();

// Initialize automated diagnostics on module load if in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    DiagnosticService.getInstance()
      .runDiagnostics()
      .catch(error => {
        console.error('Automated diagnostics initialization failed:', error);
      });
  }, 3000); // Delay 3 seconds to allow app to load first
}
