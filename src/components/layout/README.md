# Layout Components

This directory contains the core UI layout components that provide the structure and navigation framework for the Eva AI financial services platform. These components establish a consistent, accessible, and responsive user interface throughout the application.

## Overview

The Layout system implements several key structural components:

1. **Navigation Systems**: Primary and secondary navigation interfaces
2. **Responsive Sidebar**: Collapsible sidebar with context-aware navigation
3. **Top Navigation Bar**: Application header with user controls and global actions
4. **Specialized Navigation**: Context-specific navigation components
5. **Layout Containers**: Structured content areas with consistent styling

These components provide a complete layout infrastructure for:
- Consistent navigation throughout the application
- Responsive design across device sizes
- Context-aware menu systems
- User account and preference controls
- Application branding and identity
- Accessibility compliance

## Components

### 1. Sidebar

The primary navigation sidebar that provides access to the application's main features:

```jsx
import Sidebar from './components/layout/Sidebar';

// Example usage
<Sidebar 
  activeItem="risk"
  collapsed={sidebarCollapsed}
  onToggleCollapse={handleSidebarToggle}
/>
```

### 2. Navbar

The top navigation bar containing global controls, search, and user account features:

```jsx
import Navbar from './components/layout/Navbar';

// Example usage
<Navbar 
  user={currentUser}
  onUserMenuClick={handleUserMenuClick}
  onNotificationsClick={handleNotificationsClick}
/>
```

### 3. TopNavigation

Secondary navigation bar providing contextual navigation options:

```jsx
import TopNavigation from './components/layout/TopNavigation';

// Example usage
<TopNavigation
  title="Risk Assessment"
  backUrl="/transactions"
  actions={pageActions}
/>
```

### 4. MainNavigation

Primary application navigation with responsive behavior:

```jsx
import MainNavigation from './components/layout/MainNavigation';

// Example usage
<MainNavigation
  navigationItems={mainNavigationItems}
  currentPath={location.pathname}
/>
```

### 5. BlockchainNavigation

Specialized navigation for blockchain-related features:

```jsx
import BlockchainNavigation from './components/layout/BlockchainNavigation';

// Example usage
<BlockchainNavigation
  activeSection="portfolio"
  walletConnected={isWalletConnected}
/>
```

## Implementation Details

### Responsive Behavior

The layout components are designed to provide optimal experiences across different device sizes:

- **Desktop**: Full sidebar with expanded text labels and icons
- **Tablet**: Collapsible sidebar with icon-only display when collapsed
- **Mobile**: Sidebar transforms into a slide-out menu accessible via hamburger icon

### Navigation Structure

The application employs a hierarchical navigation structure:
1. **Primary Navigation**: Main application sections via Sidebar
2. **Secondary Navigation**: Section-specific options via TopNavigation
3. **Tertiary Navigation**: Page-specific tabs or segmented controls
4. **Contextual Actions**: Context-specific buttons and controls

### Theming Support

The layout components support theming through:
- CSS variables for color schemes
- Consistent spacing through Tailwind classes
- Standardized component styling
- Dark/light mode support

## Integration with Other Services

The Layout components integrate with several other Eva AI services:

- **User Management**: Displays user information and controls
- **Notification Service**: Shows notifications and alerts
- **Authentication**: Handles login state and secure area access
- **Permission System**: Shows/hides navigation items based on user role

## Accessibility Features

- Semantic HTML with appropriate ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Sufficient color contrast
- Text resizing support

## Usage Examples

### Complete Application Layout

```jsx
// In your App component
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import { useState } from 'react';

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeItem={determineActiveNavItem()}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleSidebarToggle}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar 
          user={currentUser}
          onUserMenuClick={handleUserMenuClick}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={handleSidebarToggle}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Page content */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

### Page with Context Navigation

```jsx
// In your page component
import TopNavigation from './components/layout/TopNavigation';

const TransactionDetailPage = ({ transactionId }) => {
  const pageActions = [
    { label: 'Edit', icon: 'edit', onClick: handleEdit },
    { label: 'Delete', icon: 'trash', onClick: handleDelete },
    { label: 'Share', icon: 'share', onClick: handleShare }
  ];
  
  return (
    <div className="space-y-6">
      <TopNavigation
        title="Transaction Details"
        backUrl="/transactions"
        actions={pageActions}
      />
      
      <div className="bg-white rounded-lg shadow p-6">
        {/* Page content */}
        Transaction content for ID: {transactionId}
      </div>
    </div>
  );
};
```

### Specialized Navigation Example

```jsx
// In your blockchain section component
import BlockchainNavigation from './components/layout/BlockchainNavigation';

const BlockchainDashboard = () => {
  return (
    <div className="space-y-6">
      <BlockchainNavigation
        activeSection="dashboard"
        walletConnected={isWalletConnected}
        walletAddress={connectedWalletAddress}
        onConnectWallet={handleConnectWallet}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard content */}
        <BlockchainWidgets />
      </div>
    </div>
  );
};
``` 