// Finance business logic functions
const calculateLoanAmount = (assetPrice, downPayment) => {
  return Math.max(0, assetPrice - downPayment);
};

const calculateMonthlyPayment = (loanAmount, interestRate, termMonths) => {
  const monthlyRate = interestRate / 100 / 12;
  if (monthlyRate === 0) return loanAmount / termMonths;
  
  return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
         (Math.pow(1 + monthlyRate, termMonths) - 1);
};

const validateCreditApplication = (application) => {
  const errors = {};
  
  if (!application.businessName) {
    errors.businessName = 'Business name is required';
  }
  
  if (!application.taxId) {
    errors.taxId = 'Tax ID is required';
  } else if (!/^\d{2}-\d{7}$/.test(application.taxId)) {
    errors.taxId = 'Tax ID must be in format XX-XXXXXXX';
  }
  
  if (!application.loanAmount || application.loanAmount <= 0) {
    errors.loanAmount = 'Loan amount must be greater than zero';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  calculateLoanAmount,
  calculateMonthlyPayment,
  validateCreditApplication
}; 