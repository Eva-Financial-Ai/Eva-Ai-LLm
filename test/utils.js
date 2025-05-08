// Utility functions for testing
const formatCurrency = (value) => {
  return `$${parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

const calculatePercentage = (part, total) => {
  if (!total) return 0;
  return (part / total) * 100;
};

const truncateText = (text, length = 30) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

module.exports = {
  formatCurrency,
  calculatePercentage,
  truncateText
}; 