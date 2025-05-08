import React from 'react';
import LazyRouter from './LazyRouter';
import LoadableRouter from './LoadableRouter';

// You can set this to 'lazy', 'loadable', or 'adaptive'
type RouterType = 'lazy' | 'loadable' | 'adaptive';
const ROUTER_TYPE: RouterType = 'lazy';

/**
 * RouterSelector component
 * 
 * This component lets you choose between different code-splitting implementations:
 * - 'lazy': Uses React.lazy with Suspense (better for simpler apps)
 * - 'loadable': Uses @loadable/component (better for SSR and more complex loading states)
 * - 'adaptive': Chooses based on device performance (uses React.lazy for faster devices,
 *               @loadable/component for slower devices to show better loading states)
 */
const RouterSelector: React.FC = () => {
  // For adaptive mode, we could check device performance
  const [routerType, setRouterType] = React.useState<RouterType>(ROUTER_TYPE);

  // In adaptive mode, we can detect device performance
  React.useEffect(() => {
    if (routerType === 'adaptive') {
      // Simple performance check - you could make this more sophisticated
      const startTime = performance.now();
      
      // Do some expensive operations to measure device performance
      for (let i = 0; i < 1000000; i++) {
        Math.sqrt(i);
      }
      
      const endTime = performance.now();
      const performanceTime = endTime - startTime;
      
      // If performance is good, use lazy loading (simpler)
      // If performance is poor, use loadable (better loading states)
      setRouterType(performanceTime < 50 ? 'lazy' : 'loadable');
      
      console.log(`Device performance check: ${performanceTime}ms - using ${performanceTime < 50 ? 'lazy' : 'loadable'} router`);
    }
  }, []);

  // Return the appropriate router
  switch (routerType) {
    case 'loadable':
      return <LoadableRouter />;
    case 'lazy':
    default:
      return <LazyRouter />;
  }
};

export default RouterSelector; 