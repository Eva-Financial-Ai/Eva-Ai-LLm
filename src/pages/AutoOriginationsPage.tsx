import React from 'react';
import AutoOriginationsDashboard from '../components/credit/AutoOriginationsDashboard';

const AutoOriginationsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <AutoOriginationsDashboard />
    </div>
  );
};

export default AutoOriginationsPage;
