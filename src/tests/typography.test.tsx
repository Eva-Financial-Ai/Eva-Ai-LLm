import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import TopNavigation from '../components/layout/TopNavigation';
import { UserContext } from '../contexts/UserContext';
import { WorkflowProvider } from '../contexts/WorkflowContext';
import { UserType } from '../types/UserTypes';

// Mock context values
const mockUserContextValue = {
  userRole: 'lender' as 'lender', // Type assertion to AppUserRole
  showSmartMatching: false,
  setShowSmartMatching: jest.fn(),
  showDataOrchestrator: false,
  setShowDataOrchestrator: jest.fn(),
  showDocVerification: false,
  setShowDocVerification: jest.fn(),
  showCreditAnalysis: false,
  setShowCreditAnalysis: jest.fn(),
  showAILifecycleAssistant: false,
  setShowAILifecycleAssistant: jest.fn(),
  toggleTool: jest.fn(),
  sidebarCollapsed: false,
  setSidebarCollapsed: jest.fn(),
  theme: 'light',
  setTheme: jest.fn(),
  isPQCAuthenticated: true,
  setPQCAuthenticated: jest.fn(),
  isAuthenticated: true,
  setIsAuthenticated: jest.fn(),
  userName: 'Test User',
  setUserName: jest.fn(),
  userId: '123',
  setUserId: jest.fn(),
  userProfileImage: '/avatar.png',
  setUserProfileImage: jest.fn()
};

// Wrapper component to provide context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <UserContext.Provider value={mockUserContextValue}>
      <WorkflowProvider>
        {children}
      </WorkflowProvider>
    </UserContext.Provider>
  </BrowserRouter>
);

describe('Typography and Design Consistency Tests', () => {
  // Test font classes consistency in Sidebar
  test('Sidebar should use consistent font classes', () => {
    const { container } = render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );
    
    // Check text sizes
    const textXsElements = container.querySelectorAll('.text-xs');
    expect(textXsElements.length).toBeGreaterThan(0);
    
    // Check for inconsistent text sizes
    const textMdElements = container.querySelectorAll('.text-md');
    const textLgElements = container.querySelectorAll('.text-lg');
    
    // We only expect text-xs and text-base in the sidebar
    expect(textMdElements.length).toBe(0);
    expect(textLgElements.length).toBeLessThanOrEqual(1); // Only for the logo
  });

  // Test Navbar typography consistency
  test('Navbar should use consistent text sizes', () => {
    const { container } = render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // Check for consistent text size classes
    const textBaseElements = container.querySelectorAll('.text-base');
    const textXsElements = container.querySelectorAll('.text-xs');
    
    // Navbar should primarily use text-xs and text-base
    expect(textBaseElements.length + textXsElements.length).toBeGreaterThan(0);
  });

  // Test TopNavigation typography consistency
  test('TopNavigation should use consistent text sizes', () => {
    const { container } = render(
      <TestWrapper>
        <TopNavigation title="Test Page" />
      </TestWrapper>
    );
    
    // TopNavigation should use text-base for titles and text-xs for buttons
    const textBaseElements = container.querySelectorAll('.text-base');
    const textXsElements = container.querySelectorAll('.text-xs');
    
    expect(textBaseElements.length).toBeGreaterThan(0);
    expect(textXsElements.length).toBeGreaterThan(0);
  });
  
  // Test for consistent icon sizes in Sidebar
  test('Sidebar should have consistent icon sizes', () => {
    const { container } = render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );
    
    // Check icon sizes
    const w4Icons = container.querySelectorAll('.w-4');
    const h4Icons = container.querySelectorAll('.h-4');
    const w5Icons = container.querySelectorAll('.w-5');
    const h5Icons = container.querySelectorAll('.h-5');
    
    // All w-4 should have corresponding h-4, and all w-5 should have h-5
    expect(w4Icons.length).toBe(h4Icons.length);
    expect(w5Icons.length).toBe(h5Icons.length);
  });
  
  // Test for consistent padding and margins in Navbar
  test('Navbar should have consistent spacing', () => {
    const { container } = render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // Check padding classes
    const pxElements = container.querySelectorAll('[class*="px-"]');
    const pyElements = container.querySelectorAll('[class*="py-"]');
    
    // There should be some elements with consistent padding
    expect(pxElements.length).toBeGreaterThan(0);
    expect(pyElements.length).toBeGreaterThan(0);
  });
  
  // Test for color consistency in Sidebar
  test('Sidebar should use colors from the design system', () => {
    const { container } = render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );
    
    // Check for primary colors
    const primaryColorElements = container.querySelectorAll('[class*="text-primary-"]');
    const primaryBgElements = container.querySelectorAll('[class*="bg-primary-"]');
    
    // Sidebar should use primary colors from the design system
    expect(primaryColorElements.length + primaryBgElements.length).toBeGreaterThan(0);
    
    // Check for consistent gray scale
    const grayElements = container.querySelectorAll('[class*="text-gray-"]');
    
    // Sidebar should use consistent gray colors
    expect(grayElements.length).toBeGreaterThan(0);
  });
  
  // Test for responsive classes
  test('Components should include responsive design classes', () => {
    const { container: sidebarContainer } = render(
      <TestWrapper>
        <Sidebar />
      </TestWrapper>
    );
    
    const { container: navbarContainer } = render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );
    
    // Check for responsive classes like md:, sm:, etc.
    const sidebarResponsiveClasses = sidebarContainer.querySelectorAll('[class*="md:"]');
    const navbarResponsiveClasses = navbarContainer.querySelectorAll('[class*="md:"]');
    
    // Components should include responsive classes
    expect(sidebarResponsiveClasses.length).toBeGreaterThan(0);
    expect(navbarResponsiveClasses.length).toBeGreaterThan(0);
  });
}); 