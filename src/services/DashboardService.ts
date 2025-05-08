import { UserType } from '../types/UserTypes';
import AuthService from './AuthService';
import { mockTransactions, mockActivities } from '../api/mockData';

/**
 * Dashboard Service
 * 
 * Service for fetching and filtering dashboard data based on user role
 */
class DashboardService {
  private static instance: DashboardService;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }
  
  /**
   * Get dashboard data based on user role
   */
  public async getDashboardData() {
    try {
      const user = AuthService.getCurrentUser();
      const userType = user?.userType || UserType.BUSINESS;
      
      console.log('DashboardService: Getting data for user type:', userType);
      
      // In a real app, this would make API calls with the user's role
      // passed as a parameter to filter data on the server side
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get data with role-based filtering
      const transactions = this.getFilteredTransactions(userType);
      const activities = this.getFilteredActivities(userType);
      const metrics = this.getMetrics(userType);
      
      console.log('DashboardService: Successfully retrieved dashboard data');
      
      return {
        transactions,
        activities,
        metrics
      };
    } catch (error) {
      console.error('DashboardService: Error getting dashboard data:', error);
      // Return fallback data instead of throwing to prevent UI crashes
      return {
        transactions: [],
        activities: [],
        metrics: {
          activeDeals: 0,
          dealVolume: 0,
          avgProcessingTime: 0,
          completedDeals: 0
        }
      };
    }
  }
  
  /**
   * Filter transactions based on user role
   */
  private getFilteredTransactions(userType: UserType) {
    // In a real app, this would be handled by the backend
    // Here we simulate role-based filtering
    
    // Clone the mock data to avoid mutations
    const transactions = [...mockTransactions];
    
    switch (userType) {
      case UserType.BUSINESS:
        // Borrowers see only their own transactions
        // For demo, we'll just limit to 1-2 transactions
        return transactions.slice(0, 1);
        
      case UserType.VENDOR:
        // Vendors see transactions related to their equipment/inventory
        // For demo, show only equipment financing transactions
        return transactions.filter(t => 
          t.type.toLowerCase().includes('equipment') || 
          t.type.toLowerCase().includes('inventory')
        );
        
      case UserType.BROKERAGE:
        // Brokers see all transactions they originated
        // For demo, we'll show most transactions but not all
        return transactions.slice(0, 4);
        
      case UserType.LENDER:
        // Lenders see all transactions
        return transactions;
        
      default:
        return transactions;
    }
  }
  
  /**
   * Filter activities based on user role
   */
  private getFilteredActivities(userType: UserType) {
    // In a real app, this would be handled by the backend
    // Here we simulate role-based filtering
    
    // Clone the mock data to avoid mutations
    const activities = [...mockActivities];
    
    switch (userType) {
      case UserType.BUSINESS:
        // Borrowers see their own activities and communications from others
        return activities.filter(a => 
          a.userType === UserType.BUSINESS || 
          a.description.toLowerCase().includes('approved') ||
          a.description.toLowerCase().includes('completed')
        );
        
      case UserType.VENDOR:
        // Vendors see their inventory and related financing activities
        return activities.filter(a => 
          a.userType === UserType.VENDOR || 
          a.description.toLowerCase().includes('equipment') ||
          a.description.toLowerCase().includes('inventory')
        );
        
      case UserType.BROKERAGE:
        // Brokers see most activities except internal lender discussions
        return activities.filter(a => 
          a.userType !== UserType.LENDER || 
          !a.description.toLowerCase().includes('internal')
        );
        
      case UserType.LENDER:
        // Lenders see all activities
        return activities;
        
      default:
        return activities;
    }
  }
  
  /**
   * Get metrics based on user role
   */
  private getMetrics(userType: UserType) {
    // Different metrics for different user roles
    switch (userType) {
      case UserType.BUSINESS:
        return {
          activeDeals: 1,
          dealVolume: 250000,
          avgProcessingTime: 16.5,
          completedDeals: 0,
          statusProgress: 22, // percent
          estTimeToCompletion: 14 // days
        };
        
      case UserType.VENDOR:
        return {
          activeDeals: 5,
          dealVolume: 560000,
          avgProcessingTime: 12.8,
          completedDeals: 3,
          inventoryItems: 14,
          pendingApprovals: 5
        };
        
      case UserType.BROKERAGE:
        return {
          activeDeals: 9,
          dealVolume: 1850000,
          avgProcessingTime: 15.2,
          completedDeals: 6,
          commissionForecast: 24580,
          clientsInPipeline: 24
        };
        
      case UserType.LENDER:
        return {
          activeDeals: 12,
          dealVolume: 2750000,
          avgProcessingTime: 18.5,
          completedDeals: 8,
          portfolioPerformance: 95.2, // percent
          dueDiligenceScore: 87 // percent
        };
        
      default:
        return {
          activeDeals: 0,
          dealVolume: 0,
          avgProcessingTime: 0,
          completedDeals: 0
        };
    }
  }
  
  /**
   * Get due diligence data (primarily for lenders)
   */
  public async getDueDiligenceData() {
    try {
      console.log('DashboardService: Getting due diligence data');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Only lenders get full due diligence data
      const user = AuthService.getCurrentUser();
      const userType = user?.userType || UserType.BUSINESS;
      
      console.log('DashboardService: Due diligence data requested for user type:', userType);
      
      if (userType !== UserType.LENDER) {
        console.log('DashboardService: User is not a lender, returning empty due diligence data');
        return [];
      }
      
      const dueDiligenceData = [
        { category: 'Financial', completed: 8, total: 10, trend: 'up' },
        { category: 'Legal', completed: 5, total: 6, trend: 'stable' },
        { category: 'Operational', completed: 7, total: 12, trend: 'down' },
        { category: 'Market', completed: 4, total: 8, trend: 'up' },
        { category: 'Management', completed: 6, total: 6, trend: 'up' }
      ];
      
      console.log('DashboardService: Successfully retrieved due diligence data');
      return dueDiligenceData;
    } catch (error) {
      console.error('DashboardService: Error getting due diligence data:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }
}

// Export singleton instance
export default DashboardService.getInstance(); 