import optimizedDataService from '../api/optimizedDataService';

/**
 * Preloads commonly used data to improve application performance.
 * This should be called on application startup or user login.
 */
export function preloadCommonData(): void {
  // Preload user profile data - high priority
  optimizedDataService.preloadData(
    '/api/user-profile',
    {},
    { priority: 'high' }
  );
  
  // Preload navigation menu items
  optimizedDataService.preloadData(
    '/api/menu-items',
    {},
    { priority: 'high' }
  );
  
  // Preload basic transaction data with low priority
  optimizedDataService.preloadData(
    '/api/transactions',
    { limit: 10, page: 1 },
    { priority: 'low' }
  );
  
  // Preload communication templates with normal priority
  optimizedDataService.preloadData(
    '/api/communication-templates',
    { limit: 50 },
    { priority: 'normal' }
  );
  
  // Preload cloud accounts for the communications bar
  optimizedDataService.preloadData(
    '/api/cloud-accounts',
    {},
    { priority: 'normal' }
  );
  
  console.log('Preloaded common application data');
}

/**
 * Preloads data specific to a particular page or component
 * @param pageKey Identifier for the page or module being preloaded
 */
export function preloadPageData(pageKey: string): void {
  switch (pageKey) {
    case 'dashboard':
      // Preload dashboard-specific data
      optimizedDataService.preloadData(
        '/api/dashboard-metrics',
        {},
        { priority: 'high' }
      );
      break;
      
    case 'risk-assessment':
      // Preload risk assessment data
      optimizedDataService.preloadData(
        '/api/risk-data',
        {},
        { priority: 'high' }
      );
      break;
      
    case 'transaction-execution':
      // Preload transaction execution data
      optimizedDataService.preloadData(
        '/api/transaction-templates',
        {},
        { priority: 'high' }
      );
      optimizedDataService.preloadData(
        '/api/transaction-contacts',
        {},
        { priority: 'normal' }
      );
      break;
      
    case 'communications':
      // Preload all communications-related data
      optimizedDataService.preloadData(
        '/api/communication-templates',
        {},
        { priority: 'high' }
      );
      optimizedDataService.preloadData(
        '/api/contacts',
        {},
        { priority: 'high' }
      );
      break;
      
    default:
      console.warn(`No preload configuration for page: ${pageKey}`);
  }
}

/**
 * Clears data from cache to refresh with new data
 * @param dataKeys Array of data keys to clear
 */
export function clearCachedData(dataKeys: string[]): void {
  dataKeys.forEach(key => {
    optimizedDataService.clearCache(key);
  });
  
  console.log(`Cleared ${dataKeys.length} cached data items`);
}

export default {
  preloadCommonData,
  preloadPageData,
  clearCachedData
}; 