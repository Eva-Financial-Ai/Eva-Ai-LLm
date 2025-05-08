import runComponentTests from './ComponentTesterRunner';

// Run the tests when the page loads
window.onload = () => {
  console.log('Starting component test runner...');
  runComponentTests();
}; 