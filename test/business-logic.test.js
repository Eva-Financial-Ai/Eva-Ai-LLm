const { 
  calculateLoanAmount, 
  calculateMonthlyPayment, 
  validateCreditApplication 
} = require('./finance');

// Tests for business logic
describe('Financial Business Logic', () => {
  describe('calculateLoanAmount', () => {
    it('calculates correct loan amount', () => {
      expect(calculateLoanAmount(100000, 20000)).toBe(80000);
      expect(calculateLoanAmount(50000, 5000)).toBe(45000);
    });
    
    it('returns 0 when down payment equals or exceeds asset price', () => {
      expect(calculateLoanAmount(100000, 100000)).toBe(0);
      expect(calculateLoanAmount(100000, 120000)).toBe(0);
    });
  });
  
  describe('calculateMonthlyPayment', () => {
    it('calculates monthly payment with interest', () => {
      // $10,000 loan at 5% interest for 3 years (36 months)
      // Monthly payment should be approximately $299.71
      const payment = calculateMonthlyPayment(10000, 5, 36);
      expect(payment).toBeCloseTo(299.71, 1);
    });
    
    it('calculates monthly payment with zero interest', () => {
      // $12,000 loan at 0% interest for 4 years (48 months)
      // Monthly payment should be exactly $250
      const payment = calculateMonthlyPayment(12000, 0, 48);
      expect(payment).toBe(250);
    });
  });
  
  describe('validateCreditApplication', () => {
    it('validates a complete application', () => {
      const validApplication = {
        businessName: 'Acme Corp',
        taxId: '12-3456789',
        loanAmount: 50000
      };
      
      const result = validateCreditApplication(validApplication);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    it('returns errors for an incomplete application', () => {
      const incompleteApplication = {
        businessName: '',
        taxId: 'invalid',
        loanAmount: 0
      };
      
      const result = validateCreditApplication(incompleteApplication);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBe(3);
      expect(result.errors.businessName).toBeDefined();
      expect(result.errors.taxId).toBeDefined();
      expect(result.errors.loanAmount).toBeDefined();
    });
  });
}); 