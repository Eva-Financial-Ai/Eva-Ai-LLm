const { formatCurrency, calculatePercentage, truncateText } = require('./utils');

// Tests for our utility functions
describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats a number as currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('calculatePercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculatePercentage(50, 200)).toBe(25);
      expect(calculatePercentage(150, 300)).toBe(50);
      expect(calculatePercentage(0, 100)).toBe(0);
    });

    it('returns 0 when total is 0', () => {
      expect(calculatePercentage(50, 0)).toBe(0);
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than specified length', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 10)).toBe('This is a ...');
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
    });

    it('does not truncate text shorter than specified length', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
    });

    it('handles empty text', () => {
      expect(truncateText('')).toBe('');
      expect(truncateText(null)).toBe('');
      expect(truncateText(undefined)).toBe('');
    });
  });
}); 