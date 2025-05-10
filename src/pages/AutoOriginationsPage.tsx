import React from 'react';
import AutoOriginationsDashboard from '../components/credit/AutoOriginationsDashboard';
import PageLayout from '../components/layout/PageLayout';

const AutoOriginationsPage: React.FC = () => {
  return (
    <PageLayout title="Auto Originations">
      <div className="flex-grow overflow-hidden">
        <AutoOriginationsDashboard />
      </div>
    </PageLayout>
  );
};

export default AutoOriginationsPage;
