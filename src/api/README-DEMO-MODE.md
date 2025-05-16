# EVA Platform Demo Mode

This document explains how to use the Demo Mode feature in the EVA Platform frontend application.

## Overview

Demo Mode allows you to run and showcase the application without requiring a backend connection. It provides mock data and simulated API responses for all major features, enabling you to demonstrate the platform's capabilities in any environment.

## Features

- Complete offline operation - no backend required
- Realistic mock data for all major system features
- User role switching (lender, borrower, broker, vendor)
- Configurable network latency simulation
- AI feature toggle
- Persistent state between page reloads

## How to Enable Demo Mode

The Demo Mode toggle is accessible from any page in the application. Look for the "Live Mode" or "Demo Mode" badge in the bottom right corner of the screen.

1. Click on the mode badge to open the Demo Mode settings panel
2. Toggle "Demo Mode" to enable or disable
3. Configure additional settings as desired

## Demo Mode Settings

- **Demo Mode**: Master toggle to enable/disable demo functionality
- **Simulate Latency**: Adds realistic network delays to API calls
- **AI Features**: Toggles AI-powered features like risk analysis and insights
- **User Role**: Switch between different user perspectives (lender, borrower, broker, vendor)

## Available Mock Data

Demo Mode includes the following mock data:

- User profiles for different roles
- Transaction data with various statuses and stages
- Document templates and transaction documents
- Risk assessment data
- Financial analytics
- Activity logs
- Notifications
- AI-generated insights

## Implementation Details

The Demo Mode functionality is implemented using the following components:

### Core Components

- `src/api/mockBackendService.ts`: Contains all mock data and simulated API functions
- `src/api/demoModeService.ts`: Service to manage demo mode state
- `src/contexts/DemoModeContext.tsx`: React context for accessing demo mode settings
- `src/components/dev/DemoModeToggle.tsx`: UI component for toggling demo mode

### Integration Points

The demo mode integrates with the application's core services:

- `src/api/apiService.ts`: Enhanced to return mock data when in demo mode
- `src/api/authService.ts`: Modified to support demo logins and role switching

## Development Usage

When developing new features, you can use Demo Mode to:

1. Work offline without backend dependencies
2. Test UI components with consistent mock data
3. Develop against API endpoints that haven't been implemented yet
4. Test different user roles without multiple accounts

Simply enable Demo Mode and continue development as normal. The application will use mock data for all API calls.

## Adding Mock Data

To extend the mock data for new features:

1. Add new mock data structures to `src/api/mockBackendService.ts`
2. Create corresponding mock API functions
3. Export the new functions as part of the default export

Example:

```typescript
// Add new mock data
export const mockNewFeatureData = [
  { id: '1', name: 'Example 1' },
  { id: '2', name: 'Example 2' }
];

// Add new mock function
export const getNewFeatureData = async () => {
  await delay();
  return mockNewFeatureData;
};

// Update the default export
export default {
  // existing exports...
  newFeature: {
    getNewFeatureData
  }
};
```

## Troubleshooting

**Issue**: Demo Mode toggle not appearing
**Solution**: Ensure you're running in development mode with `NODE_ENV=development`

**Issue**: Mock data not persisting between page reloads
**Solution**: Check browser localStorage permissions and that you're saving state in the right place

**Issue**: Demo Mode doesn't reflect actual backend behavior
**Solution**: Update mock data in `mockBackendService.ts` to better match the real backend responses 