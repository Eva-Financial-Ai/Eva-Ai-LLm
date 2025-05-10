import React from 'react';
import TopNavigation from '../components/layout/TopNavigation';

const Borrowers: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Borrowers Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">
          This is a placeholder for the Borrowers page. It will display a list of borrowers and
          their details.
        </p>
      </div>
    </div>
  );
};

export default Borrowers;
