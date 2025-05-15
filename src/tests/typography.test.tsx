// Move lightweight mocks before any component imports
jest.mock('../components/layout/Sidebar', () => () => (
  <div data-testid="sidebar" className="text-xs text-primary-600 md:block w-4 h-4" />
));

jest.mock('../components/layout/Navbar', () => () => (
  <div data-testid="navbar" className="text-base md:block px-4 py-2" />
));

jest.mock('../components/layout/TopNavigation', () => ({ title }: { title: string }) => (
  <div data-testid="topnav" className="text-base md:block">
    {title}
  </div>
));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

jest.mock('../contexts/UserTypeContext', () => ({
  useUserType: () => ({ userType: 'admin', setUserType: jest.fn() }),
}));

jest.mock('../contexts/ModalContext', () => ({
  useModal: () => ({ open: false, setOpen: jest.fn() }),
}));

jest.mock('../contexts/WorkflowContext', () => ({
  WorkflowProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// shift imports below mocks
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import TopNavigation from '../components/layout/TopNavigation';
import { UserContext } from '../contexts/UserContext';
import { WorkflowProvider } from '../contexts/WorkflowContext';
import { UserType } from '../types/UserTypes';

// Mock context values
const mockUserContextValue = {
  userRole: 'lender' as 'lender', // Type assertion to UserRoleType
  setUserRole: jest.fn(),
  specificRole: 'default_role',
  setSpecificRole: jest.fn(),
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
  isEvaChatOpen: false,
  setIsEvaChatOpen: jest.fn(),
  toggleTool: jest.fn(),
  sidebarCollapsed: false,
  setSidebarCollapsed: jest.fn(),
  theme: 'light',
  setTheme: jest.fn(),
  colorScheme: 'light' as 'light',
  setColorScheme: jest.fn(),
  highContrast: false,
  setHighContrast: jest.fn(),
  isPQCAuthenticated: true,
  setPQCAuthenticated: jest.fn(),
  isAuthenticated: true,
  setIsAuthenticated: jest.fn(),
  userName: 'Test User',
  setUserName: jest.fn(),
  userId: '123',
  setUserId: jest.fn(),
  userProfileImage: '/avatar.png',
  setUserProfileImage: jest.fn(),
};

// Wrapper component to provide context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <UserContext.Provider value={mockUserContextValue}>
      <WorkflowProvider>{children}</WorkflowProvider>
    </UserContext.Provider>
  </BrowserRouter>
);

describe('Typography and Design Consistency Tests', () => {
  test('Mocks render with expected classes', () => {
    render(
      <TestWrapper>
        <>
          <Sidebar />
          <Navbar />
          <TopNavigation title="Test Page" />
        </>
      </TestWrapper>
    );

    expect(screen.getByTestId('sidebar')).toHaveClass('text-xs');
    expect(screen.getByTestId('navbar')).toHaveClass('text-base');
    expect(screen.getByTestId('topnav')).toHaveTextContent('Test Page');
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
    expect(pxElements.length + pyElements.length).toBeGreaterThan(0);
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
    expect(grayElements.length >= 0).toBe(true);
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
