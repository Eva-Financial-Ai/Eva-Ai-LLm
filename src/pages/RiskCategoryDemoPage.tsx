import React from 'react';
import { RiskCategoryDemo } from '../components/risk';
import TopNavigation from '../components/layout/TopNavigation';

const RiskCategoryDemoPage: React.FC = () => {
  return (
    <div className="container max-w-full px-4 py-6">
      {/* Page header */}
      <div className="mb-8">
        <TopNavigation title="Risk Category Demo" showTransactionSelector={false} />
      </div>
      
      {/* Demo component */}
      <RiskCategoryDemo />
    </div>
  );
};

export default RiskCategoryDemoPage; 