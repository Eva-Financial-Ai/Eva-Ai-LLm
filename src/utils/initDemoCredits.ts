/**
 * Utility script to initialize demo credits for the risk report feature
 * 
 * This is used for development/demo purposes only and would not be needed
 * in a production environment where credits would be purchased through
 * a real payment system.
 */

export const initDemoCredits = (forceReset = false) => {
  // Check if credits have been initialized already
  const existingCredits = localStorage.getItem('availableCredits');
  
  // Initialize with 10 demo credits if not already set or if force reset
  // Increased from 3 to 10 to ensure enough credits for all report types
  if (!existingCredits || forceReset) {
    console.log('Initializing demo credits for risk report feature');
    localStorage.setItem('availableCredits', '10');
  }
  
  // Clear purchased reports if force reset
  if (forceReset) {
    localStorage.removeItem('purchasedReports');
  }
  
  return {
    credits: localStorage.getItem('availableCredits') || '0',
    purchasedReports: localStorage.getItem('purchasedReports') || '[]'
  };
};

// Function to add demo credits (for testing)
export const addDemoCredits = (amount = 1) => {
  const currentCredits = parseInt(localStorage.getItem('availableCredits') || '0', 10);
  const newCredits = currentCredits + amount;
  localStorage.setItem('availableCredits', newCredits.toString());
  
  console.log(`Added ${amount} demo credit(s). New total: ${newCredits}`);
  return newCredits;
};

// Function to reset all reports and credits (for testing)
export const resetDemoCreditsAndReports = () => {
  localStorage.setItem('availableCredits', '10');
  localStorage.removeItem('purchasedReports');
  
  console.log('Reset demo credits to 10 and cleared all purchased reports');
  return {
    credits: '10',
    purchasedReports: '[]'
  };
};

// Force reset credits for demo (will be triggered on import)
// This ensures the user always has enough credits
(function ensureCreditsForDemo() {
  const currentCredits = parseInt(localStorage.getItem('availableCredits') || '0', 10);
  if (currentCredits < 5) {
    console.log(`Current credits (${currentCredits}) below minimum threshold, resetting to 10`);
    resetDemoCreditsAndReports();
  }
})();

export default initDemoCredits; 