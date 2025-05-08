import React, { lazy } from 'react';
import { ComponentMap } from './ComponentTester';

interface ScanOptions {
  componentDirs: string[];
  excludeDirs?: string[];
  excludeFiles?: string[];
  recursive?: boolean;
}

interface ScanResult {
  componentMap: ComponentMap;
  errors: Array<{ file: string; error: string }>;
}

/**
 * Scans directories for React components and builds a component map
 * This is a mock implementation that works in the browser environment
 * In a real app, you would use a Node.js version that actually scans the filesystem
 */
export const scanComponents = async (options: ScanOptions): Promise<ScanResult> => {
  // This is a browser-friendly implementation 
  // In a real application running Node.js, this would use the filesystem

  const componentMap: ComponentMap = {};
  const errors: Array<{ file: string; error: string }> = [];
  
  // Import key components for testing
  try {
    // Risk module components
    // Use dynamic imports with a wrapper to handle named exports
    const RiskMapEvaReport = lazy(() => 
      import('../risk/RiskMapEvaReport').then(module => ({ 
        default: module.RiskMapEvaReport 
      }))
    );
    
    componentMap['RiskMapEvaReport'] = { 
      component: RiskMapEvaReport,
      defaultProps: { } 
    };
    
    const RiskMapNavigator = lazy(() => import('../risk/RiskMapNavigator'));
    componentMap['RiskMapNavigator'] = { 
      component: RiskMapNavigator,
      defaultProps: { 
        onCategorySelect: () => {},
        selectedCategory: 'credit',
      } 
    };
    
    const RiskAssessment = lazy(() => import('../risk/RiskAssessment'));
    componentMap['RiskAssessment'] = { 
      component: RiskAssessment
    };
    
    // You can add more components here for testing
    
  } catch (error) {
    console.error('Error importing components:', error);
    errors.push({ 
      file: 'ImportError', 
      error: error instanceof Error ? error.message : 'Unknown error importing components' 
    });
  }
  
  return { componentMap, errors };
}; 