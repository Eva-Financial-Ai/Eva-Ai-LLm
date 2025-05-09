import React, { useState } from 'react';
import ViewSwitcher from '../common/ViewSwitcher';

interface SmartMatchHeaderProps {
  onViewChange?: (view: string) => void;
  initialView?: string;
}

const SmartMatchHeader: React.FC<SmartMatchHeaderProps> = ({
  onViewChange,
  initialView = 'borrower',
}) => {
  const [currentView, setCurrentView] = useState(initialView);

  const viewOptions = [
    { id: 'broker', label: 'Broker View', value: 'broker' },
    { id: 'lender', label: 'Lender View', value: 'lender' },
    { id: 'borrower', label: 'Borrower View', value: 'borrower' },
    { id: 'vendor', label: 'Vendor View', value: 'vendor' },
  ];

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (onViewChange) {
      onViewChange(view);
    }
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-semibold text-gray-800">Smart Match</h1>
            <p className="text-sm text-gray-500">View and manage your matched opportunities</p>
          </div>

          <div className="w-full md:w-48">
            <ViewSwitcher
              options={viewOptions}
              selectedOption={currentView}
              onChange={handleViewChange}
              label="Select View"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartMatchHeader;
