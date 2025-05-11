import { Metric, onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

// Fix TypeScript type for window.gtag
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, eventParams: any) => void;
  }
}

// Helper function to send metrics to analytics
const sendToAnalytics = (metric: Metric) => {
  const { name, delta, id, value } = metric;

  // In production, you would send these metrics to your analytics service
  // Example: sending to Google Analytics
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      non_interaction: true,
    });
  }

  // Example: sending to a custom monitoring endpoint
  if (process.env.REACT_APP_METRICS_ENDPOINT) {
    const body = JSON.stringify({ name, delta, id, value });
    const url = process.env.REACT_APP_METRICS_ENDPOINT;
    
    // Use Navigator.sendBeacon() if available, falling back to fetch()
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, {
        body,
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Always log to console in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital: ${name}`, { id, delta, value });
  }
};

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void): void => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Use the correct v3 functions from web-vitals
    onCLS(onPerfEntry); 
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals; 