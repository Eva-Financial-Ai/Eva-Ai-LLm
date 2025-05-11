# EVA Platform Frontend Performance Guide

This guide provides best practices and strategies for optimizing the performance of the EVA Platform Frontend application. Follow these guidelines to ensure a fast, responsive user experience.

## Table of Contents
1. [React Performance Optimization](#react-performance-optimization)
2. [Code Splitting](#code-splitting)
3. [Memoization](#memoization)
4. [Network Performance](#network-performance)
5. [State Management](#state-management)
6. [Performance Measurement](#performance-measurement)
7. [Resource Loading](#resource-loading)
8. [Rendering Optimization](#rendering-optimization)
9. [Authorization Performance](#authorization-performance)
10. [Browser DevTools](#browser-devtools)

## React Performance Optimization

### Component Rendering

- Use functional components with hooks
- Implement `React.memo` for pure components to prevent unnecessary re-renders
- Keep component state as local as possible
- Avoid complex calculations in render functions

```jsx
// Good example
const UserCard = React.memo(({ user }) => {
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});
```

### Event Handlers

- Use `useCallback` for event handlers passed to child components
- Debounce handlers for frequently triggered events like scrolling or resizing

```jsx
// Good example
const handleSearch = useCallback(
  debounce((term) => {
    searchUsers(term);
  }, 300),
  []
);
```

## Code Splitting

### Route-Based Splitting

We use React.lazy and Suspense for code splitting:

```jsx
// Implementation in src/App.jsx
import React, { Suspense, lazy } from 'react';
import { LoadingFallback } from './components/common/LoadingFallback';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const RiskAssessment = lazy(() => import('./pages/RiskAssessment'));
const DocumentCenter = lazy(() => import('./pages/DocumentCenter'));

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/risk" element={<RiskAssessment />} />
        <Route path="/documents" element={<DocumentCenter />} />
      </Routes>
    </Suspense>
  );
}
```

### Component-Level Splitting

For large components that aren't immediately visible:

```jsx
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));

function ParentComponent() {
  const [showHeavyComponent, setShowHeavyComponent] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowHeavyComponent(true)}>
        Show Advanced Options
      </button>
      
      {showHeavyComponent && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

## Memoization

### React.memo

Use `React.memo` for components that render the same result given the same props:

```jsx
const TransactionCard = React.memo(({ transaction }) => {
  return (
    <div className="card">
      <h3>{transaction.name}</h3>
      <p>${transaction.amount}</p>
    </div>
  );
});
```

### useMemo

Use `useMemo` for expensive calculations:

```jsx
function DataAnalytics({ transactions }) {
  // Memoize expensive calculation
  const statistics = useMemo(() => {
    return {
      total: transactions.reduce((sum, t) => sum + t.amount, 0),
      average: transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length,
      max: Math.max(...transactions.map(t => t.amount)),
      count: transactions.length
    };
  }, [transactions]);
  
  return (
    <div>
      <p>Total: ${statistics.total}</p>
      <p>Average: ${statistics.average}</p>
      <p>Max: ${statistics.max}</p>
      <p>Count: {statistics.count}</p>
    </div>
  );
}
```

### useCallback

Use `useCallback` for functions passed as props to avoid unnecessary renders:

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  // Memoize callback
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
}
```

## Network Performance

### API Client Optimization

- Implement request batching for multiple related requests
- Use caching for frequently accessed data
- Cancel stale requests when component unmounts

```jsx
function useData(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        const response = await fetch(endpoint, { 
          signal: controller.signal 
        });
        const result = await response.json();
        
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error(error);
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [endpoint]);
  
  return { data, loading };
}
```

### Data Pagination

Implement pagination or virtual scrolling for large data sets:

```jsx
function TransactionList({ pageSize = 20 }) {
  const [page, setPage] = useState(1);
  const { data, loading } = useData(`/api/transactions?page=${page}&limit=${pageSize}`);
  
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="list">
            {data.items.map(item => (
              <TransactionCard key={item.id} transaction={item} />
            ))}
          </div>
          
          <Pagination 
            current={page}
            total={data.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
```

## State Management

### Context API Optimization

- Split contexts by domain to avoid unnecessary re-renders
- Use separate contexts for frequently and infrequently updated values

```jsx
// UserContext.js - User data that doesn't change often
const UserContext = createContext();

// UIContext.js - UI state that changes frequently
const UIContext = createContext();
```

### Local vs. Global State

- Keep state as local as possible
- Only lift state up when truly necessary
- Consider using reducers for complex state logic

```jsx
// Local state example
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Performance Measurement

### Web Vitals Monitoring

We track core Web Vitals metrics in production:

```jsx
// In src/index.js
import { reportWebVitals } from './reportWebVitals';

// Send results to analytics
reportWebVitals(({ name, value, id }) => {
  // Analytics tracking code
  console.log({ name, value, id });
});
```

### React DevTools Profiler

Use React DevTools Profiler to identify and fix performance issues:
1. Open Chrome DevTools
2. Go to the Profiler tab in React DevTools
3. Click "Record" and interact with your app
4. Analyze the flame graph to identify slow components

### Performance Testing

Run regular performance tests:

```bash
# Bundle size analysis
npm run analyze

# Lighthouse CI
npm run lighthouse
```

## Resource Loading

### Image Optimization

- Use responsive images with srcset
- Prefer SVG for icons
- Implement lazy loading for images

```jsx
function ImageGrid({ images }) {
  return (
    <div className="grid">
      {images.map(image => (
        <img 
          key={image.id}
          src={image.src}
          alt={image.alt}
          loading="lazy"
          width={image.width}
          height={image.height}
        />
      ))}
    </div>
  );
}
```

### Bundle Size Optimization

- Analyze bundle size regularly with `npm run analyze`
- Use tree-shaking compatible imports
- Consider smaller alternatives for large libraries

```jsx
// Bad - imports the entire library
import _ from 'lodash';

// Good - only imports what's needed
import debounce from 'lodash/debounce';
```

## Rendering Optimization

### List Rendering

Use virtualization for long lists:

```jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TransactionCard transaction={items[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={items.length}
      itemSize={80}
    >
      {Row}
    </FixedSizeList>
  );
}
```

### Conditional Rendering

Optimize conditional rendering:

```jsx
// Less efficient
function Component({ condition }) {
  if (condition) {
    return <ExpensiveComponent />;
  }
  return <SimpleComponent />;
}

// More efficient
function Component({ condition }) {
  return (
    <>
      {condition && <ExpensiveComponent />}
      {!condition && <SimpleComponent />}
    </>
  );
}
```

## Authorization Performance

### JWT Token Management

- Store JWT in memory (not localStorage) for security
- Use token refresh strategies to avoid frequent logins
- Implement silent refresh for seamless user experience

```jsx
// In src/contexts/AuthContext.jsx
function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  
  // Silent refresh when token is about to expire
  useEffect(() => {
    if (!token) return;
    
    const tokenExpiry = getTokenExpiry(token);
    const refreshThreshold = 60000; // 1 minute before expiry
    const timeUntilRefresh = tokenExpiry - Date.now() - refreshThreshold;
    
    const timerId = setTimeout(refreshToken, timeUntilRefresh);
    return () => clearTimeout(timerId);
  }, [token]);
  
  // ...auth methods
}
```

### Permission Caching

- Cache user permissions to reduce authorization checks
- Use a permissions map for O(1) lookup

```jsx
// In src/hooks/usePermissions.js
function usePermissions() {
  const { user } = useAuth();
  
  // Memoize permissions map for fast lookup
  const permissionsMap = useMemo(() => {
    if (!user?.permissions) return {};
    
    return user.permissions.reduce((map, permission) => {
      map[permission.resource] = permission.level;
      return map;
    }, {});
  }, [user?.permissions]);
  
  const hasPermission = useCallback((resource, requiredLevel) => {
    const userLevel = permissionsMap[resource] || 0;
    return userLevel >= requiredLevel;
  }, [permissionsMap]);
  
  return { hasPermission };
}
```

### Efficient Permission Checks

- Batch permission checks when possible
- Avoid redundant checks

```jsx
// In a component
function TransactionActions({ transaction }) {
  const { hasPermission } = usePermissions();
  
  // Compute all permissions at once
  const permissions = useMemo(() => ({
    canView: hasPermission('transactions', 1),
    canEdit: hasPermission('transactions', 2),
    canApprove: hasPermission('transactions', 3),
    canDelete: hasPermission('transactions', 4)
  }), [hasPermission]);
  
  return (
    <div className="actions">
      {permissions.canEdit && <EditButton transaction={transaction} />}
      {permissions.canApprove && <ApproveButton transaction={transaction} />}
      {permissions.canDelete && <DeleteButton transaction={transaction} />}
    </div>
  );
}
```

## Browser DevTools

### Useful Chrome DevTools

- **Performance tab**: For analyzing rendering performance
- **Network tab**: For analyzing API calls and resource loading
- **Lighthouse**: For overall performance auditing
- **Coverage tab**: For finding unused JavaScript and CSS

To open coverage analysis:
1. Press F12 to open DevTools
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "coverage" and select "Show Coverage"
4. Press the record button and interact with your app
5. See unused code highlighted in red

## Additional Resources

- [React Performance Documentation](https://reactjs.org/docs/optimizing-performance.html)
- [Web Vitals](https://web.dev/vitals/)
- [Performance Testing with Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analysis](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [EVA Platform Code Quality Guidelines](./docs/CONTRIBUTING.md) 